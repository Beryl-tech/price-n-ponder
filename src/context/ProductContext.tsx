
import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { Product, MOCK_PRODUCTS, Message, MOCK_MESSAGES, MessageThread, MOCK_MESSAGE_THREADS } from "../utils/types";
import { useAuth } from "./AuthContext";

interface ProductContextType {
  products: Product[];
  getProduct: (id: string) => Product | undefined;
  createProduct: (product: Omit<Product, "id" | "createdAt" | "updatedAt" | "seller">) => Promise<Product>;
  messages: Message[];
  messageThreads: MessageThread[];
  getMessages: (threadId: string) => Message[];
  sendMessage: (content: string, receiverId: string, productId: string) => Promise<Message>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [messageThreads, setMessageThreads] = useState<MessageThread[]>(MOCK_MESSAGE_THREADS);
  const { user } = useAuth();

  const getProduct = useCallback(
    (id: string) => products.find(product => product.id === id),
    [products]
  );

  const createProduct = async (productData: Omit<Product, "id" | "createdAt" | "updatedAt" | "seller">) => {
    if (!user) throw new Error("You must be logged in to create a product");

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const now = new Date().toISOString();
    const newProduct: Product = {
      ...productData,
      id: String(products.length + 1),
      seller: user,
      createdAt: now,
      updatedAt: now,
    };

    setProducts(prevProducts => [...prevProducts, newProduct]);
    return newProduct;
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
        messages,
        messageThreads,
        getMessages,
        sendMessage,
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
