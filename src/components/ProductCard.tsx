import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, ExternalLink } from "lucide-react";

interface ProductCardProps {
  name: string;
  price: number;
  vendor: string;
  imageUrl: string;
  url: string;
  onRemove: () => void;
}

const ProductCard = ({ name, price, vendor, imageUrl, url, onRemove }: ProductCardProps) => {
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
          <p className="text-primary font-bold text-lg">
            {typeof price === 'number' ? `$${price.toFixed(2)}` : 'Price unavailable'}
          </p>
          <p className="text-sm text-gray-600 truncate">{vendor}</p>
          <div className="flex gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(url, '_blank')}
              className="flex items-center gap-1"
            >
              <ExternalLink size={14} />
              Visit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={onRemove}
              className="flex items-center gap-1"
            >
              <Trash2 size={14} />
              Remove
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;