// Create context menu item when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "addToWishlist",
    title: "Add to Wishlist",
    contexts: ["page", "selection", "link", "image"]
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "addToWishlist") {
    try {
      // Get the current page's metadata
      const [{ result }] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          // Try to extract product information from the page
          const title = document.querySelector('h1')?.textContent || document.title;
          const price = document.querySelector('[itemprop="price"], .price, [class*="price" i]')?.textContent;
          const image = document.querySelector('[itemprop="image"], img[class*="product" i]')?.src 
            || document.querySelector('meta[property="og:image"]')?.content;
          const vendor = window.location.hostname.replace('www.', '');
          
          return {
            title: title?.trim(),
            price: price?.trim(),
            imageUrl: image,
            vendor,
            url: window.location.href
          };
        }
      });

      // Get the wishlist folder
      const FOLDER_NAME = "Shopping Wishlist";
      let wishlistFolder = await chrome.bookmarks.search({ title: FOLDER_NAME });
      
      if (!wishlistFolder.length) {
        wishlistFolder = [await chrome.bookmarks.create({ title: FOLDER_NAME })];
      }

      // Add to bookmarks with metadata
      await chrome.bookmarks.create({
        parentId: wishlistFolder[0].id,
        title: JSON.stringify(result),
        url: result.url
      });

      // Open the side panel to show the updated wishlist
      await chrome.sidePanel.open();

    } catch (error) {
      console.error('Error adding item to wishlist:', error);
    }
  }
});

// Open side panel when extension icon is clicked
chrome.action.onClicked.addListener(async () => {
  await chrome.sidePanel.open();
});