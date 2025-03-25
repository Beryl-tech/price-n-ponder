
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { ProductGrid } from "../components/ProductGrid";
import { useProducts } from "../context/ProductContext";
import { Filter, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface FilterState {
  category: string | null;
  priceRange: [number, number];
  condition: string | null;
  search: string;
}

const Products = () => {
  const { products } = useProducts();
  const location = useLocation();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get("category");
  const initialSearch = queryParams.get("search") || "";
  
  const [filters, setFilters] = useState<FilterState>({
    category: initialCategory,
    priceRange: [0, 5000],
    condition: null,
    search: initialSearch,
  });
  
  const [filteredProducts, setFilteredProducts] = useState(products);
  
  // Categories
  const categories = Array.from(new Set(products.map(p => p.category)));
  
  // Conditions
  const conditions = ["new", "like-new", "good", "fair", "poor"];
  
  // Apply filters
  useEffect(() => {
    let result = [...products];
    
    // Filter by search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(searchLower) || 
        p.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Filter by category
    if (filters.category) {
      result = result.filter(p => p.category === filters.category);
    }
    
    // Filter by condition
    if (filters.condition) {
      result = result.filter(p => p.condition === filters.condition);
    }
    
    // Filter by price range
    result = result.filter(p => 
      p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );
    
    setFilteredProducts(result);
  }, [filters, products]);
  
  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  const resetFilters = () => {
    setFilters({
      category: null,
      priceRange: [0, 5000],
      condition: null,
      search: "",
    });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container px-4 md:px-6 py-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Browse Products</h1>
          <p className="text-muted-foreground">
            Discover our marketplace of quality items from trusted sellers
          </p>
        </div>
        
        {/* Mobile Filter Toggle */}
        <div className="md:hidden mb-6">
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside 
            className={`md:w-64 flex-shrink-0 bg-white p-6 rounded-lg border border-gray-100 md:sticky md:top-24 md:self-start
              ${isFilterOpen ? 'block' : 'hidden md:block'}`}
          >
            {/* Mobile Close Button */}
            <div className="flex justify-between items-center mb-6 md:hidden">
              <h2 className="font-semibold">Filters</h2>
              <button onClick={() => setIsFilterOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Search */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Search</h3>
              <input
                type="text"
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            
            {/* Categories */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Categories</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.category === null}
                    onChange={() => handleFilterChange("category", null)}
                    className="mr-2"
                  />
                  All Categories
                </label>
                {categories.map(category => (
                  <label key={category} className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      checked={filters.category === category}
                      onChange={() => handleFilterChange("category", category)}
                      className="mr-2"
                    />
                    {category}
                  </label>
                ))}
              </div>
            </div>
            
            {/* Price Range */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Price Range</h3>
              <div className="px-2">
                <Slider
                  defaultValue={[0, 5000]}
                  min={0}
                  max={5000}
                  step={100}
                  value={filters.priceRange}
                  onValueChange={(value) => handleFilterChange("priceRange", value)}
                />
              </div>
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>${filters.priceRange[0]}</span>
                <span>${filters.priceRange[1]}</span>
              </div>
            </div>
            
            {/* Condition */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Condition</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="condition"
                    checked={filters.condition === null}
                    onChange={() => handleFilterChange("condition", null)}
                    className="mr-2"
                  />
                  Any Condition
                </label>
                {conditions.map(condition => (
                  <label key={condition} className="flex items-center">
                    <input
                      type="radio"
                      name="condition"
                      checked={filters.condition === condition}
                      onChange={() => handleFilterChange("condition", condition)}
                      className="mr-2"
                    />
                    {condition.charAt(0).toUpperCase() + condition.slice(1)}
                  </label>
                ))}
              </div>
            </div>
            
            {/* Reset Button */}
            <Button 
              variant="outline" 
              className="w-full"
              onClick={resetFilters}
            >
              Reset Filters
            </Button>
          </aside>
          
          {/* Product Grid */}
          <div className="flex-1">
            {filteredProducts.length > 0 ? (
              <ProductGrid products={filteredProducts} columns={3} size="md" />
            ) : (
              <div className="text-center py-20 bg-gray-50 rounded-lg">
                <SlidersHorizontal className="mx-auto w-10 h-10 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters to find what you're looking for
                </p>
                <Button 
                  variant="outline" 
                  onClick={resetFilters}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Products;
