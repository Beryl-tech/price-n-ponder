
import { Link } from "react-router-dom";
import { Product } from "../utils/types";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MapPin, School, CreditCard, Leaf, AlertTriangle } from "lucide-react";

interface ProductCardProps {
  product: Product;
  size?: "sm" | "md" | "lg";
}

export const ProductCard = ({ product, size = "md" }: ProductCardProps) => {
  const { id, title, price, images, location, condition, createdAt } = product;
  
  // Format timeAgo
  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  
  // Platform fee is included in the displayed price (hidden from buyers)
  const totalPrice = price;
  
  // Format price as currency (in shekels)
  const formattedPrice = new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(totalPrice);

  // Calculate savings compared to buying new (approximation)
  const estimatedSavings = Math.ceil(price * 0.4); // Assume 40% cheaper than buying new
  const formattedSavings = new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(estimatedSavings);

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
          <div className="absolute bottom-3 left-3 campus-badge">
            <School className="w-3 h-3 mr-1" />
            Campus Only
          </div>
          {/* Sustainable badge */}
          <div className="absolute top-3 left-3 bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs font-medium flex items-center">
            <Leaf className="w-3 h-3 mr-1" />
            Sustainable
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
            <span className="text-xs text-muted-foreground flex items-center">
              <MapPin className="w-3 h-3 mr-1" /> {location}
            </span>
            <span className="text-xs text-muted-foreground">{timeAgo}</span>
          </div>
          
          {/* Savings indicator */}
          <div className="mt-2 bg-green-50 text-green-700 text-xs p-2 rounded-md flex items-center">
            <Leaf className="w-3 h-3 mr-1" />
            Estimated Savings: {formattedSavings}
          </div>
          
          {size === "lg" && (
            <Button 
              className="w-full mt-4" 
              variant="outline"
            >
              View Details
            </Button>
          )}
          
          {/* Demo notice instead of payment button */}
          <div className="w-full mt-3 bg-yellow-50 border border-yellow-200 rounded-md p-2 text-yellow-700 text-xs flex items-center">
            <AlertTriangle className="w-3 h-3 mr-1 flex-shrink-0" />
            Demo listing - not available for purchase
          </div>
        </div>
      </Link>
    </div>
  );
};
