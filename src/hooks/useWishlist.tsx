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
          
          // If folder doesn't exist, create it in the bookmarks bar
          if (folders.length === 0) {
            console.log('Creating wishlist folder in bookmarks bar...');
            const newFolder = await chrome.bookmarks.create({
              title: FOLDER_NAME,
              parentId: "1" // "1" is the ID of the bookmarks bar
            });
            folderId = newFolder.id;
          } else {
            // If folder exists but is not in bookmarks bar, move it there
            const folder = folders[0];
            if (folder.parentId !== "1") {
              console.log('Moving wishlist folder to bookmarks bar...');
              await chrome.bookmarks.move(folder.id, { parentId: "1" });
            }
            folderId = folder.id;
          }

          console.log('Fetching bookmarks from folder:', folderId);
          
          // Get all bookmarks in the folder
          const bookmarks = await chrome.bookmarks.getChildren(folderId);
          console.log('Found bookmarks:', bookmarks);
          
          // Transform bookmarks into wishlist items
          const wishlistItems = bookmarks.map(bookmark => {
            // Try to parse the extra data stored in the title
            let extraData = {};
            try {
              const titleParts = bookmark.title.split(' | ');
              if (titleParts.length > 1) {
                extraData = JSON.parse(titleParts[1]);
              }
            } catch (e) {
              console.error('Error parsing bookmark extra data:', e);
            }

            return {
              id: bookmark.id,
              title: bookmark.title.split(' | ')[0], // Get the actual title
              url: bookmark.url || '',
              imageUrl: (extraData as any)?.imageUrl || '',
              price: (extraData as any)?.price || '',
              vendor: (extraData as any)?.vendor || '',
              dateAdded: bookmark.dateAdded || Date.now(),
            };
          });

          console.log('Transformed wishlist items:', wishlistItems);
          setItems(wishlistItems);
        } else {
          console.log('Chrome bookmarks API not available, using localStorage fallback');
          // Fallback for development environment
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

      return () => {
        chrome.bookmarks.onCreated.removeListener(loadWishlist);
        chrome.bookmarks.onRemoved.removeListener(loadWishlist);
        chrome.bookmarks.onChanged.removeListener(loadWishlist);
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