import { useState } from "react";
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/hooks/useWishlist";
import { Loader2, Search, SlidersHorizontal } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ProductGrid = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date");
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

  const filteredAndSortedItems = items
    .filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.vendor?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return (parseFloat(a.price || "0") - parseFloat(b.price || "0"));
        case "price-desc":
          return (parseFloat(b.price || "0") - parseFloat(a.price || "0"));
        case "name":
          return a.title.localeCompare(b.title);
        case "date":
        default:
          return b.dateAdded - a.dateAdded;
      }
    });

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
    <div className="p-4 max-w-7xl mx-auto">
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Latest Added</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAndSortedItems.map((item) => (
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