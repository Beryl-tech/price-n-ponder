
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Navbar } from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle, AlertCircle, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { updatePassword, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetStatus, setResetStatus] = useState<"pending" | "success" | "error">("pending");
  
  useEffect(() => {
    if (!token) {
      setResetStatus("error");
      toast({
        variant: "destructive",
        title: "Invalid request",
        description: "No reset token found in the URL."
      });
    }
  }, [token, toast]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setError("");
    
    try {
      setIsSubmitting(true);
      
      if (!token) {
        throw new Error("No reset token found");
      }
      
      await updatePassword(token, password);
      setResetStatus("success");
      
      toast({
        title: "Password updated",
        description: "Your password has been successfully updated."
      });
      
      // Redirect after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      setResetStatus("error");
      toast({
        variant: "destructive",
        title: "Password reset failed",
        description: "The reset link is invalid or has expired."
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
          <div className="bg-white p-8 rounded-lg border shadow-sm">
            {resetStatus === "pending" ? (
              <>
                <div className="text-center mb-6">
                  <Lock className="h-12 w-12 text-primary mx-auto mb-3" />
                  <h1 className="text-2xl font-bold">Reset Password</h1>
                  <p className="text-muted-foreground">Create a new password for your account</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="password">New Password</Label>
                    <Input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-1"
                      placeholder="••••••••"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Must be at least 6 characters
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      type="password"
                      id="confirm-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="mt-1"
                      placeholder="••••••••"
                    />
                  </div>
                  
                  {error && (
                    <p className="text-sm text-red-500">{error}</p>
                  )}
                  
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Updating Password...
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </Button>
                </form>
              </>
            ) : resetStatus === "success" ? (
              <div className="flex flex-col items-center justify-center p-6">
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                <h1 className="text-xl font-semibold mb-2">Password Updated!</h1>
                <p className="text-muted-foreground mb-6 text-center">
                  Your password has been successfully updated. You will be redirected to the login page shortly.
                </p>
                <Button onClick={() => navigate("/login")}>
                  Go to Login
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-6">
                <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
                <h1 className="text-xl font-semibold mb-2">Invalid Reset Link</h1>
                <p className="text-muted-foreground mb-6 text-center">
                  The password reset link is invalid or has expired. Please request a new password reset link.
                </p>
                <Button onClick={() => navigate("/login")}>
                  Back to Login
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResetPassword;
