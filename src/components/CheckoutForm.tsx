import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ShieldCheck, CreditCard } from "lucide-react";
import { Product } from "../utils/types";

interface CheckoutFormProps {
  product: Product;
  onCheckoutComplete: (productId: string) => void;
}

const CheckoutForm = ({ product, onCheckoutComplete }: CheckoutFormProps) => {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "bank">("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVC, setCardCVC] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to complete a purchase.",
        variant: "destructive",
      });
      navigate("/login");
    } else if (!user.emailVerified) {
      toast({
        title: "Email verification required",
        description: "Please verify your email before making a purchase.",
        variant: "destructive",
      });
      navigate("/verify-email");
    }
  }, [user, navigate, toast]);
  
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };
  
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    
    if (v.length >= 2) {
      return v.slice(0, 2) + (v.length > 2 ? "/" + v.slice(2, 4) : "");
    }
    
    return v;
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to complete a purchase.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    if (paymentMethod === "card") {
      if (!cardNumber || !cardName || !cardExpiry || !cardCVC) {
        toast({
          title: "Missing information",
          description: "Please fill in all payment fields.",
          variant: "destructive",
        });
        return;
      }
      
      if (cardNumber.replace(/\s+/g, "").length < 16) {
        toast({
          title: "Invalid card number",
          description: "Please enter a valid 16-digit card number.",
          variant: "destructive",
        });
        return;
      }
    }
    
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onCheckoutComplete(product.id);
      navigate(`/payment/confirmation/${product.id}`);
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Checkout</CardTitle>
        <CardDescription>Complete your purchase safely and securely.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Payment Method</h3>
            <RadioGroup
              value={paymentMethod}
              onValueChange={(value) => setPaymentMethod(value as "card" | "bank")}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Credit Card
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bank" id="bank" />
                <Label htmlFor="bank">Bank Transfer (Manual)</Label>
              </div>
            </RadioGroup>
          </div>
          
          {paymentMethod === "card" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
              </div>
              
              <div>
                <Label htmlFor="cardName">Name on Card</Label>
                <Input
                  id="cardName"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="John Smith"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cardExpiry">Expiry Date</Label>
                  <Input
                    id="cardExpiry"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(formatExpiryDate(e.target.value))}
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                </div>
                <div>
                  <Label htmlFor="cardCVC">CVC</Label>
                  <Input
                    id="cardCVC"
                    value={cardCVC}
                    onChange={(e) => setCardCVC(e.target.value.replace(/\D/g, "").slice(0, 3))}
                    placeholder="123"
                    maxLength={3}
                    type="password"
                  />
                </div>
              </div>
            </div>
          )}
          
          {paymentMethod === "bank" && (
            <div className="space-y-4 bg-blue-50 p-4 rounded-lg">
              <p className="text-sm">
                After clicking "Complete Purchase", you'll receive the seller's bank details to complete the transfer manually. 
                The item will be reserved for you for 48 hours.
              </p>
            </div>
          )}
          
          <Separator />
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Item Price</span>
              <span>₪{product.price.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>₪{product.price.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4" />
            <span>Your payment information is secure and encrypted</span>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isProcessing}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Complete Purchase"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CheckoutForm;
