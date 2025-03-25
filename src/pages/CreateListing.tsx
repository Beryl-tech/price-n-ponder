
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { ImageIcon, CreditCard, HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const CreateListing = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState<"new" | "like-new" | "good" | "fair" | "poor">("new");
  const [location, setLocation] = useState("Bar Ilan University");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageURLs, setImageURLs] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isAIEnabled, setIsAIEnabled] = useState(true);
  
  // Payment info state
  const [paymentMethod, setPaymentMethod] = useState<string>("bank");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [branchNumber, setBranchNumber] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");
  
  const { createProduct, formatProductDescription } = useProducts();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }
  
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    
    setUploading(true);
    
    try {
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        
        // Convert file to base64 string
        const base64 = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(file);
        });
        
        urls.push(base64);
      }
      
      setImageURLs(prevURLs => [...prevURLs, ...urls]);
    } catch (error) {
      console.error("Error uploading images:", error);
      toast({
        title: "Error",
        description: "There was an error uploading your images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    
    // Validate payment information
    if (paymentMethod === "bank" && (!accountName || !accountNumber || !bankName || !branchNumber)) {
      toast({
        title: "Missing Payment Information",
        description: "Please complete all bank account details to receive payments.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
    
    if (paymentMethod === "paypal" && !paypalEmail) {
      toast({
        title: "Missing PayPal Email",
        description: "Please enter your PayPal email to receive payments.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Format description with AI if needed
      let enhancedDescription = description;
      if (description && isAIEnabled) {
        enhancedDescription = await formatProductDescription(description);
      }
      
      const newProduct = await createProduct({
        title,
        description: enhancedDescription,
        price: Number(price),
        category,
        condition,
        location,
        images: imageURLs,
      });
      
      toast({
        title: "Listing Created",
        description: "Your item has been successfully listed.",
      });
      
      // Navigate to the product page
      navigate(`/products/${newProduct.id}`);
    } catch (error) {
      console.error("Error creating listing:", error);
      toast({
        title: "Error",
        description: "There was an error creating your listing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container py-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create a New Listing</h1>
        
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <AlertTitle className="text-blue-800">Platform Fee Information</AlertTitle>
          <AlertDescription className="text-blue-700">
            A 5% platform fee will be added to your listing price when shown to buyers.
            You will receive the full amount you specify below.
          </AlertDescription>
        </Alert>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-100 space-y-4">
            <h2 className="text-xl font-semibold mb-2">Item Information</h2>
            
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
              />
              <div className="flex items-center justify-between mt-2">
                <Label htmlFor="ai-enhance" className="text-sm">
                  Enhance with AI
                </Label>
                <Switch
                  id="ai-enhance"
                  checked={isAIEnabled}
                  onCheckedChange={(checked) => setIsAIEnabled(checked)}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="price">Price (ILS)</Label>
              <Input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="category">Category</Label>
              <Select onValueChange={setCategory} required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Clothing">Clothing</SelectItem>
                  <SelectItem value="Furniture">Furniture</SelectItem>
                  <SelectItem value="Books">Books</SelectItem>
                  <SelectItem value="Sports">Sports</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="condition">Condition</Label>
              <Select onValueChange={(value) => setCondition(value as "new" | "like-new" | "good" | "fair" | "poor")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="like-new">Like New</SelectItem>
                  <SelectItem value="good">Used - Good</SelectItem>
                  <SelectItem value="fair">Used - Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="location">Location</Label>
              <Select onValueChange={setLocation}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bar Ilan University">Bar Ilan University</SelectItem>
                  <SelectItem value="Tel Aviv University">Tel Aviv University</SelectItem>
                  <SelectItem value="Hebrew University">Hebrew University</SelectItem>
                  <SelectItem value="Technion">Technion</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="images">Images</Label>
              <Input
                type="file"
                id="images"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Label htmlFor="images" className={cn(
                "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2",
                uploading ? "cursor-wait" : "cursor-pointer"
              )}>
                {uploading ? "Uploading..." : (
                  <>
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Upload Images
                  </>
                )}
              </Label>
              
              <div className="mt-2 grid grid-cols-3 gap-2">
                {imageURLs.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Uploaded image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-md"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Payment Information Section */}
          <div className="bg-white p-6 rounded-lg border border-gray-100 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Payment Information</h2>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Your payment details are securely stored and used only for transferring funds when your items are sold.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="payment-method">Payment Method</Label>
                <Select onValueChange={setPaymentMethod} defaultValue="bank">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {paymentMethod === "bank" && (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="account-name">Account Holder Name</Label>
                    <Input
                      id="account-name"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      placeholder="Full name as appears on account"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="bank-name">Bank Name</Label>
                      <Input
                        id="bank-name"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        placeholder="e.g. Bank Leumi"
                      />
                    </div>
                    <div>
                      <Label htmlFor="branch-number">Branch Number</Label>
                      <Input
                        id="branch-number"
                        value={branchNumber}
                        onChange={(e) => setBranchNumber(e.target.value)}
                        placeholder="e.g. 123"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="account-number">Account Number</Label>
                    <Input
                      id="account-number"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="Your bank account number"
                    />
                  </div>
                </div>
              )}
              
              {paymentMethod === "paypal" && (
                <div>
                  <Label htmlFor="paypal-email">PayPal Email</Label>
                  <Input
                    id="paypal-email"
                    type="email"
                    value={paypalEmail}
                    onChange={(e) => setPaypalEmail(e.target.value)}
                    placeholder="email@example.com"
                  />
                </div>
              )}
            </div>
          </div>
          
          <Button disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Creating Listing..." : "Create Listing"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateListing;
