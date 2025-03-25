
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useProducts } from "../context/ProductContext";
import { Button } from "@/components/ui/button";
import { TabsContent, TabsList, TabsTrigger, Tabs } from "@/components/ui/tabs";
import { ProductCard } from "../components/ProductCard";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const Profile = () => {
  const { user, logout } = useAuth();
  const { products } = useProducts();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  
  // Redirect if not authenticated
  if (!user) {
    navigate("/login");
    return null;
  }
  
  // Filter products for the current user
  const userProducts = products.filter(product => product.seller.id === user.id);
  
  const handleLogout = () => {
    setIsLoading(true);
    
    // Simulate logout delay
    setTimeout(() => {
      logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out."
      });
      navigate("/");
    }, 800);
  };
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container px-4 md:px-6 py-24">
        <div className="max-w-5xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-xl border p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Profile Avatar */}
              <div className="w-24 h-24 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <span className="text-3xl font-semibold text-primary">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl font-bold mb-1">{user.name}</h1>
                <p className="text-muted-foreground mb-2">{user.email}</p>
                <p className="text-sm text-muted-foreground">
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </p>
                
                <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/create-listing")}
                  >
                    Create Listing
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleLogout}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Logging Out...
                      </>
                    ) : (
                      "Log Out"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Profile Content */}
          <Tabs defaultValue="listings" className="w-full">
            <TabsList className="w-full grid grid-cols-2 mb-8">
              <TabsTrigger value="listings">My Listings</TabsTrigger>
              <TabsTrigger value="settings">Account Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="listings">
              {userProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center bg-gray-50 py-16 rounded-lg">
                  <h3 className="text-xl font-medium mb-2">No listings yet</h3>
                  <p className="text-muted-foreground mb-6">
                    You haven't created any listings yet.
                  </p>
                  <Button onClick={() => navigate("/create-listing")}>
                    Create Your First Listing
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="settings">
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-6">Account Information</h2>
                
                <div className="space-y-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={user.name}
                      readOnly
                      className="w-full border border-gray-200 rounded-md px-3 py-2 bg-gray-50"
                    />
                  </div>
                  
                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={user.email}
                      readOnly
                      className="w-full border border-gray-200 rounded-md px-3 py-2 bg-gray-50"
                    />
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    This is a demo application. In a real application, you would be able to update your account information here.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Profile;
