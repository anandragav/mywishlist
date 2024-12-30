import { useState } from "react";
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/hooks/useWishlist";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const ProductGrid = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const { items, loading, error, removeFromWishlist } = useWishlist();
  const { toast } = useToast();

  const handleRemove = async (itemId: string) => {
    try {
      await removeFromWishlist(itemId);
      toast({
        title: "Item removed",
        description: "Product has been removed from your wishlist",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist",
        variant: "destructive",
      });
    }
  };

  if (!isEnabled) {
    return (
      <div className="text-center py-12 text-gray-500">
        Enable the extension to see your wishlist
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        Error loading wishlist: {error}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        Your wishlist is empty. Browse products and click the bookmark button to add them here!
      </div>
    );
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="grid grid-cols-1 gap-4">
        {items.map((item) => (
          <ProductCard
            key={item.id}
            name={item.title}
            price={parseFloat(item.price || "0")}
            vendor={item.vendor || "Unknown Store"}
            imageUrl={item.imageUrl || "/placeholder.svg"}
            onRemove={() => handleRemove(item.id)}
            url={item.url}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;