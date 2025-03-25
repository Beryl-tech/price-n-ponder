
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Navbar } from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

type FormMode = "login" | "register";

const Login = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [mode, setMode] = useState<FormMode>("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  
  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (mode === "register" && !formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      
      if (mode === "login") {
        await login(formData.email, formData.password);
        toast({
          title: "Welcome back!",
          description: "You have been successfully logged in."
        });
      } else {
        await register(formData.name, formData.email, formData.password);
        toast({
          title: "Account created",
          description: "Your account has been successfully created."
        });
      }
      
      navigate("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description: mode === "login" 
          ? "Invalid email or password. Please try again." 
          : "Failed to create account. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container px-4 md:px-6 py-24">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {mode === "login" ? "Welcome Back" : "Create an Account"}
            </h1>
            <p className="text-muted-foreground">
              {mode === "login" 
                ? "Sign in to your account to continue" 
                : "Sign up to start buying and selling"}
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg border shadow-sm">
            {/* Mode Toggle */}
            <div className="flex mb-6 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setMode("login")}
                className={cn(
                  "flex-1 py-2 text-sm font-medium rounded-md transition-colors",
                  mode === "login" 
                    ? "bg-white shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Sign In
              </button>
              <button
                onClick={() => setMode("register")}
                className={cn(
                  "flex-1 py-2 text-sm font-medium rounded-md transition-colors",
                  mode === "register" 
                    ? "bg-white shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Sign Up
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name (Register only) */}
              {mode === "register" && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={cn(
                      "w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50",
                      errors.name ? "border-red-500" : "border-gray-200"
                    )}
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>
              )}
              
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={cn(
                    "w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50",
                    errors.email ? "border-red-500" : "border-gray-200"
                  )}
                  placeholder="johndoe@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              
              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={cn(
                    "w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50",
                    errors.password ? "border-red-500" : "border-gray-200"
                  )}
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>
              
              {/* Submit Button */}
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full mt-2"
                size="lg"
              >
                {isSubmitting && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                {mode === "login" 
                  ? (isSubmitting ? "Signing In..." : "Sign In") 
                  : (isSubmitting ? "Creating Account..." : "Create Account")}
              </Button>
            </form>
            
            {/* Helper Text */}
            <p className="text-sm text-muted-foreground text-center mt-6">
              {mode === "login" 
                ? "Don't have an account? " 
                : "Already have an account? "}
              <button
                onClick={() => setMode(mode === "login" ? "register" : "login")}
                className="text-primary font-medium hover:underline"
              >
                {mode === "login" ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
