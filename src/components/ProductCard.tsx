
import { Link } from "react-router-dom";
import { Product } from "../utils/types";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MapPin, School, CreditCard, Leaf } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

interface ProductCardProps {
  product: Product;
  size?: "sm" | "md" | "lg";
}

export const ProductCard = ({ product, size = "md" }: ProductCardProps) => {
  const { id, title, price, images, location, condition, createdAt } = product;
  const { t, language } = useLanguage();
  
  // Format timeAgo
  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  
  // Format price as currency
  const formattedPrice = new Intl.NumberFormat(language === 'he' ? 'he-IL' : 'en-US', {
    style: 'currency',
    currency: 'ILS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

  // Calculate platform fee
  const platformFee = Math.ceil(price * 0.05);
  const formattedPlatformFee = new Intl.NumberFormat(language === 'he' ? 'he-IL' : 'en-US', {
    style: 'currency',
    currency: 'ILS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(platformFee);

  // Calculate savings compared to buying new (approximation)
  const estimatedSavings = Math.ceil(price * 0.4); // Assume 40% cheaper than buying new
  const formattedSavings = new Intl.NumberFormat(language === 'he' ? 'he-IL' : 'en-US', {
    style: 'currency',
    currency: 'ILS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(estimatedSavings);

  const handlePayment = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // In a real implementation, this would redirect to a payment gateway
    alert(t("paymentProcessingMessage"));
  };

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
            {t("campusOnly")}
          </div>
          {/* Sustainable badge */}
          <div className="absolute top-3 left-3 bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs font-medium flex items-center">
            <Leaf className="w-3 h-3 mr-1" />
            {t("sustainable")}
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
            {t("estimatedSavings")}: {formattedSavings}
          </div>
          
          <div className="mt-2 fee-notice text-xs text-muted-foreground">
            <p>{t("platformFee")}: {formattedPlatformFee}</p>
          </div>
          
          {size === "lg" && (
            <Button 
              className="w-full mt-4" 
              variant="outline"
            >
              {t("viewDetails")}
            </Button>
          )}
          
          <Button
            onClick={handlePayment}
            className="w-full mt-3"
            variant="default"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            {t("payOnPlatform")}
          </Button>
        </div>
      </Link>
    </div>
  );
};
