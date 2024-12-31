// Bookmark management service
export const addToWishlist = async (productInfo) => {
  try {
    const FOLDER_NAME = "Shopping Wishlist";
    
    // Search for wishlist folder
    const folders = await chrome.bookmarks.search({ title: FOLDER_NAME });
    
    // Get or create folder in bookmarks bar
    let folderId;
    if (folders.length === 0) {
      const newFolder = await chrome.bookmarks.create({
        title: FOLDER_NAME,
        parentId: "1" // Bookmarks bar
      });
      folderId = newFolder.id;
    } else {
      const folder = folders[0];
      // Move to bookmarks bar if needed
      if (folder.parentId !== "1") {
        const movedFolder = await chrome.bookmarks.move(folder.id, { parentId: "1" });
        folderId = movedFolder.id;
      } else {
        folderId = folder.id;
      }
    }

    // Create bookmark with product info
    await chrome.bookmarks.create({
      parentId: folderId,
      title: JSON.stringify(productInfo),
      url: productInfo.url
    });

    return true;
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    throw error;
  }
};