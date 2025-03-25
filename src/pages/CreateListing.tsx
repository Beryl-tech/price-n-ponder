
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { useProducts } from "../context/ProductContext";
import { useAuth } from "../context/AuthContext";
import { ImagePlus, Loader2, X, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ProductFormData {
  title: string;
  description: string;
  price: string;
  category: string;
  subcategory: string;
  condition: "new" | "like-new" | "good" | "fair" | "poor";
  location: string;
  images: string[];
  brand: string;
  color: string;
  size: string;
  originalPrice: string;
  acceptsTrade: boolean;
  negotiable: boolean;
  tags: string[];
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

const SUBCATEGORIES: Record<string, string[]> = {
  "Electronics": ["Laptops", "Phones", "Tablets", "Cameras", "Accessories", "Other"],
  "Clothing": ["Tops", "Bottoms", "Outerwear", "Shoes", "Accessories", "Other"],
  "Furniture": ["Seating", "Tables", "Storage", "Beds", "Desks", "Other"],
  "Sports": ["Equipment", "Clothing", "Footwear", "Accessories", "Other"],
  "Music": ["Instruments", "Equipment", "Vinyl", "CDs", "Other"],
  "Art": ["Prints", "Originals", "Supplies", "Other"],
  "Books": ["Textbooks", "Fiction", "Non-Fiction", "Course Materials", "Other"],
  "Collectibles": ["Cards", "Figures", "Memorabilia", "Other"],
  "Toys": ["Games", "Puzzles", "Action Figures", "Other"],
  "Automotive": ["Parts", "Accessories", "Other"],
  "Other": ["Miscellaneous"],
};

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
    subcategory: "",
    condition: "good",
    location: "",
    images: [],
    brand: "",
    color: "",
    size: "",
    originalPrice: "",
    acceptsTrade: false,
    negotiable: true,
    tags: [],
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState("");
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Reset subcategory when category changes
    if (name === "category") {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        subcategory: "" 
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  // Handle image upload (simulated)
  const handleImageUpload = () => {
    // In a real app, this would be an actual file upload
    // For demo purposes, we'll use a random placeholder image
    const randomImage = PLACEHOLDER_IMAGES[Math.floor(Math.random() * PLACEHOLDER_IMAGES.length)];
    
    if (formData.images.length >= 5) {
      toast({
        variant: "destructive",
        title: "Maximum Images Reached",
        description: "You can only upload up to 5 images per listing."
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
  
  // Handle tag input
  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };
  
  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 5) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput('');
    } else if (formData.tags.length >= 5) {
      toast({
        variant: "destructive",
        title: "Maximum Tags Reached",
        description: "You can only add up to 5 tags per listing."
      });
    }
  };
  
  // Remove tag
  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
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
    
    if (formData.category && !formData.subcategory && SUBCATEGORIES[formData.category]?.length > 0) {
      newErrors.subcategory = "Subcategory is required";
    }
    
    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }
    
    if (formData.images.length === 0) {
      newErrors.images = "At least one image is required";
    }
    
    if (formData.originalPrice && (isNaN(Number(formData.originalPrice)) || Number(formData.originalPrice) <= 0)) {
      newErrors.originalPrice = "Original price must be a positive number";
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
        title: "Authentication Required",
        description: "Please sign in to create a listing"
      });
      navigate("/login");
      return;
    }
    
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      
      // Note: We're intentionally not submitting all fields to match the Product type
      // In a production app, we would update the Product type to include these fields
      const newProduct = await createProduct({
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        condition: formData.condition,
        location: formData.location,
        images: formData.images,
        // The following are additional fields not in the Product type
        subcategory: formData.subcategory || undefined,
        brand: formData.brand || undefined,
        color: formData.color || undefined,
        size: formData.size || undefined,
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        negotiable: formData.negotiable,
        tags: formData.tags.length > 0 ? formData.tags : undefined,
      });
      
      toast({
        title: "Listing Created",
        description: "Your listing has been successfully created!"
      });
      
      navigate(`/products/${newProduct.id}`);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to Create Listing",
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
          <h1 className="text-3xl font-bold mb-2">Create Listing</h1>
          <p className="text-muted-foreground mb-8">
            Provide detailed information about your item to help it sell faster.
          </p>
          
          <div className="mb-8 p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <h3 className="font-medium text-blue-700 mb-2 flex items-center">
              <HelpCircle className="w-4 h-4 mr-1" />
              Listing Tips
            </h3>
            <ul className="list-disc pl-5 text-sm text-blue-700 space-y-1">
              <li>Include high-quality photos to showcase your item</li>
              <li>Be honest about the condition to avoid returns or disputes</li>
              <li>Set a competitive price by comparing similar listings</li>
              <li>Offer thorough details and respond to buyer questions quickly</li>
            </ul>
          </div>
          
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
                placeholder="Enter a descriptive title"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>
            
            {/* Price and Original Price Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Price */}
              <div>
                <label htmlFor="price" className="block text-sm font-medium mb-2">
                  Price <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    ₪
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
              
              {/* Original Price */}
              <div>
                <label htmlFor="originalPrice" className="block text-sm font-medium mb-2">
                  Original Price <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    ₪
                  </span>
                  <input
                    type="text"
                    id="originalPrice"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleChange}
                    className={cn(
                      "w-full border rounded-md pl-8 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50",
                      errors.originalPrice ? "border-red-500" : "border-gray-200"
                    )}
                    placeholder="0"
                  />
                </div>
                {errors.originalPrice && (
                  <p className="text-red-500 text-sm mt-1">{errors.originalPrice}</p>
                )}
              </div>
            </div>
            
            {/* Price Options */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="negotiable"
                  name="negotiable"
                  checked={formData.negotiable}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-primary focus:ring-primary/50 border-gray-300 rounded"
                />
                <label htmlFor="negotiable" className="ml-2 text-sm">
                  Price is negotiable
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="acceptsTrade"
                  name="acceptsTrade"
                  checked={formData.acceptsTrade}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-primary focus:ring-primary/50 border-gray-300 rounded"
                />
                <label htmlFor="acceptsTrade" className="ml-2 text-sm">
                  Open to trades
                </label>
              </div>
            </div>
            
            {/* Images */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Images <span className="text-red-500">*</span>
                <span className="text-muted-foreground text-xs ml-2">(Maximum 5 images)</span>
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
            
            {/* Category and Subcategory */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              
              {/* Subcategory - only show if category is selected */}
              {formData.category && SUBCATEGORIES[formData.category]?.length > 0 && (
                <div>
                  <label htmlFor="subcategory" className="block text-sm font-medium mb-2">
                    Subcategory <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="subcategory"
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleChange}
                    className={cn(
                      "w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50",
                      errors.subcategory ? "border-red-500" : "border-gray-200"
                    )}
                  >
                    <option value="">Select a subcategory</option>
                    {SUBCATEGORIES[formData.category].map(subcategory => (
                      <option key={subcategory} value={subcategory}>
                        {subcategory}
                      </option>
                    ))}
                  </select>
                  {errors.subcategory && (
                    <p className="text-red-500 text-sm mt-1">{errors.subcategory}</p>
                  )}
                </div>
              )}
            </div>
            
            {/* Condition */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Condition <span className="text-red-500">*</span>
              </label>
              <RadioGroup 
                value={formData.condition} 
                onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, condition: value as typeof formData.condition }))
                }
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3"
              >
                {CONDITIONS.map(({ value, label }) => (
                  <div key={value} className={cn(
                    "border rounded-md px-4 py-3 text-center cursor-pointer transition-colors",
                    formData.condition === value
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300"
                  )}>
                    <RadioGroupItem 
                      value={value} 
                      id={`condition-${value}`} 
                      className="sr-only" 
                    />
                    <label htmlFor={`condition-${value}`} className="cursor-pointer">
                      {label}
                    </label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            {/* Additional Details Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Brand */}
              <div>
                <label htmlFor="brand" className="block text-sm font-medium mb-2">
                  Brand <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="e.g. Apple, Nike, IKEA"
                />
              </div>
              
              {/* Color */}
              <div>
                <label htmlFor="color" className="block text-sm font-medium mb-2">
                  Color <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <input
                  type="text"
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="e.g. Black, Red, Blue"
                />
              </div>
              
              {/* Size */}
              <div>
                <label htmlFor="size" className="block text-sm font-medium mb-2">
                  Size <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <input
                  type="text"
                  id="size"
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="e.g. S, M, L, XL, 42"
                />
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
                placeholder="Campus building, specific area"
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location}</p>
              )}
            </div>
            
            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium mb-2">
                Tags <span className="text-gray-400 text-xs">(Optional - Maximum 5 tags)</span>
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  className="flex-1 border border-gray-200 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Add keywords to help buyers find your item"
                />
                <Button 
                  type="button" 
                  onClick={addTag}
                  variant="secondary"
                  className="rounded-l-none"
                >
                  Add
                </Button>
              </div>
              
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag, index) => (
                    <div key={index} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="ml-2 text-secondary-foreground/70 hover:text-secondary-foreground"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
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
                placeholder="Describe your item in detail - include information about features, condition, history, and any defects"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>
            
            {/* Platform Fee Information */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-medium mb-2">Platform Fee Information</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Bar-Mart charges a 5% fee on all transactions to maintain the platform and protect both buyers and sellers.
              </p>
              <div className="flex justify-between text-sm">
                <span>Your listing price</span>
                <span>₪{formData.price ? Number(formData.price).toFixed(0) : "0"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Platform fee (5%)</span>
                <span>₪{formData.price ? Math.ceil(Number(formData.price) * 0.05).toFixed(0) : "0"}</span>
              </div>
              <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between font-medium">
                <span>Buyer will pay</span>
                <span>₪{formData.price ? (Number(formData.price) + Math.ceil(Number(formData.price) * 0.05)).toFixed(0) : "0"}</span>
              </div>
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
