
import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { Product, MOCK_PRODUCTS, Message, MOCK_MESSAGES, MessageThread, MOCK_MESSAGE_THREADS } from "../utils/types";
import { useAuth } from "./AuthContext";
import { formatDescription, containsExternalSaleAttempt as checkDescription } from "../utils/descriptionFormatter";
import { useToast } from "@/hooks/use-toast";

interface ProductContextType {
  products: Product[];
  getProduct: (id: string) => Product | undefined;
  createProduct: (product: Omit<Product, "id" | "createdAt" | "updatedAt" | "seller" | "sold" | "soldAt">) => Promise<Product>;
  updateProduct: (id: string, product: Partial<Omit<Product, "id" | "createdAt" | "updatedAt" | "seller" | "sold" | "soldAt">>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  confirmPurchase: (productId: string, buyerId: string) => Promise<void>;
  messages: Message[];
  messageThreads: MessageThread[];
  getMessages: (threadId: string) => Message[];
  sendMessage: (content: string, receiverId: string, productId: string) => Promise<Message>;
  formatProductDescription: (description: string) => Promise<string>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [messageThreads, setMessageThreads] = useState<MessageThread[]>(MOCK_MESSAGE_THREADS);
  const { user } = useAuth();
  const { toast } = useToast();

  const getProduct = useCallback(
    (id: string) => products.find(product => product.id === id),
    [products]
  );

  // New function for AI-powered description formatting
  const formatProductDescription = async (description: string): Promise<string> => {
    try {
      // Check for external sale attempts
      if (checkDescription(description)) {
        toast({
          title: "Description Warning",
          description: "Your description contains contact information or seems to be arranging an off-platform sale, which isn't allowed.",
          variant: "destructive",
        });
        return description; // Return original if it contains external sale attempts
      }
      
      // Format the description using our utility
      const formatted = await formatDescription(description);
      return formatted;
    } catch (error) {
      console.error("Error formatting description:", error);
      return description; // Return original if formatting fails
    }
  };

  const createProduct = async (productData: Omit<Product, "id" | "createdAt" | "updatedAt" | "seller" | "sold" | "soldAt">) => {
    if (!user) throw new Error("You must be logged in to create a product");

    // Format the description with AI
    let enhancedProductData = { ...productData };
    if (productData.description) {
      enhancedProductData.description = await formatProductDescription(productData.description);
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const now = new Date().toISOString();
    const newProduct: Product = {
      ...enhancedProductData,
      id: String(Date.now()),
      seller: user,
      createdAt: now,
      updatedAt: now,
      sold: false,
    };

    setProducts(prevProducts => [...prevProducts, newProduct]);
    
    // Send email notification (simulated)
    console.log(`Sending email to ${user.email} about new listing creation`);
    
    return newProduct;
  };
  
  // New function to update a product
  const updateProduct = async (
    id: string, 
    productData: Partial<Omit<Product, "id" | "createdAt" | "updatedAt" | "seller" | "sold" | "soldAt">>
  ) => {
    if (!user) throw new Error("You must be logged in to update a product");
    
    const existingProduct = getProduct(id);
    if (!existingProduct) throw new Error("Product not found");
    
    // Check if the current user is the owner
    if (existingProduct.seller.id !== user.id) {
      throw new Error("You don't have permission to update this product");
    }
    
    // Format the description with AI if it's being updated
    let enhancedProductData = { ...productData };
    if (productData.description) {
      enhancedProductData.description = await formatProductDescription(productData.description);
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const now = new Date().toISOString();
    const updatedProduct: Product = {
      ...existingProduct,
      ...enhancedProductData,
      updatedAt: now,
    };
    
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product.id === id ? updatedProduct : product
      )
    );
    
    // Send email notification (simulated)
    console.log(`Sending email to ${user.email} about listing update`);
    
    return updatedProduct;
  };
  
  // New function to delete a product
  const deleteProduct = async (id: string) => {
    if (!user) throw new Error("You must be logged in to delete a product");
    
    const existingProduct = getProduct(id);
    if (!existingProduct) throw new Error("Product not found");
    
    // Check if the current user is the owner
    if (existingProduct.seller.id !== user.id) {
      throw new Error("You don't have permission to delete this product");
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setProducts(prevProducts => 
      prevProducts.filter(product => product.id !== id)
    );
  };
  
  // New function to mark a product as purchased
  const confirmPurchase = async (productId: string, buyerId: string) => {
    const product = getProduct(productId);
    if (!product) throw new Error("Product not found");
    
    // Simulate API call for payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const now = new Date().toISOString();
    
    // Update the product as sold
    setProducts(prevProducts =>
      prevProducts.map(p => 
        p.id === productId 
          ? { 
              ...p, 
              sold: true, 
              soldAt: now,
              buyer: { id: buyerId }
            } 
          : p
      )
    );
    
    // Send email notifications (simulated)
    console.log(`Sending purchase confirmation email to buyer ID ${buyerId}`);
    console.log(`Sending seller notification email to ${product.seller.email}`);
    
    // Calculate platform fee (5%)
    const platformFee = product.price * 0.05;
    const sellerAmount = product.price - platformFee;
    
    console.log(`Processing payment: ${sellerAmount} to seller, ${platformFee} platform fee`);
  };

  const getMessages = useCallback(
    (threadId: string) => {
      const thread = messageThreads.find(t => t.id === threadId);
      if (!thread) return [];
      
      return messages.filter(
        message => 
          (message.senderId === thread.participants[0] && message.receiverId === thread.participants[1]) ||
          (message.senderId === thread.participants[1] && message.receiverId === thread.participants[0])
      ).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    },
    [messages, messageThreads]
  );

  const sendMessage = async (content: string, receiverId: string, productId: string) => {
    if (!user) throw new Error("You must be logged in to send a message");

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    const now = new Date().toISOString();
    const newMessage: Message = {
      id: String(messages.length + 1),
      content,
      senderId: user.id,
      receiverId,
      productId,
      createdAt: now,
      read: false,
    };

    setMessages(prevMessages => [...prevMessages, newMessage]);

    // Check if thread exists
    const existingThreadIndex = messageThreads.findIndex(
      t => t.productId === productId && 
           ((t.participants[0] === user.id && t.participants[1] === receiverId) ||
            (t.participants[0] === receiverId && t.participants[1] === user.id))
    );

    if (existingThreadIndex >= 0) {
      // Update existing thread
      setMessageThreads(prevThreads => {
        const updatedThreads = [...prevThreads];
        updatedThreads[existingThreadIndex] = {
          ...updatedThreads[existingThreadIndex],
          lastMessage: newMessage,
          unreadCount: user.id === receiverId ? updatedThreads[existingThreadIndex].unreadCount : updatedThreads[existingThreadIndex].unreadCount + 1,
        };
        return updatedThreads;
      });
    } else {
      // Create new thread
      const product = products.find(p => p.id === productId);
      if (!product) throw new Error("Product not found");

      const newThread: MessageThread = {
        id: String(messageThreads.length + 1),
        participants: [user.id, receiverId] as [string, string],
        productId,
        product,
        lastMessage: newMessage,
        unreadCount: 0,
      };

      setMessageThreads(prevThreads => [...prevThreads, newThread]);
    }

    return newMessage;
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        getProduct,
        createProduct,
        updateProduct,
        deleteProduct,
        confirmPurchase,
        messages,
        messageThreads,
        getMessages,
        sendMessage,
        formatProductDescription,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};
