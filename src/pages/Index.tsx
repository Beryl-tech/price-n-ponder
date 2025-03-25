
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { ProductGrid } from "../components/ProductGrid";
import { useProducts } from "../context/ProductContext";
import { ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { name: "Electronics", icon: "💻" },
  { name: "Clothing", icon: "👕" },
  { name: "Furniture", icon: "🪑" },
  { name: "Sports", icon: "🏀" },
  { name: "Music", icon: "🎸" },
  { name: "Art", icon: "🎨" },
];

const Index = () => {
  const { products } = useProducts();
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  
  const featuredProducts = products.slice(0, 6);
  
  // Handle scroll effect for hero section
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden">
        <div 
          className={cn(
            "absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1472851294608-062f824d29cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80')] bg-cover bg-center",
            "after:absolute after:inset-0 after:bg-black/40",
            "transition-all duration-1000 ease-in-out transform",
            isScrolled ? "scale-105" : "scale-100"
          )}
        ></div>
        
        <div className="container relative z-10 px-4 md:px-6 animate-fade-in">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Buy and sell with confidence in your community
            </h1>
            <p className="text-xl text-white/90 mb-8">
              The simple way to find great deals and sell items you no longer need.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-xl bg-white/10 backdrop-blur-lg p-1 rounded-full flex items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
                <input
                  type="text"
                  placeholder="What are you looking for?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-3 pl-12 pr-4 bg-transparent text-white placeholder:text-white/70 focus:outline-none"
                />
              </div>
              <Link to={`/products?search=${searchQuery}`}>
                <Button size="lg" className="rounded-full px-6">
                  Search
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Browse Categories</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore thousands of items in our most popular categories
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((category, index) => (
              <Link
                key={category.name}
                to={`/products?category=${category.name}`}
                className={cn(
                  "flex flex-col items-center justify-center p-6 rounded-xl border border-gray-100 hover-scale",
                  "transition-colors hover:bg-gray-50",
                  "animate-fade-in",
                  { "animation-delay-100": index % 6 === 1 },
                  { "animation-delay-200": index % 6 === 2 },
                  { "animation-delay-300": index % 6 === 3 },
                  { "animation-delay-400": index % 6 === 4 },
                  { "animation-delay-500": index % 6 === 5 }
                )}
              >
                <span className="text-4xl mb-3">{category.icon}</span>
                <span className="font-medium">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-1">Featured Items</h2>
              <p className="text-muted-foreground">
                Discover our latest and popular listings
              </p>
            </div>
            <Link to="/products">
              <Button variant="outline" className="group">
                View All
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
          
          <ProductGrid products={featuredProducts} />
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Simple steps to buy and sell with ease
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 animate-fade-in">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Create a Listing</h3>
              <p className="text-muted-foreground">
                Take photos, set a price, add a description, and publish your item in minutes.
              </p>
            </div>
            
            <div className="text-center p-6 animate-fade-in animation-delay-200">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Connect with Buyers</h3>
              <p className="text-muted-foreground">
                Respond to messages, answer questions, and negotiate prices securely.
              </p>
            </div>
            
            <div className="text-center p-6 animate-fade-in animation-delay-400">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Complete the Sale</h3>
              <p className="text-muted-foreground">
                Meet safely or arrange shipping and payment methods that work for both parties.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link to="/create-listing">
              <Button size="lg" className="px-8">
                Start Selling
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h2 className="text-xl font-bold mb-4">MarketPlace</h2>
              <p className="text-gray-400">
                The trusted platform for buying and selling locally.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/products" className="text-gray-400 hover:text-white transition-colors">
                    Browse
                  </Link>
                </li>
                <li>
                  <Link to="/create-listing" className="text-gray-400 hover:text-white transition-colors">
                    Sell
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Safety Tips
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Cookies
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} MarketPlace. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
