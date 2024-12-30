import { useState, useEffect } from 'react';

export interface WishlistItem {
  id: string;
  title: string;
  url: string;
  price?: string;
  imageUrl?: string;
  vendor?: string;
  dateAdded: number;
}

export const useWishlist = () => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const FOLDER_NAME = "Shopping Wishlist";
  const STORAGE_KEY = "shopping-wishlist";

  // Check if we're running as a Chrome extension
  const isExtension = typeof chrome !== 'undefined' && chrome.bookmarks;

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      if (isExtension) {
        // Extension mode: Use Chrome Bookmarks API
        let wishlistFolder = await chrome.bookmarks.search({ title: FOLDER_NAME });
        
        if (!wishlistFolder.length) {
          wishlistFolder = [await chrome.bookmarks.create({ title: FOLDER_NAME })];
        }

        const bookmarks = await chrome.bookmarks.getChildren(wishlistFolder[0].id);
        const wishlistItems = bookmarks.map(bookmark => {
          try {
            const metadata = JSON.parse(bookmark.title);
            return {
              id: bookmark.id,
              title: metadata.title || bookmark.title,
              url: bookmark.url || '',
              price: metadata.price,
              imageUrl: metadata.imageUrl,
              vendor: metadata.vendor,
              dateAdded: bookmark.dateAdded || Date.now()
            };
          } catch {
            return {
              id: bookmark.id,
              title: bookmark.title,
              url: bookmark.url || '',
              dateAdded: bookmark.dateAdded || Date.now()
            };
          }
        });
        setItems(wishlistItems);
      } else {
        // Development mode: Use localStorage
        const storedItems = localStorage.getItem(STORAGE_KEY);
        const wishlistItems = storedItems ? JSON.parse(storedItems) : [];
        setItems(wishlistItems);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error loading wishlist:', err);
      setError('Failed to load wishlist');
      setLoading(false);
    }
  };

  const addToWishlist = async (item: Omit<WishlistItem, 'id' | 'dateAdded'>) => {
    try {
      if (isExtension) {
        // Extension mode: Use Chrome Bookmarks API
        const folders = await chrome.bookmarks.search({ title: FOLDER_NAME });
        const folderId = folders[0].id;

        const metadata = {
          title: item.title,
          price: item.price,
          imageUrl: item.imageUrl,
          vendor: item.vendor
        };

        await chrome.bookmarks.create({
          parentId: folderId,
          title: JSON.stringify(metadata),
          url: item.url
        });

        await loadWishlist();
      } else {
        // Development mode: Use localStorage
        const newItem: WishlistItem = {
          ...item,
          id: crypto.randomUUID(),
          dateAdded: Date.now()
        };
        
        const updatedItems = [...items, newItem];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
        setItems(updatedItems);
      }
    } catch (err) {
      console.error('Error adding to wishlist:', err);
      setError('Failed to add item to wishlist');
    }
  };

  const removeFromWishlist = async (itemId: string) => {
    try {
      if (isExtension) {
        // Extension mode: Use Chrome Bookmarks API
        await chrome.bookmarks.remove(itemId);
        await loadWishlist();
      } else {
        // Development mode: Use localStorage
        const updatedItems = items.filter(item => item.id !== itemId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
        setItems(updatedItems);
      }
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      setError('Failed to remove item from wishlist');
    }
  };

  return {
    items,
    loading,
    error,
    addToWishlist,
    removeFromWishlist
  };
};

export default useWishlist;