import { useState, useEffect } from "react";

interface WishlistItem {
  id: string;
  title: string;
  url: string;
  imageUrl?: string;
  price?: string;
  vendor?: string;
  dateAdded: number;
}

export const useWishlist = () => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const FOLDER_NAME = "Shopping Wishlist";

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        setLoading(true);
        if (typeof chrome !== 'undefined' && chrome.bookmarks) {
          // Search for the wishlist folder
          const folders = await chrome.bookmarks.search({ title: FOLDER_NAME });
          
          let folderId: string;
          
          // Get the bookmarks bar folder first to ensure it exists
          const bookmarksBar = await chrome.bookmarks.get("1");
          console.log('Bookmarks bar:', bookmarksBar);
          
          if (folders.length === 0) {
            // Create new folder in bookmarks bar
            console.log('Creating wishlist folder in bookmarks bar...');
            const newFolder = await chrome.bookmarks.create({
              title: FOLDER_NAME,
              parentId: "1"  // Bookmarks bar ID
            });
            console.log('Created new folder:', newFolder);
            folderId = newFolder.id;
          } else {
            const folder = folders[0];
            console.log('Found existing folder:', folder);
            
            // If folder exists but is not in bookmarks bar, move it
            if (folder.parentId !== "1") {
              console.log('Moving folder to bookmarks bar from parent:', folder.parentId);
              const movedFolder = await chrome.bookmarks.move(folder.id, { 
                parentId: "1" 
              });
              console.log('Moved folder:', movedFolder);
              folderId = movedFolder.id;
            } else {
              folderId = folder.id;
            }
          }

          console.log('Using folder ID:', folderId);
          
          // Get all bookmarks in the folder
          const bookmarks = await chrome.bookmarks.getChildren(folderId);
          console.log('Found bookmarks:', bookmarks);
          
          // Transform bookmarks into wishlist items
          const wishlistItems = bookmarks.map(bookmark => {
            try {
              const titleData = JSON.parse(bookmark.title);
              return {
                id: bookmark.id,
                title: titleData.title || bookmark.title,
                url: bookmark.url || '',
                imageUrl: titleData.imageUrl || '',
                price: titleData.price || '',
                vendor: titleData.vendor || '',
                dateAdded: bookmark.dateAdded || Date.now(),
              };
            } catch (e) {
              console.log('Error parsing bookmark data:', e);
              return {
                id: bookmark.id,
                title: bookmark.title,
                url: bookmark.url || '',
                dateAdded: bookmark.dateAdded || Date.now(),
              };
            }
          });

          console.log('Transformed wishlist items:', wishlistItems);
          setItems(wishlistItems);
        } else {
          console.log('Chrome bookmarks API not available, using localStorage fallback');
          const storedItems = localStorage.getItem('wishlist');
          setItems(storedItems ? JSON.parse(storedItems) : []);
        }
      } catch (err) {
        console.error('Error loading wishlist:', err);
        setError(err instanceof Error ? err.message : 'Failed to load wishlist');
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();

    // Set up bookmark listener for Chrome extension
    if (typeof chrome !== 'undefined' && chrome.bookmarks) {
      chrome.bookmarks.onCreated.addListener(loadWishlist);
      chrome.bookmarks.onRemoved.addListener(loadWishlist);
      chrome.bookmarks.onChanged.addListener(loadWishlist);
      chrome.bookmarks.onMoved.addListener(loadWishlist);

      return () => {
        chrome.bookmarks.onCreated.removeListener(loadWishlist);
        chrome.bookmarks.onRemoved.removeListener(loadWishlist);
        chrome.bookmarks.onChanged.removeListener(loadWishlist);
        chrome.bookmarks.onMoved.removeListener(loadWishlist);
      };
    }
  }, []);

  const removeFromWishlist = async (itemId: string) => {
    if (typeof chrome !== 'undefined' && chrome.bookmarks) {
      await chrome.bookmarks.remove(itemId);
      // The listener will update the items
    } else {
      const updatedItems = items.filter(item => item.id !== itemId);
      setItems(updatedItems);
      localStorage.setItem('wishlist', JSON.stringify(updatedItems));
    }
  };

  return { items, loading, error, removeFromWishlist };
};