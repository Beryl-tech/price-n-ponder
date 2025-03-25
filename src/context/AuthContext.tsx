
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { MOCK_USERS, User } from "../utils/types";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in (from localStorage in this demo)
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
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
        createdAt: new Date().toISOString(),
      };
      
      MOCK_USERS.push(newUser);
      setUser(newUser);
      localStorage.setItem("currentUser", JSON.stringify(newUser));
      
      toast({
        title: "Registration successful!",
        description: "Your account has been created.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
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
        login,
        register,
        logout,
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
