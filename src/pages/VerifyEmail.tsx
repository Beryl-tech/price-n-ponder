
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Navbar } from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { verifyEmail, isLoading, isVerified } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [verificationStatus, setVerificationStatus] = useState<"pending" | "success" | "error">("pending");

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setVerificationStatus("error");
        toast({
          variant: "destructive",
          title: "Verification failed",
          description: "No verification token found in the URL."
        });
        return;
      }

      try {
        await verifyEmail(token);
        setVerificationStatus("success");
        toast({
          title: "Email verified",
          description: "Your email has been successfully verified."
        });
      } catch (error) {
        setVerificationStatus("error");
        toast({
          variant: "destructive",
          title: "Verification failed",
          description: "The verification link is invalid or has expired."
        });
      }
    };

    verifyToken();
  }, [token, verifyEmail, toast]);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container px-4 md:px-6 py-24">
        <div className="max-w-md mx-auto">
          <div className="bg-white p-8 rounded-lg border shadow-sm text-center">
            {verificationStatus === "pending" || isLoading ? (
              <div className="flex flex-col items-center justify-center p-8">
                <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
                <h1 className="text-xl font-semibold mb-2">Verifying your email...</h1>
                <p className="text-muted-foreground">This may take a moment.</p>
              </div>
            ) : verificationStatus === "success" ? (
              <div className="flex flex-col items-center justify-center p-8">
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                <h1 className="text-xl font-semibold mb-2">Email Verified!</h1>
                <p className="text-muted-foreground mb-6">
                  Your email has been successfully verified. You can now use all features of the marketplace.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={() => navigate("/profile")}>
                    Go to My Profile
                  </Button>
                  <Button variant="outline" onClick={() => navigate("/products")}>
                    Browse Products
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8">
                <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
                <h1 className="text-xl font-semibold mb-2">Verification Failed</h1>
                <p className="text-muted-foreground mb-6">
                  The verification link is invalid or has expired. Please try again or request a new verification email.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={() => navigate("/login")}>
                    Back to Login
                  </Button>
                  <Button variant="outline" onClick={() => navigate("/")}>
                    Go to Home Page
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default VerifyEmail;
