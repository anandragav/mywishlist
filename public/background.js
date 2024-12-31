// Create context menu item when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "addToWishlist",
    title: "Add to Wishlist",
    contexts: ["page", "selection", "link", "image"]
  });

  // Initialize side panel
  chrome.sidePanel.setOptions({
    enabled: true,
    path: 'index.html'
  });
});

// Function to check if current page is likely a product page
async function isProductPage(tabId) {
  try {
    // First check if we can access the page
    const tab = await chrome.tabs.get(tabId);
    const url = tab.url || '';
    
    // Skip checking restricted URLs
    if (url.startsWith('chrome://') || 
        url.startsWith('chrome-extension://') || 
        url.startsWith('about:') ||
        url.startsWith('edge://') ||
        url.startsWith('brave://') ||
        url === '') {
      return false;
    }

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
    // Return false instead of throwing error for restricted pages
    return false;
  }
}

// Update context menu visibility based on page type
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    try {
      const isProduct = await isProductPage(tabId);
      await chrome.contextMenus.update("addToWishlist", {
        visible: isProduct
      });
    } catch (error) {
      console.error('Error updating context menu:', error);
      // Ensure menu is visible by default if there's an error
      await chrome.contextMenus.update("addToWishlist", {
        visible: true
      });
    }
  }
});

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

      // Set up the side panel options with success message
      await chrome.sidePanel.setOptions({
        enabled: true,
        path: `index.html?status=added&title=${encodeURIComponent(result.title)}`
      });

      // Show notification badge
      chrome.action.setBadgeText({ text: "New" });
      chrome.action.setBadgeBackgroundColor({ color: "#4CAF50" });
      
      // Clear the badge after 5 seconds
      setTimeout(() => {
        chrome.action.setBadgeText({ text: "" });
      }, 5000);

    } catch (error) {
      console.error('Error adding item to wishlist:', error);
    }
  }
});

// Handle extension icon clicks
chrome.action.onClicked.addListener(async (tab) => {
  try {
    // Always ensure the side panel is enabled first
    await chrome.sidePanel.setOptions({
      enabled: true,
      path: 'index.html'
    });
    
    // Open the side panel (this is okay because it's in response to a user click)
    await chrome.sidePanel.open({});
  } catch (error) {
    console.error('Error opening side panel:', error);
  }
});
