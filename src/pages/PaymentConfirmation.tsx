
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useProducts } from "../context/ProductContext";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, MapPin, Mail } from "lucide-react";
import { Product } from "../utils/types";

const PaymentConfirmation = () => {
  const { productId } = useParams<{ productId: string }>();
  const { user } = useAuth();
  const { getProduct, confirmPurchase } = useProducts();
  const navigate = useNavigate();
  
  const product = productId ? getProduct(productId) as Product : null;
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);
  
  // Redirect if product not found
  useEffect(() => {
    if (!product && productId) {
      navigate("/products");
    }
  }, [product, productId, navigate]);
  
  // Mark product as purchased
  useEffect(() => {
    if (product && productId && user) {
      confirmPurchase(productId, user.id);
    }
  }, [product, productId, user, confirmPurchase]);
  
  if (!product || !user) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container px-4 md:px-6 py-24">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg border p-8 text-center">
            <div className="flex flex-col items-center mb-8">
              <CheckCircle className="h-20 w-20 text-green-500 mb-4" />
              <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
              <p className="text-muted-foreground">
                Thank you for your purchase. A confirmation has been sent to your email.
              </p>
            </div>
            
            <div className="border rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-24 h-24 rounded-md overflow-hidden bg-gray-100">
                  <img 
                    src={product.images[0]} 
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-medium">{product.title}</h3>
                  <p className="text-sm text-muted-foreground mb-1">
                    Condition: {product.condition.charAt(0).toUpperCase() + product.condition.slice(1)}
                  </p>
                  <p className="text-lg font-semibold">
                    {new Intl.NumberFormat('he-IL', { 
                      style: 'currency', 
                      currency: 'ILS' 
                    }).format(product.price)}
                  </p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span>{new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS' }).format(product.price)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS' }).format(product.price)}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-semibold mb-4">Next Steps</h2>
              
              <div className="space-y-4 text-left">
                <div className="flex gap-3">
                  <Mail className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Contact the Seller</h3>
                    <p className="text-sm text-muted-foreground">
                      We've shared your contact information with the seller. 
                      They will reach out to arrange the handover.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Meet Safely</h3>
                    <p className="text-sm text-muted-foreground">
                      When meeting to exchange the item, choose a public place on campus.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Item Reservation</h3>
                    <p className="text-sm text-muted-foreground">
                      The item is reserved for you for the next 48 hours.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => navigate("/products")} 
                className="flex-1"
              >
                Continue Shopping
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate("/user-dashboard")}
                className="flex-1"
              >
                View My Purchases
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaymentConfirmation;
