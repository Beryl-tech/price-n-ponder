
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, Search, MessageSquare, User, ShoppingBag, PlusCircle, ShoppingCart } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { cn } from "@/lib/utils";
import { useLanguage } from "../context/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import CartIndicator from "./CartIndicator";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Close menu when route changes
  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
        scrolled 
          ? "py-3 bg-white/90 backdrop-blur-md shadow-sm" 
          : "py-5 bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link to="/" className="text-2xl font-semibold tracking-tight text-primary flex items-center">
          <img 
            src="https://upload.wikimedia.org/wikipedia/he/7/7f/Bar-Ilan_University.png" 
            alt="Bar Ilan University" 
            className="h-8 w-auto mr-2"
          />
          <span>{t("barIlanMarketplace")}</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/products" 
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("browse")}
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link 
                to="/create-listing" 
                className="text-muted-foreground hover:text-foreground transition-colors flex items-center"
              >
                <PlusCircle className="w-4 h-4 mr-1" />
                {t("sell")}
              </Link>
              <Link 
                to="/messages" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <MessageSquare className="w-5 h-5" />
              </Link>
              <CartIndicator />
              <div className="relative group">
                <button className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right">
                  <Link 
                    to="/profile" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {t("profile")}
                  </Link>
                  <button 
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {t("signOut")}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <CartIndicator />
              <Link 
                to="/login" 
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-primary h-10 px-4 py-2 border border-primary hover:bg-primary/5"
              >
                {t("signIn")}
              </Link>
            </>
          )}
          
          <LanguageSwitcher />
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-2">
          <CartIndicator />
          <LanguageSwitcher />
          <button 
            className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:text-foreground"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={cn(
          "fixed inset-0 bg-white z-30 pt-20 transform transition-transform duration-300 ease-in-out md:hidden",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <nav className="container px-4 flex flex-col space-y-4">
          <Link 
            to="/products" 
            className="text-lg py-3 border-b border-gray-100 flex items-center"
          >
            <ShoppingBag className="w-5 h-5 mr-3" />
            {t("browse")}
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link 
                to="/create-listing" 
                className="text-lg py-3 border-b border-gray-100 flex items-center"
              >
                <PlusCircle className="w-5 h-5 mr-3" />
                {t("sell")}
              </Link>
              <Link 
                to="/messages" 
                className="text-lg py-3 border-b border-gray-100 flex items-center"
              >
                <MessageSquare className="w-5 h-5 mr-3" />
                {t("messages")}
              </Link>
              <Link 
                to="/cart" 
                className="text-lg py-3 border-b border-gray-100 flex items-center"
              >
                <ShoppingCart className="w-5 h-5 mr-3" />
                Cart
              </Link>
              <Link 
                to="/profile" 
                className="text-lg py-3 border-b border-gray-100 flex items-center"
              >
                <User className="w-5 h-5 mr-3" />
                {t("profile")}
              </Link>
              <button 
                onClick={logout}
                className="text-lg py-3 text-left flex items-center text-red-500"
              >
                {t("signOut")}
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/cart" 
                className="text-lg py-3 border-b border-gray-100 flex items-center"
              >
                <ShoppingCart className="w-5 h-5 mr-3" />
                Cart
              </Link>
              <Link 
                to="/login" 
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
              >
                {t("signIn")}
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
