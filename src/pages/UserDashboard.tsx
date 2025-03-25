
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useProducts } from "../context/ProductContext";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { Pencil, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const UserDashboard = () => {
  const { user } = useAuth();
  const { products, deleteProduct } = useProducts();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  
  // Redirect if not authenticated
  if (!user) {
    navigate("/login");
    return null;
  }
  
  // Filter products for the current user
  const userProducts = products.filter(product => product.seller.id === user.id);
  
  // Group products by status (if we implemented draft/active/sold statuses)
  const activeProducts = userProducts.filter(product => !product.sold);
  const soldProducts = userProducts.filter(product => product.sold);
  
  const handleEditListing = (productId: string) => {
    navigate(`/edit-listing/${productId}`);
  };
  
  const handleDeleteListing = async (productId: string) => {
    try {
      setDeletingProductId(productId);
      await deleteProduct(productId);
      toast({
        title: "Listing deleted",
        description: "Your listing has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting listing:", error);
      toast({
        title: "Error",
        description: "There was a problem deleting your listing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingProductId(null);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container px-4 md:px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">My Dashboard</h1>
          
          <Tabs defaultValue="listings" className="w-full">
            <TabsList className="w-full grid grid-cols-2 mb-8">
              <TabsTrigger value="listings">My Listings</TabsTrigger>
              <TabsTrigger value="sold">Sold Items</TabsTrigger>
            </TabsList>
            
            <TabsContent value="listings">
              {activeProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeProducts.map(product => (
                    <Card key={product.id} className="overflow-hidden">
                      <div className="aspect-video w-full overflow-hidden">
                        <img 
                          src={product.images[0]} 
                          alt={product.title}
                          className="h-full w-full object-cover transition-all hover:scale-105"
                        />
                      </div>
                      <CardHeader>
                        <CardTitle className="line-clamp-1">{product.title}</CardTitle>
                        <CardDescription>
                          {new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS' }).format(product.price)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {product.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Posted {formatDistanceToNow(new Date(product.createdAt), { addSuffix: true })}
                        </p>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditListing(product.id)}
                        >
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your listing.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteListing(product.id)}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                {deletingProductId === product.id ? (
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4 mr-2" />
                                )}
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center bg-gray-50 py-16 rounded-lg">
                  <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
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
            
            <TabsContent value="sold">
              {soldProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {soldProducts.map(product => (
                    <Card key={product.id} className="overflow-hidden">
                      <div className="aspect-video w-full overflow-hidden relative">
                        <img 
                          src={product.images[0]} 
                          alt={product.title}
                          className="h-full w-full object-cover brightness-75"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="bg-green-500/90 text-white px-3 py-1 rounded-full text-sm font-medium">
                            Sold
                          </span>
                        </div>
                      </div>
                      <CardHeader>
                        <CardTitle className="line-clamp-1">{product.title}</CardTitle>
                        <CardDescription>
                          {new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS' }).format(product.price)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {product.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Sold {formatDistanceToNow(new Date(product.soldAt || product.updatedAt), { addSuffix: true })}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center bg-gray-50 py-16 rounded-lg">
                  <h3 className="text-xl font-medium mb-2">No sold items yet</h3>
                  <p className="text-muted-foreground mb-6">
                    You haven't sold any items yet.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
