
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { useProducts } from "../context/ProductContext";
import { useAuth } from "../context/AuthContext";
import { ImagePlus, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface ProductFormData {
  title: string;
  description: string;
  price: string;
  category: string;
  condition: "new" | "like-new" | "good" | "fair" | "poor";
  location: string;
  images: string[];
}

const CONDITIONS = [
  { value: "new", label: "New" },
  { value: "like-new", label: "Like New" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "poor", label: "Poor" },
];

const CATEGORIES = [
  "Electronics",
  "Clothing",
  "Furniture",
  "Sports",
  "Music",
  "Art",
  "Books",
  "Collectibles",
  "Toys",
  "Automotive",
  "Other",
];

const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1603123853880-a92fafb7809f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1769&q=80",
  "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1665&q=80",
  "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1335&q=80",
];

const CreateListing = () => {
  const { createProduct } = useProducts();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<ProductFormData>({
    title: "",
    description: "",
    price: "",
    category: "",
    condition: "good",
    location: "",
    images: [],
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Handle image upload (simulated)
  const handleImageUpload = () => {
    // In a real app, this would be an actual file upload
    // For demo purposes, we'll use a random placeholder image
    const randomImage = PLACEHOLDER_IMAGES[Math.floor(Math.random() * PLACEHOLDER_IMAGES.length)];
    
    if (formData.images.length >= 5) {
      toast({
        variant: "destructive",
        title: "Maximum images reached",
        description: "You can upload a maximum of 5 images per listing."
      });
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, randomImage]
    }));
  };
  
  // Handle image removal
  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    
    if (!formData.price.trim()) {
      newErrors.price = "Price is required";
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "Price must be a positive number";
    }
    
    if (!formData.category) {
      newErrors.category = "Category is required";
    }
    
    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }
    
    if (formData.images.length === 0) {
      newErrors.images = "At least one image is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to create a listing."
      });
      navigate("/login");
      return;
    }
    
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      
      const newProduct = await createProduct({
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        condition: formData.condition,
        location: formData.location,
        images: formData.images,
      });
      
      toast({
        title: "Listing created",
        description: "Your item has been successfully listed."
      });
      
      navigate(`/products/${newProduct.id}`);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to create listing",
        description: "Please try again later."
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container px-4 md:px-6 py-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Create a Listing</h1>
          <p className="text-muted-foreground mb-8">
            Provide detailed information to help your item sell quickly
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={cn(
                  "w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50",
                  errors.title ? "border-red-500" : "border-gray-200"
                )}
                placeholder="e.g., iPhone 12 Pro Max - 256GB - Pacific Blue"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>
            
            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium mb-2">
                Price <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  $
                </span>
                <input
                  type="text"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className={cn(
                    "w-full border rounded-md pl-8 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50",
                    errors.price ? "border-red-500" : "border-gray-200"
                  )}
                  placeholder="0"
                />
              </div>
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price}</p>
              )}
            </div>
            
            {/* Images */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Images <span className="text-red-500">*</span>
                <span className="text-muted-foreground text-xs ml-2">(Max 5 images)</span>
              </label>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {/* Image Upload Button */}
                <button
                  type="button"
                  onClick={handleImageUpload}
                  className={cn(
                    "border-2 border-dashed rounded-md aspect-square flex flex-col items-center justify-center p-4 transition-colors",
                    "hover:border-primary hover:bg-primary/5",
                    errors.images ? "border-red-500" : "border-gray-200"
                  )}
                >
                  <ImagePlus className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">Add Image</span>
                </button>
                
                {/* Uploaded Images */}
                {formData.images.map((image, index) => (
                  <div key={index} className="relative aspect-square rounded-md overflow-hidden">
                    <img
                      src={image}
                      alt={`Product image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 w-6 h-6 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 hover:bg-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              
              {errors.images && (
                <p className="text-red-500 text-sm mt-1">{errors.images}</p>
              )}
            </div>
            
            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={cn(
                  "w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50",
                  errors.category ? "border-red-500" : "border-gray-200"
                )}
              >
                <option value="">Select a category</option>
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category}</p>
              )}
            </div>
            
            {/* Condition */}
            <div>
              <label htmlFor="condition" className="block text-sm font-medium mb-2">
                Condition <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {CONDITIONS.map(({ value, label }) => (
                  <label
                    key={value}
                    className={cn(
                      "border rounded-md px-4 py-2 text-center cursor-pointer transition-colors",
                      formData.condition === value
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <input
                      type="radio"
                      name="condition"
                      value={value}
                      checked={formData.condition === value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>
            
            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={cn(
                  "w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50",
                  errors.location ? "border-red-500" : "border-gray-200"
                )}
                placeholder="e.g., San Francisco, CA"
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location}</p>
              )}
            </div>
            
            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className={cn(
                  "w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50",
                  errors.description ? "border-red-500" : "border-gray-200"
                )}
                placeholder="Describe your item in detail. Include information about brand, model, dimensions, condition, etc."
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>
            
            {/* Submit Button */}
            <div>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full md:w-auto"
                size="lg"
              >
                {isSubmitting && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                {isSubmitting ? "Creating Listing..." : "Create Listing"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateListing;
