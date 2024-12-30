import { useState, useEffect } from 'react';

interface WishlistItem {
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

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      // Ensure the wishlist folder exists
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
            dateAdded: bookmark.dateAdded
          };
        } catch {
          return {
            id: bookmark.id,
            title: bookmark.title,
            url: bookmark.url || '',
            dateAdded: bookmark.dateAdded
          };
        }
      });

      setItems(wishlistItems);
      setLoading(false);
    } catch (err) {
      console.error('Error loading wishlist:', err);
      setError('Failed to load wishlist');
      setLoading(false);
    }
  };

  const addToWishlist = async (item: Omit<WishlistItem, 'id' | 'dateAdded'>) => {
    try {
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
    } catch (err) {
      console.error('Error adding to wishlist:', err);
      setError('Failed to add item to wishlist');
    }
  };

  const removeFromWishlist = async (itemId: string) => {
    try {
      await chrome.bookmarks.remove(itemId);
      await loadWishlist();
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