// Create context menu item when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "addToWishlist",
    title: "Add to Wishlist",
    contexts: ["page", "selection", "link", "image"]
  });
});

// Function to check if current page is likely a product page
async function isProductPage(tabId) {
  try {
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        // Check for common product page indicators
        const hasPrice = !!document.querySelector('[itemprop="price"], .price, [class*="price" i], [data-price]');
        const hasAddToCart = !!document.querySelector('button[contains(translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "cart")], [class*="add-to-cart" i], [id*="add-to-cart" i]');
        const hasProductTitle = !!document.querySelector('[itemprop="name"], h1');
        const hasProductImage = !!document.querySelector('[itemprop="image"], img[class*="product" i]');
        
        // Check URL for common product page patterns
        const urlIndicators = [
          '/product/', 
          '/item/', 
          '/p/', 
          'pid=', 
          'product_id=',
          '/buy/',
          '/goods/',
          'sku=',
          'item_id=',
          '/dp/'  // Amazon-style product URLs
        ];
        
        // Check URL for common catalog page patterns (negative indicators)
        const catalogIndicators = [
          '/category/',
          '/collection/',
          '/catalog/',
          '/shop/',
          '/products/',
          '/search',
          'category_id=',
          '/list/',
          '/browse/'
        ];
        
        const url = window.location.href.toLowerCase();
        const hasProductUrl = urlIndicators.some(indicator => url.includes(indicator));
        const hasCatalogUrl = catalogIndicators.some(indicator => url.includes(indicator));
        
        // Consider it a product page if it has most of these indicators
        // and doesn't match catalog patterns
        const indicators = [hasPrice, hasAddToCart, hasProductTitle, hasProductImage, hasProductUrl];
        const score = indicators.filter(Boolean).length;
        
        return score >= 3 && !hasCatalogUrl;
      }
    });
    return result;
  } catch (error) {
    console.error('Error checking if product page:', error);
    return false;
  }
}

// Update context menu visibility based on page type
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    const isProduct = await isProductPage(tabId);
    chrome.contextMenus.update("addToWishlist", {
      visible: isProduct
    });
  }
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

      // Open the side panel and show success message
      try {
        await chrome.sidePanel.setOptions({
          enabled: true,
          path: "index.html?status=added&title=" + encodeURIComponent(result.title)
        });
        await chrome.sidePanel.open();
      } catch (error) {
        console.error('Error opening side panel:', error);
      }

    } catch (error) {
      console.error('Error adding item to wishlist:', error);
    }
  }
});

// Open side panel when extension icon is clicked
chrome.action.onClicked.addListener(async () => {
  try {
    await chrome.sidePanel.setOptions({
      enabled: true,
      path: "index.html"
    });
    await chrome.sidePanel.open();
  } catch (error) {
    console.error('Error opening side panel:', error);
  }
});