import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { useProducts } from "../context/ProductContext";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft, ChevronLeft, ChevronRight, Heart, MessageSquare, Share, ShieldCheck, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { ProductGrid } from "../components/ProductGrid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getProduct, products, sendMessage } = useProducts();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  const product = getProduct(id || "");
  
  if (!product) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container px-4 md:px-6 py-24 text-center">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/products")}>
            Browse Products
          </Button>
        </main>
      </div>
    );
  }
  
  const { title, description, price, images, condition, category, location, seller, createdAt } = product;
  
  const formattedPrice = new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
  
  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  
  const relatedProducts = products
    .filter(p => p.category === category && p.id !== id)
    .slice(0, 4);
  
  const handlePrevImage = () => {
    setActiveImageIndex(prev => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };
  
  const handleNextImage = () => {
    setActiveImageIndex(prev => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };
  
  const handleSendMessage = async () => {
    if (!isAuthenticated || !user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to send messages to sellers."
      });
      navigate("/login");
      return;
    }
    
    if (!message.trim()) return;
    
    try {
      setIsSending(true);
      await sendMessage(message, seller.id, product.id);
      setMessage("");
      setIsMessageDialogOpen(false);
      toast({
        title: "Message sent",
        description: "Your message has been sent to the seller."
      });
      navigate("/messages");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to send message",
        description: "Please try again later."
      });
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container px-4 md:px-6 py-24">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to results
        </button>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl overflow-hidden border border-gray-100">
              <div className="relative h-[400px] md:h-[500px] bg-gray-50">
                <img 
                  src={images[activeImageIndex]} 
                  alt={title}
                  className="w-full h-full object-contain"
                />
                
                {images.length > 1 && (
                  <>
                    <button 
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-gray-700 hover:bg-white transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-gray-700 hover:bg-white transition-colors"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>
              
              {images.length > 1 && (
                <div className="flex p-4 gap-2 overflow-x-auto scrollbar-none">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={cn(
                        "w-20 h-20 flex-shrink-0 rounded-md overflow-hidden",
                        activeImageIndex === index ? "ring-2 ring-primary" : "opacity-70"
                      )}
                    >
                      <img 
                        src={image} 
                        alt={`${title} - image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="lg:col-span-2 flex flex-col">
            <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6 flex-grow">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{title}</h1>
              <p className="text-3xl font-semibold text-primary mb-4">{formattedPrice}</p>
              
              <Alert className="mb-4 bg-yellow-50 border-yellow-200 text-yellow-800">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Demo Product</AlertTitle>
                <AlertDescription>
                  This is a demo listing and not available for purchase.
                </AlertDescription>
              </Alert>
              
              <div className="flex items-center gap-2 mb-6">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                  {condition}
                </span>
                <span className="text-sm text-muted-foreground">
                  Listed {timeAgo}
                </span>
              </div>
              
              <div className="flex items-center mb-6">
                {seller.avatar ? (
                  <img 
                    src={seller.avatar} 
                    alt={seller.name}
                    className="w-10 h-10 rounded-full object-cover mr-3" 
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <span className="text-primary font-medium">
                      {seller.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-medium">{seller.name}</p>
                  <p className="text-xs text-muted-foreground">Member since {new Date(seller.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-1">Location</h3>
                <p className="text-muted-foreground">{location}</p>
              </div>
              
              <div className="mb-6 p-3 bg-green-50 border border-green-100 rounded-lg flex items-start">
                <ShieldCheck className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800">Stay safe when buying</p>
                  <p className="text-xs text-green-700">
                    Meet in public places and inspect the item before payment.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 mb-6">
                <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex-1">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Message Seller
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Message the Seller</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="flex items-center gap-3 mb-4">
                        <img 
                          src={images[0]} 
                          alt={title}
                          className="w-16 h-16 object-cover rounded-md" 
                        />
                        <div>
                          <h3 className="font-medium">{title}</h3>
                          <p className="text-sm text-muted-foreground">{formattedPrice}</p>
                        </div>
                      </div>
                      
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Hi! Is this item still available?"
                        rows={4}
                        className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                      
                      <Button 
                        onClick={handleSendMessage} 
                        disabled={!message.trim() || isSending}
                        className="w-full"
                      >
                        Send Message
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Button variant="outline" className="flex-1">
                  <Heart className="w-4 h-4 mr-2" />
                  Save
                </Button>
                
                <Button variant="outline" size="icon">
                  <Share className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12">
          <Tabs defaultValue="description">
            <TabsList className="w-full grid grid-cols-2 md:flex md:w-auto">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="bg-white rounded-lg border p-6 mt-4">
              <h2 className="text-xl font-semibold mb-4">About this item</h2>
              <p className="text-muted-foreground whitespace-pre-line">{description}</p>
            </TabsContent>
            <TabsContent value="details" className="bg-white rounded-lg border p-6 mt-4">
              <h2 className="text-xl font-semibold mb-4">Item Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Category</h3>
                    <p>{category}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Condition</h3>
                    <p>{condition}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                    <p>{location}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Posted</h3>
                    <p>{new Date(createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Similar Items</h2>
            <ProductGrid products={relatedProducts} columns={4} />
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductDetail;
