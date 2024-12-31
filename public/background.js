import { isRestrictedUrl, extractProductInfo } from './utils/urlUtils.js';
import { addToWishlist } from './services/bookmarkService.js';

// Create context menu item
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "addToWishlist",
    title: "Add to Wishlist",
    contexts: ["page"],
    visible: false
  });
});

// Function to check if current page is likely a product page
async function isProductPage(tabId) {
  try {
    const tab = await chrome.tabs.get(tabId);
    const url = tab.url || '';
    
    if (isRestrictedUrl(url)) {
      return false;
    }

    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId },
      func: extractProductInfo
    });

    return result.isProductPage;
  } catch (error) {
    console.error('Error checking if product page:', error);
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
      await chrome.contextMenus.update("addToWishlist", {
        visible: true
      });
    }
  }
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "addToWishlist") {
    try {
      const [{ result }] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: extractProductInfo
      });

      await addToWishlist(result.productInfo);

      // Open side panel with success message
      const url = chrome.runtime.getURL('index.html') + 
                  `?status=added&title=${encodeURIComponent(result.productInfo.title)}`;
      
      if (chrome.sidePanel) {
        await chrome.sidePanel.open({ url });
      } else {
        await chrome.windows.create({
          url,
          type: 'popup',
          width: 400,
          height: 600
        });
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  }
});

// Handle side panel requests
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === "openSidePanel") {
    try {
      const url = chrome.runtime.getURL('index.html');
      if (chrome.sidePanel) {
        await chrome.sidePanel.open({ url });
      } else {
        await chrome.windows.create({
          url,
          type: 'popup',
          width: 400,
          height: 600
        });
      }
    } catch (error) {
      console.error('Error opening side panel:', error);
    }
  }
});