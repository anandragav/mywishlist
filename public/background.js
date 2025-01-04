import { isRestrictedUrl, extractProductInfo } from './utils/urlUtils.js';
import { addToWishlist, getWishlistBookmarks } from './services/bookmarkService.js';

// Create context menu item
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "addToWishlist",
    title: "Add to Wishlist",
    contexts: ["page"]
  });
});

// Handle extension icon clicks
chrome.action.onClicked.addListener(() => {
  const url = chrome.runtime.getURL('index.html');
  console.log('Opening extension at URL:', url);
  chrome.tabs.create({ url });
});

// Function to check if current page is likely a product page
async function isProductPage(tabId) {
  try {
    const tab = await chrome.tabs.get(tabId);
    const url = tab.url || '';
    
    if (isRestrictedUrl(url)) {
      return false;
    }

    // Execute content script to check for product page indicators
    const results = await chrome.scripting.executeScript({
      target: { tabId },
      func: extractProductInfo
    });

    console.log('Product page check results:', results);
    return results && results[0] && results[0].result && results[0].result.isProductPage;
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
      console.log('Tab updated, is product page:', isProduct);
      chrome.contextMenus.update("addToWishlist", {
        visible: isProduct
      });
    } catch (error) {
      console.error('Error updating context menu:', error);
    }
  }
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "addToWishlist" && tab?.id) {
    try {
      console.log('Context menu clicked, extracting product info...');
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: extractProductInfo
      });

      if (results && results[0] && results[0].result) {
        const productInfo = results[0].result.productInfo;
        console.log('Product info extracted:', productInfo);
        
        await addToWishlist(productInfo);

        const baseUrl = chrome.runtime.getURL('index.html');
        const url = `${baseUrl}?status=added&title=${encodeURIComponent(productInfo.title)}`;
        console.log('Opening wishlist at URL:', url);
        chrome.tabs.create({ url });
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  }
});