
import { Product } from "../utils/types";
import { ProductCard } from "./ProductCard";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4;
  size?: "sm" | "md" | "lg";
  showFilters?: boolean;
  isLoading?: boolean;
}

export const ProductGrid = ({ 
  products, 
  columns = 3, 
  size = "md",
  showFilters = false,
  isLoading = false
}: ProductGridProps) => {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  const categories = Array.from(new Set(products.map(p => p.category)));
  
  const handleFilter = (category: string | null) => {
    setActiveFilter(category);
    if (category === null) {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.category === category));
    }
  };
  
  return (
    <div className="w-full">
      {showFilters && (
        <div className="mb-8 overflow-x-auto scrollbar-none">
          <div className="flex gap-2 pb-3">
            <button
              onClick={() => handleFilter(null)}
              className={cn(
                "px-4 py-2 rounded-full text-sm transition-colors whitespace-nowrap",
                activeFilter === null
                  ? "bg-primary text-white"
                  : "bg-secondary text-foreground hover:bg-secondary/80"
              )}
            >
              All
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => handleFilter(category)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm transition-colors whitespace-nowrap",
                  activeFilter === category
                    ? "bg-primary text-white"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div 
        className={cn(
          "grid gap-6",
          columns === 2 ? "grid-cols-1 sm:grid-cols-2" : 
          columns === 3 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" :
          "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        )}
      >
        {isLoading ? (
          // Display skeleton placeholders when loading
          Array(6).fill(0).map((_, index) => (
            <div key={index} className="rounded-lg bg-gray-100 animate-pulse h-64"></div>
          ))
        ) : (
          filteredProducts.map(product => (
            <ProductCard 
              key={product.id}
              product={product}
              size={size}
            />
          ))
        )}
      </div>
      
      {!isLoading && filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No products found matching your filter.</p>
        </div>
      )}
    </div>
  );
};
