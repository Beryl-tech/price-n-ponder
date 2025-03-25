
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { ImageIcon, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Navbar } from "../components/Navbar";

const EditListing = () => {
  const { id } = useParams<{ id: string }>();
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
  const [isLoading, setIsLoading] = useState(true);
  
  const { getProduct, updateProduct, formatProductDescription } = useProducts();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }
  
  // Fetch product data
  useEffect(() => {
    if (id) {
      const product = getProduct(id);
      
      if (!product) {
        toast({
          title: "Error",
          description: "Product not found.",
          variant: "destructive",
        });
        navigate("/user-dashboard");
        return;
      }
      
      // Check if the current user is the owner
      if (product.seller.id !== user?.id) {
        toast({
          title: "Unauthorized",
          description: "You don't have permission to edit this listing.",
          variant: "destructive",
        });
        navigate("/products");
        return;
      }
      
      // Set initial form values
      setTitle(product.title);
      setDescription(product.description);
      setPrice(String(product.price));
      setCategory(product.category);
      setCondition(product.condition);
      setLocation(product.location);
      setImageURLs(product.images);
      setIsLoading(false);
    }
  }, [id, getProduct, user, navigate, toast]);
  
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
    
    if (!id) {
      toast({
        title: "Error",
        description: "Product ID is missing.",
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
      
      const updatedProduct = await updateProduct(id, {
        title,
        description: enhancedDescription,
        price: Number(price),
        category,
        condition,
        location,
        images: imageURLs,
      });
      
      toast({
        title: "Listing Updated",
        description: "Your item has been successfully updated.",
      });
      
      // Navigate to the product page
      navigate(`/products/${updatedProduct.id}`);
    } catch (error) {
      console.error("Error updating listing:", error);
      toast({
        title: "Error",
        description: "There was an error updating your listing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container py-24 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <p className="text-lg text-muted-foreground">Loading listing details...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container py-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Edit Listing</h1>
          
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
                <Select onValueChange={setCategory} value={category} required>
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
                <Select onValueChange={(value) => setCondition(value as "new" | "like-new" | "good" | "fair" | "poor")} value={condition}>
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
                <Select onValueChange={setLocation} value={location}>
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
                      Upload Additional Images
                    </>
                  )}
                </Label>
                
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {imageURLs.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Product image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-md"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                        onClick={() => setImageURLs(imageURLs.filter((_, i) => i !== index))}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <Alert className="bg-blue-50 border-blue-200">
              <AlertTitle className="text-blue-800">Important Information</AlertTitle>
              <AlertDescription className="text-blue-700">
                Updating your listing will send notifications to users who have previously viewed or saved it.
              </AlertDescription>
            </Alert>
            
            <div className="flex gap-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/user-dashboard")}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="flex-1"
              >
                {isSubmitting ? "Updating..." : "Update Listing"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditListing;
