import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface ProductCardProps {
  name: string;
  price: number;
  vendor: string;
  distance: number;
  imageUrl: string;
}

const ProductCard = ({ name, price, vendor, distance, imageUrl }: ProductCardProps) => {
  return (
    <Card className="overflow-hidden animate-fade-in">
      <div className="aspect-square overflow-hidden">
        <img 
          src={imageUrl} 
          alt={name}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg truncate">{name}</h3>
        <p className="text-accent font-bold text-xl">${price.toFixed(2)}</p>
        <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
          <span>{vendor}</span>
          <div className="flex items-center gap-1">
            <MapPin size={14} />
            <span>{distance.toFixed(1)} mi</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;