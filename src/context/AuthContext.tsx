
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { MOCK_USERS, User } from "../utils/types";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isVerified: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  sendVerificationEmail: () => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (token: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in (from localStorage in this demo)
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsVerified(parsedUser.emailVerified || false);
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("currentUser");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // For demo purposes, find a user with matching email
      const foundUser = MOCK_USERS.find(u => u.email === email);
      
      if (!foundUser) {
        toast({
          title: "Login failed",
          description: "Invalid credentials. Please try again.",
          variant: "destructive",
        });
        throw new Error("Invalid credentials");
      }
      
      // Check if user is verified
      setIsVerified(foundUser.emailVerified || false);
      setUser(foundUser);
      localStorage.setItem("currentUser", JSON.stringify(foundUser));
      
      toast({
        title: "Welcome back!",
        description: `You've successfully logged in as ${foundUser.name}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Check if email is a Bar-Ilan email
      if (!email.endsWith("@biu.ac.il") && !email.endsWith("@live.biu.ac.il")) {
        toast({
          title: "Registration failed",
          description: "Please use a Bar-Ilan University email address.",
          variant: "destructive",
        });
        throw new Error("Invalid email domain");
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const userExists = MOCK_USERS.some(u => u.email === email);
      
      if (userExists) {
        toast({
          title: "Registration failed",
          description: "A user with this email already exists.",
          variant: "destructive",
        });
        throw new Error("User already exists");
      }
      
      // Create new user
      const newUser: User = {
        id: String(MOCK_USERS.length + 1),
        name,
        email,
        emailVerified: false,
        createdAt: new Date().toISOString(),
      };
      
      MOCK_USERS.push(newUser);
      setUser(newUser);
      setIsVerified(false);
      localStorage.setItem("currentUser", JSON.stringify(newUser));
      
      // Simulate sending verification email
      await sendVerificationEmail();
      
      toast({
        title: "Registration successful!",
        description: "Your account has been created. Please verify your email to continue.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendVerificationEmail = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to request a verification email.",
        variant: "destructive",
      });
      throw new Error("User not authenticated");
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real app, this would send an actual email
    toast({
      title: "Verification email sent",
      description: "Please check your inbox and follow the instructions to verify your email.",
    });
    
    // For demo purposes, we'll automatically verify the email after 5 seconds
    setTimeout(() => {
      if (user) {
        const updatedUser = { ...user, emailVerified: true };
        setUser(updatedUser);
        setIsVerified(true);
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
        
        // Update the user in the MOCK_USERS array
        const userIndex = MOCK_USERS.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
          MOCK_USERS[userIndex] = updatedUser;
        }
        
        toast({
          title: "Email verified",
          description: "Your email has been successfully verified.",
        });
      }
    }, 5000);
  };
  
  const verifyEmail = async (token: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (!user) {
        toast({
          title: "Error",
          description: "User not found.",
          variant: "destructive",
        });
        throw new Error("User not found");
      }
      
      // In a real app, this would validate the token
      
      // Update user verification status
      const updatedUser = { ...user, emailVerified: true };
      setUser(updatedUser);
      setIsVerified(true);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      
      // Update the user in the MOCK_USERS array
      const userIndex = MOCK_USERS.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        MOCK_USERS[userIndex] = updatedUser;
      }
      
      toast({
        title: "Email verified",
        description: "Your email has been successfully verified.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check if user exists
      const foundUser = MOCK_USERS.find(u => u.email === email);
      
      if (!foundUser) {
        // For security reasons, we don't reveal if the email exists or not
        toast({
          title: "Password reset email sent",
          description: "If an account with this email exists, you will receive instructions to reset your password.",
        });
        return;
      }
      
      // In a real app, this would send an actual email with a reset link
      
      toast({
        title: "Password reset email sent",
        description: "Please check your inbox and follow the instructions to reset your password.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const updatePassword = async (token: string, newPassword: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real app, this would validate the token and update the password
      
      toast({
        title: "Password updated",
        description: "Your password has been successfully updated.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsVerified(false);
    localStorage.removeItem("currentUser");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isVerified,
        login,
        register,
        logout,
        sendVerificationEmail,
        verifyEmail,
        resetPassword,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
