import { useState } from "react";
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const mockProducts = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 99.99,
    vendor: "TechStore",
    distance: 1.2,
    imageUrl: "/placeholder.svg",
  },
  {
    id: 2,
    name: "Bluetooth Speaker",
    price: 79.99,
    vendor: "AudioWorld",
    distance: 2.5,
    imageUrl: "/placeholder.svg",
  },
  {
    id: 3,
    name: "Smart Watch",
    price: 199.99,
    vendor: "GadgetZone",
    distance: 0.8,
    imageUrl: "/placeholder.svg",
  },
];

const ProductGrid = () => {
  const [sortOrder, setSortOrder] = useState("price-low");
  const [isEnabled, setIsEnabled] = useState(true);

  const sortedProducts = [...mockProducts].sort((a, b) => {
    if (sortOrder === "price-low") {
      return a.price - b.price;
    }
    return b.price - a.price;
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant={isEnabled ? "default" : "secondary"}
          onClick={() => setIsEnabled(!isEnabled)}
          className="w-32"
        >
          {isEnabled ? "Enabled" : "Disabled"}
        </Button>
        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by price" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {isEnabled ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          Enable the extension to see similar products
        </div>
      )}
    </div>
  );
};

export default ProductGrid;