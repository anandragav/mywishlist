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

  const STORAGE_KEY = "shopping-wishlist";

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const storedItems = localStorage.getItem(STORAGE_KEY);
      const wishlistItems = storedItems ? JSON.parse(storedItems) : [];
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
      const newItem: WishlistItem = {
        ...item,
        id: crypto.randomUUID(),
        dateAdded: Date.now()
      };
      
      const updatedItems = [...items, newItem];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
      setItems(updatedItems);
    } catch (err) {
      console.error('Error adding to wishlist:', err);
      setError('Failed to add item to wishlist');
    }
  };

  const removeFromWishlist = async (itemId: string) => {
    try {
      const updatedItems = items.filter(item => item.id !== itemId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
      setItems(updatedItems);
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