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
    name: "MALM Desk",
    price: 99.99,
    vendor: "TechStore",
    distance: 1.2,
    imageUrl: "/placeholder.svg",
  },
  {
    id: 2,
    name: "ALEX Drawer unit",
    price: 79.99,
    vendor: "FurnitureWorld",
    distance: 2.5,
    imageUrl: "/placeholder.svg",
  },
  {
    id: 3,
    name: "MARKUS Office chair",
    price: 199.99,
    vendor: "OfficeZone",
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
    <div className="p-4 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4 gap-2">
        <Button 
          variant={isEnabled ? "default" : "secondary"}
          onClick={() => setIsEnabled(!isEnabled)}
          className="w-24 text-sm"
        >
          {isEnabled ? "Enabled" : "Disabled"}
        </Button>
        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger className="w-[140px] text-sm">
            <SelectValue placeholder="Sort by price" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {isEnabled ? (
        <div className="grid grid-cols-1 gap-4">
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