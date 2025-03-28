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

// Payment processing status
type PaymentStatus = 'idle' | 'processing' | 'success' | 'error';

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');
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
      
      // Trigger update for cart indicator
      window.dispatchEvent(new Event('cartUpdated'));
    }
  }, [cartItems, isLoading]);

  // Calculate cart total (platform fee is now hidden and included in the price)
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

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

  // Validate card fields
  const validateCardFields = () => {
    if (!cardNumber.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter card number",
      });
      return false;
    }
    
    if (!cardExpiry.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter expiry date",
      });
      return false;
    }
    
    if (!cardCvc.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter CVC code",
      });
      return false;
    }
    
    if (!cardName.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter cardholder name",
      });
      return false;
    }
    
    return true;
  };

  // Process checkout
  const handleCheckout = async () => {
    if (!validateCardFields()) return;
    
    try {
      setPaymentStatus('processing');
      
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Process "real" payment here (simulated)
      if (cardNumber.endsWith('1234')) {
        throw new Error("Payment declined");
      }
      
      setPaymentStatus('success');
      
      // Clear cart after successful checkout
      clearCart();
      
      // Show success message
      toast({
        title: "Payment Successful!",
        description: "Your order has been placed successfully.",
      });
      
      // Redirect to confirmation page after delay
      setTimeout(() => {
        setIsCheckoutDialogOpen(false);
        navigate("/");
      }, 1500);
      
    } catch (error) {
      setPaymentStatus('error');
      
      toast({
        variant: "destructive",
        title: "Payment failed",
        description: error instanceof Error ? error.message : "Please try again with a different card.",
      });
    }
  };

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Format card expiry date
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return v;
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
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full mb-4" 
                  onClick={() => setIsCheckoutDialogOpen(true)}
                  disabled={cartItems.length === 0}
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
              Enter your payment details to complete your purchase.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="border-b pb-4">
              <div className="flex justify-between py-1 font-medium">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
            
            <div className="space-y-4 border-b pb-4">
              <div>
                <label className="block text-sm font-medium mb-2">Cardholder Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full border border-gray-200 rounded-md px-3 py-2"
                  disabled={paymentStatus === 'processing'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  maxLength={19}
                  className="w-full border border-gray-200 rounded-md px-3 py-2"
                  disabled={paymentStatus === 'processing'}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Use any card number except ones ending with 1234 (which will trigger an error)
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(formatExpiryDate(e.target.value))}
                    maxLength={5}
                    className="w-full border border-gray-200 rounded-md px-3 py-2"
                    disabled={paymentStatus === 'processing'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">CVC</label>
                  <input
                    type="text"
                    placeholder="123"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').substring(0, 3))}
                    maxLength={3}
                    className="w-full border border-gray-200 rounded-md px-3 py-2"
                    disabled={paymentStatus === 'processing'}
                  />
                </div>
              </div>
            </div>
            
            {paymentStatus === 'success' && (
              <Alert className="bg-green-50 border-green-200 text-green-800">
                <ShieldCheck className="h-4 w-4" />
                <AlertTitle>Payment Successful</AlertTitle>
                <AlertDescription>
                  Your order has been placed successfully!
                </AlertDescription>
              </Alert>
            )}
            
            {paymentStatus === 'error' && (
              <Alert className="bg-red-50 border-red-200 text-red-800">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Payment Failed</AlertTitle>
                <AlertDescription>
                  Your payment could not be processed. Please try again.
                </AlertDescription>
              </Alert>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsCheckoutDialogOpen(false);
                setPaymentStatus('idle');
              }}
              disabled={paymentStatus === 'processing' || paymentStatus === 'success'}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCheckout}
              disabled={paymentStatus === 'processing' || paymentStatus === 'success' || cartItems.length === 0}
            >
              {paymentStatus === 'processing' ? "Processing..." : 
               paymentStatus === 'success' ? "Payment Complete" : "Pay Now"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Cart;
