
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { useProducts } from "../context/ProductContext";
import { Product } from "../utils/types";
import { ProductGrid } from "../components/ProductGrid";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Search as SearchIcon, SlidersHorizontal, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products } = useProducts();
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get("categories")?.split(",").filter(Boolean) || []
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams.get("minPrice") || 0),
    Number(searchParams.get("maxPrice") || 10000)
  ]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Get all available categories from products
  const availableCategories = [...new Set(products.map(product => product.category))];
  
  // Product min and max prices
  const minProductPrice = Math.min(...products.map(product => product.price), 0);
  const maxProductPrice = Math.max(...products.map(product => product.price), 10000);
  
  // Update price range if products have changed
  useEffect(() => {
    if (products.length > 0 && !searchParams.has("minPrice") && !searchParams.has("maxPrice")) {
      setPriceRange([minProductPrice, maxProductPrice]);
    }
  }, [products, minProductPrice, maxProductPrice, searchParams]);
  
  // Filter products based on search and filters
  useEffect(() => {
    setIsLoading(true);
    
    // Delayed search to improve performance
    const delaySearch = setTimeout(() => {
      let results = [...products];
      
      // Filter by search term
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        results = results.filter(
          product => 
            product.title.toLowerCase().includes(term) || 
            product.description.toLowerCase().includes(term)
        );
      }
      
      // Filter by categories
      if (selectedCategories.length > 0) {
        results = results.filter(product => selectedCategories.includes(product.category));
      }
      
      // Filter by price range
      results = results.filter(
        product => product.price >= priceRange[0] && product.price <= priceRange[1]
      );
      
      setFilteredProducts(results);
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(delaySearch);
  }, [products, searchTerm, selectedCategories, priceRange]);
  
  // Update search params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (searchTerm) params.set("q", searchTerm);
    if (selectedCategories.length > 0) params.set("categories", selectedCategories.join(","));
    if (priceRange[0] > minProductPrice) params.set("minPrice", priceRange[0].toString());
    if (priceRange[1] < maxProductPrice) params.set("maxPrice", priceRange[1].toString());
    
    setSearchParams(params, { replace: true });
  }, [searchTerm, selectedCategories, priceRange, setSearchParams, minProductPrice, maxProductPrice]);
  
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Search is already handled by the effect
  };
  
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };
  
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setPriceRange([minProductPrice, maxProductPrice]);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container px-4 md:px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Filters - Desktop */}
            <div className="w-full md:w-64 hidden md:block sticky top-24">
              <div className="bg-white rounded-lg border p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold">Filters</h2>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters}
                    className="h-8 px-2 text-muted-foreground"
                  >
                    Clear all
                  </Button>
                </div>
                
                <div className="space-y-6">
                  {/* Categories */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">Categories</h3>
                    <div className="space-y-2">
                      {availableCategories.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`category-${category}`}
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={() => toggleCategory(category)}
                          />
                          <Label 
                            htmlFor={`category-${category}`}
                            className="text-sm cursor-pointer"
                          >
                            {category}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Price Range */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">Price Range</h3>
                    <Slider
                      min={minProductPrice}
                      max={maxProductPrice}
                      step={100}
                      value={[priceRange[0], priceRange[1]]}
                      onValueChange={handlePriceChange}
                      className="mb-6"
                    />
                    <div className="flex items-center justify-between">
                      <div className="border rounded-md px-2 py-1 w-20 text-sm text-center">
                        ₪{priceRange[0]}
                      </div>
                      <div className="text-sm text-muted-foreground">to</div>
                      <div className="border rounded-md px-2 py-1 w-20 text-sm text-center">
                        ₪{priceRange[1]}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mobile Filters Sheet */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden mb-4">
                <Button variant="outline" className="w-full flex justify-between">
                  <div className="flex items-center">
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    Filters
                  </div>
                  <span className="bg-primary/10 text-primary text-xs py-1 px-2 rounded-full">
                    {selectedCategories.length > 0 || priceRange[0] > minProductPrice || priceRange[1] < maxProductPrice
                      ? `${selectedCategories.length + (priceRange[0] > minProductPrice || priceRange[1] < maxProductPrice ? 1 : 0)} active`
                      : "None"}
                  </span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>
                    Narrow down your search results
                  </SheetDescription>
                </SheetHeader>
                <div className="space-y-6 py-4">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters}
                    className="h-8 px-2 text-muted-foreground"
                  >
                    Clear all filters
                  </Button>
                  
                  {/* Categories */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">Categories</h3>
                    <div className="space-y-2">
                      {availableCategories.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`mobile-category-${category}`}
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={() => toggleCategory(category)}
                          />
                          <Label 
                            htmlFor={`mobile-category-${category}`}
                            className="text-sm cursor-pointer"
                          >
                            {category}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Price Range */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">Price Range</h3>
                    <Slider
                      min={minProductPrice}
                      max={maxProductPrice}
                      step={100}
                      value={[priceRange[0], priceRange[1]]}
                      onValueChange={handlePriceChange}
                      className="mb-6"
                    />
                    <div className="flex items-center justify-between">
                      <div className="border rounded-md px-2 py-1 w-20 text-sm text-center">
                        ₪{priceRange[0]}
                      </div>
                      <div className="text-sm text-muted-foreground">to</div>
                      <div className="border rounded-md px-2 py-1 w-20 text-sm text-center">
                        ₪{priceRange[1]}
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
            <div className="flex-1">
              {/* Search Form */}
              <form onSubmit={handleSearch} className="relative mb-8">
                <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search for items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-10"
                />
                {searchTerm && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1 h-8 w-8"
                    onClick={() => setSearchTerm("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </form>
              
              {/* Results Count */}
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  {isLoading ? "Searching..." : 
                    filteredProducts.length === 0 
                      ? "No results found" 
                      : `${filteredProducts.length} ${filteredProducts.length === 1 ? "result" : "results"}`
                  }
                </h2>
              </div>
              
              {/* Results */}
              <ProductGrid products={filteredProducts} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Search;
