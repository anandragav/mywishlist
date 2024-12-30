import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, ExternalLink } from "lucide-react";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { motion } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <BackgroundGradient className="w-full">
        <Card className="overflow-hidden bg-white/80 backdrop-blur-sm">
          <div className="p-4">
            <div className="aspect-square w-full overflow-hidden rounded-lg mb-4">
              <img 
                src={imageUrl} 
                alt={name}
                className="w-full h-full object-cover transition-transform hover:scale-105"
              />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg truncate">{name}</h3>
              <p className="text-primary font-bold text-xl">
                {typeof price === 'number' ? `$${price.toFixed(2)}` : 'Price unavailable'}
              </p>
              <p className="text-sm text-gray-600 truncate">{vendor}</p>
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(url, '_blank')}
                  className="flex-1 flex items-center justify-center gap-1"
                >
                  <ExternalLink size={14} />
                  Visit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={onRemove}
                  className="flex-1 flex items-center justify-center gap-1"
                >
                  <Trash2 size={14} />
                  Remove
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </BackgroundGradient>
    </motion.div>
  );
};

export default ProductCard;