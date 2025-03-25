
import { Link } from "react-router-dom";
import { Product } from "../utils/types";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  size?: "sm" | "md" | "lg";
}

export const ProductCard = ({ product, size = "md" }: ProductCardProps) => {
  const { id, title, price, images, location, condition, createdAt } = product;
  
  // Format timeAgo
  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  
  // Format price as currency
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

  return (
    <div 
      className={cn(
        "group rounded-xl overflow-hidden hover-scale",
        "bg-white shadow-sm border border-gray-100",
        size === "sm" && "max-w-xs"
      )}
    >
      <Link to={`/products/${id}`} className="block w-full h-full">
        <div 
          className={cn(
            "relative overflow-hidden",
            size === "sm" ? "h-40" : size === "md" ? "h-60" : "h-80"
          )}
        >
          <img 
            src={images[0]} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          />
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-md text-xs font-medium">
            {condition}
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-start mb-1">
            <h3 
              className={cn(
                "font-medium text-foreground line-clamp-1",
                size === "sm" ? "text-sm" : "text-base"
              )}
            >
              {title}
            </h3>
            <span 
              className={cn(
                "font-semibold text-foreground",
                size === "sm" ? "text-base" : "text-lg"
              )}
            >
              {formattedPrice}
            </span>
          </div>
          
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-muted-foreground">{location}</span>
            <span className="text-xs text-muted-foreground">{timeAgo}</span>
          </div>
          
          {size === "lg" && (
            <Button 
              className="w-full mt-4" 
              variant="outline"
            >
              View Details
            </Button>
          )}
        </div>
      </Link>
    </div>
  );
};
