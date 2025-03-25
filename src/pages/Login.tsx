
import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Navbar } from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, CheckCircle, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type FormMode = "login" | "register" | "reset";

const Login = () => {
  const { login, register, resetPassword, verifyEmail, isVerified, user, isAuthenticated, isLoading: authLoading, sendVerificationEmail } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const verifyToken = searchParams.get("verify");
  const { toast } = useToast();
  
  const [mode, setMode] = useState<FormMode>("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [showPasswordResetDialog, setShowPasswordResetDialog] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  
  // Handle token verification
  useEffect(() => {
    if (verifyToken) {
      const verifyEmailToken = async () => {
        try {
          await verifyEmail(verifyToken);
          navigate("/profile");
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Verification failed",
            description: "The verification link is invalid or has expired."
          });
        }
      };
      
      verifyEmailToken();
    }
  }, [verifyToken, verifyEmail, navigate, toast]);
  
  // Show verification dialog if logged in but not verified
  useEffect(() => {
    if (isAuthenticated && !isVerified && !authLoading) {
      setShowVerificationDialog(true);
    } else {
      setShowVerificationDialog(false);
    }
  }, [isAuthenticated, isVerified, authLoading]);
  
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
    
    if (mode === "register") {
      if (!formData.name.trim()) {
        newErrors.name = "Name is required";
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Confirm password is required";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.password && mode !== "reset") {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6 && mode !== "reset") {
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
      } else if (mode === "register") {
        await register(formData.name, formData.email, formData.password);
      } else if (mode === "reset") {
        await resetPassword(formData.email);
        // After requesting password reset, show confirmation
        toast({
          title: "Password reset email sent",
          description: "Please check your inbox for further instructions."
        });
        setMode("login");
      }
    } catch (error) {
      console.error("Authentication error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleResendVerification = async () => {
    try {
      setIsSubmitting(true);
      await sendVerificationEmail();
    } catch (error) {
      console.error("Error sending verification email:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleResetPassword = async () => {
    if (!resetEmail.trim() || !/\S+@\S+\.\S+/.test(resetEmail)) {
      toast({
        variant: "destructive",
        title: "Invalid email",
        description: "Please enter a valid email address."
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      await resetPassword(resetEmail);
      setShowPasswordResetDialog(false);
    } catch (error) {
      console.error("Error resetting password:", error);
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
              {mode === "login" ? "Welcome Back" : mode === "register" ? "Create an Account" : "Reset Password"}
            </h1>
            <p className="text-muted-foreground">
              {mode === "login" 
                ? "Sign in to your account to continue" 
                : mode === "register"
                ? "Sign up to start buying and selling"
                : "Enter your email to receive a password reset link"}
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
                  <Label htmlFor="name" className="block text-sm font-medium mb-2">
                    Full Name
                  </Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={cn(
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
                <Label htmlFor="email" className="block text-sm font-medium mb-2">
                  Bar-Ilan Email
                </Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={cn(
                    errors.email ? "border-red-500" : "border-gray-200"
                  )}
                  placeholder={mode === "register" ? "your.name@biu.ac.il" : "johndoe@example.com"}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
                {mode === "register" && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Must be a valid Bar-Ilan University email address
                  </p>
                )}
              </div>
              
              {/* Password */}
              {mode !== "reset" && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label htmlFor="password">Password</Label>
                    {mode === "login" && (
                      <button
                        type="button"
                        onClick={() => setShowPasswordResetDialog(true)}
                        className="text-xs text-primary hover:underline"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <Input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={cn(
                      errors.password ? "border-red-500" : "border-gray-200"
                    )}
                    placeholder="••••••••"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                  )}
                </div>
              )}
              
              {/* Confirm Password (Register only) */}
              {mode === "register" && (
                <div>
                  <Label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                    Confirm Password
                  </Label>
                  <Input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={cn(
                      errors.confirmPassword ? "border-red-500" : "border-gray-200"
                    )}
                    placeholder="••••••••"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
              )}
              
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
                  : mode === "register"
                  ? (isSubmitting ? "Creating Account..." : "Create Account")
                  : (isSubmitting ? "Sending Reset Link..." : "Send Reset Link")}
              </Button>
            </form>
            
            {/* Helper Text */}
            <p className="text-sm text-muted-foreground text-center mt-6">
              {mode === "login" 
                ? "Don't have an account? " 
                : mode === "register"
                ? "Already have an account? "
                : "Remember your password? "}
              <button
                type="button"
                onClick={() => setMode(mode === "login" ? "register" : "login")}
                className="text-primary font-medium hover:underline"
              >
                {mode === "login" ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </div>
      </main>

      {/* Email Verification Dialog */}
      <Dialog open={showVerificationDialog} onOpenChange={setShowVerificationDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Verify your email address</DialogTitle>
            <DialogDescription>
              Please verify your email address to continue using the platform. Check your inbox for a verification link.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-4 space-y-4">
            <Mail className="h-16 w-16 text-primary" />
            <p className="text-center text-sm">
              We've sent a verification email to <span className="font-semibold">{user?.email}</span>
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleResendVerification}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                "Resend Verification Email"
              )}
            </Button>
            <Button onClick={() => navigate("/")}>
              Back to Home
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Password Reset Dialog */}
      <Dialog open={showPasswordResetDialog} onOpenChange={setShowPasswordResetDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reset your password</DialogTitle>
            <DialogDescription>
              Enter your email address and we'll send you a link to reset your password.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="reset-email">Email</Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="john@example.com"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={handleResetPassword}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;
