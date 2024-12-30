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
    <Card className="overflow-hidden animate-fade-in hover:shadow-lg transition-shadow">
      <div className="flex gap-4 p-4">
        <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-md">
          <img 
            src={imageUrl} 
            alt={name}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base truncate">{name}</h3>
          <p className="text-primary font-bold text-lg">${price.toFixed(2)}</p>
          <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
            <span className="truncate">{vendor}</span>
            <div className="flex items-center gap-1 flex-shrink-0">
              <MapPin size={14} />
              <span>{distance.toFixed(1)} mi</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;