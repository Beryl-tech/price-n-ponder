
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ArrowLeft, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, ShieldCheck } from "lucide-react";

// Cart item type definition
interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  seller: {
    id: string;
    name: string;
  };
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Load cart items from localStorage
  useEffect(() => {
    const loadCart = () => {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
      setIsLoading(false);
    };
    
    loadCart();
  }, []);

  // Update localStorage when cart changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isLoading]);

  // Calculate cart totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const platformFee = Math.ceil(subtotal * 0.05); // 5% platform fee
  const total = subtotal + platformFee;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Handle quantity change
  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
    
    toast({
      description: "Cart updated",
    });
  };

  // Remove item from cart
  const removeItem = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    
    toast({
      description: "Item removed from cart",
    });
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
    
    toast({
      description: "Cart cleared",
    });
  };

  // Process checkout
  const handleCheckout = async () => {
    try {
      setIsProcessingPayment(true);
      
      // Simulate payment processing delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      setIsCheckoutDialogOpen(false);
      setIsProcessingPayment(false);
      
      // Clear cart after successful checkout
      clearCart();
      
      // Show success message
      toast({
        title: "Order Placed!",
        description: "This is a demo order. In a real app, you would receive confirmation details.",
      });
      
      // Navigate to a thank you page or home
      navigate("/");
    } catch (error) {
      setIsProcessingPayment(false);
      
      toast({
        variant: "destructive",
        title: "Checkout failed",
        description: "This is a demo. No actual payment was processed.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container px-4 md:px-6 py-24">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="flex items-center text-muted-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-pulse">Loading your cart...</div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ShoppingCart className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Looks like you haven't added any items to your cart yet.</p>
            <Button onClick={() => navigate("/products")}>
              Browse Products
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 border-b">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Items ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})</h2>
                    <Button variant="ghost" size="sm" onClick={clearCart} className="text-muted-foreground">
                      Clear All
                    </Button>
                  </div>
                </div>
                
                <div className="divide-y">
                  {cartItems.map((item) => (
                    <div key={item.id} className="p-6 flex flex-col md:flex-row md:items-center">
                      <div className="flex-shrink-0 md:mr-6 mb-4 md:mb-0">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-24 h-24 object-cover rounded-md" 
                        />
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex flex-col md:flex-row md:justify-between">
                          <div>
                            <Link to={`/products/${item.id}`} className="font-medium hover:text-primary transition-colors">
                              {item.title}
                            </Link>
                            <p className="text-sm text-muted-foreground">Seller: {item.seller.name}</p>
                          </div>
                          
                          <div className="mt-2 md:mt-0 text-right">
                            <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatCurrency(item.price)} each
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center mt-4">
                          <div className="flex items-center border border-gray-200 rounded-md">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="flex-none w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <div className="w-12 h-8 flex items-center justify-center">
                              {item.quantity}
                            </div>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="flex-none w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4 text-muted-foreground" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                
                <Alert className="mb-4 bg-yellow-50 border-yellow-200 text-yellow-800">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Demo Checkout</AlertTitle>
                  <AlertDescription>
                    This is a demo checkout and no actual payment will be processed.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Platform fee (5%)</span>
                    <span>{formatCurrency(platformFee)}</span>
                  </div>
                  <div className="h-px bg-gray-200 my-2"></div>
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full mb-4" 
                  onClick={() => setIsCheckoutDialogOpen(true)}
                >
                  Proceed to Checkout
                </Button>
                
                <div className="flex items-center justify-center text-sm text-muted-foreground">
                  <ShieldCheck className="w-4 h-4 mr-2 text-green-600" />
                  <span>Secure checkout</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Checkout Dialog */}
      <Dialog open={isCheckoutDialogOpen} onOpenChange={setIsCheckoutDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Your Purchase</DialogTitle>
            <DialogDescription>
              This is a demo payment form. No actual payment will be processed.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="border-b pb-4">
              <div className="flex justify-between py-1">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Platform fee</span>
                <span>{formatCurrency(platformFee)}</span>
              </div>
              <div className="flex justify-between py-1 font-medium">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
            
            <div className="space-y-4 border-b pb-4">
              <div>
                <label className="block text-sm font-medium mb-2">Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full border border-gray-200 rounded-md px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full border border-gray-200 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">CVC</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full border border-gray-200 rounded-md px-3 py-2"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsCheckoutDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCheckout}
              disabled={isProcessingPayment}
            >
              {isProcessingPayment ? "Processing..." : "Pay Now"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Cart;
