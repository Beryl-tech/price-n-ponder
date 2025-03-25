
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useProducts } from "../context/ProductContext";
import { Message as MessageType, MOCK_USERS } from "../utils/types";
import { format } from "date-fns";
import { Send, AlertTriangle, Shield, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { containsExternalSaleAttempt, generateWarningMessage } from "../utils/messageModeration";
import { useToast } from "@/hooks/use-toast";

interface MessageThreadProps {
  threadId: string;
  productId: string;
  receiverId: string;
}

export const MessageThread = ({ threadId, productId, receiverId }: MessageThreadProps) => {
  const { user } = useAuth();
  const { getMessages, sendMessage, getProduct } = useProducts();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const product = getProduct(productId);
  const receiver = MOCK_USERS.find(u => u.id === receiverId);
  
  // Load messages
  useEffect(() => {
    if (threadId) {
      setMessages(getMessages(threadId));
    }
  }, [threadId, getMessages]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !user || isLoading) return;
    
    // Check for external sale attempts
    if (containsExternalSaleAttempt(newMessage)) {
      toast({
        title: "Message Blocked",
        description: "Your message appears to be arranging an off-platform transaction, which isn't allowed for safety reasons.",
        variant: "destructive",
      });
      
      // Automatically send a warning message
      try {
        setIsLoading(true);
        const warningMessage = generateWarningMessage();
        await sendMessage(warningMessage, receiverId, productId);
        setMessages(getMessages(threadId));
        setNewMessage("");
      } catch (error) {
        console.error("Failed to send warning message:", error);
      } finally {
        setIsLoading(false);
      }
      return;
    }
    
    try {
      setIsLoading(true);
      await sendMessage(newMessage, receiverId, productId);
      setNewMessage("");
      setMessages(getMessages(threadId));
    } catch (error) {
      console.error("Failed to send message:", error);
      toast({
        title: "Message Failed",
        description: "Your message couldn't be sent. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Group messages by date
  const groupedMessages: { [date: string]: MessageType[] } = {};
  messages.forEach(message => {
    const date = format(new Date(message.createdAt), "MMMM d, yyyy");
    if (!groupedMessages[date]) {
      groupedMessages[date] = [];
    }
    groupedMessages[date].push(message);
  });
  
  // Function to determine if a message is a system message
  const isSystemMessage = (message: MessageType) => {
    return message.content.includes("For your safety") || 
           message.content.includes("To protect all users") ||
           message.content.includes("Your message has been flagged") ||
           message.content.includes("Bar-Mart requires all payments");
  };
  
  // Determine if the product has been purchased
  const isPurchased = false; // This would come from a real purchase history
  
  if (!user || !product || !receiver) return null;
  
  return (
    <div className="flex flex-col h-full">
      {/* Thread Header */}
      <div className="p-4 border-b bg-white">
        <div className="flex items-center gap-3">
          {receiver.avatar ? (
            <img src={receiver.avatar} alt={receiver.name} className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-medium">
                {receiver.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <h3 className="font-medium">{receiver.name}</h3>
            <p className="text-xs text-muted-foreground">Re: {product.title}</p>
          </div>
        </div>
      </div>
      
      {/* Safety Notice */}
      <div className="bg-amber-50 p-3 border-b border-amber-100">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-amber-600" />
          <p className="text-xs text-amber-800">
            For your safety, all transactions must be completed on Bar-Mart. Payment information and arrangements to meet outside the platform are not permitted.
          </p>
        </div>
      </div>
      
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {Object.keys(groupedMessages).map(date => (
          <div key={date} className="space-y-3">
            <div className="flex justify-center">
              <span className="text-xs bg-gray-100 text-muted-foreground px-3 py-1 rounded-full">
                {date}
              </span>
            </div>
            
            {groupedMessages[date].map(message => {
              const isFromCurrentUser = message.senderId === user.id;
              const isSystem = isSystemMessage(message);
              
              return (
                <div 
                  key={message.id} 
                  className={cn(
                    "flex",
                    isSystem ? "justify-center" : isFromCurrentUser ? "justify-end" : "justify-start"
                  )}
                >
                  {isSystem ? (
                    <div className="bg-red-50 border border-red-100 text-red-800 px-4 py-2 rounded-lg max-w-[80%]">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="font-medium text-xs">System Message</span>
                      </div>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  ) : (
                    <div 
                      className={cn(
                        "max-w-[70%] rounded-lg px-4 py-2",
                        isFromCurrentUser 
                          ? "bg-primary text-white" 
                          : "bg-gray-100 text-foreground"
                      )}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {format(new Date(message.createdAt), "h:mm a")}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
        
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-10">
            <p className="text-muted-foreground">No messages yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Start the conversation by sending a message
            </p>
          </div>
        )}
        
        {/* Show purchase info if applicable */}
        {isPurchased && (
          <div className="bg-green-50 border border-green-100 text-green-800 p-4 rounded-lg mt-4">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4" />
              <span className="font-medium">Payment Completed</span>
            </div>
            <p className="text-sm">
              You can now arrange pickup details with the seller.
            </p>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message Input */}
      <form 
        onSubmit={handleSendMessage}
        className="p-4 border-t bg-white"
      >
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <Button 
            type="submit" 
            disabled={!newMessage.trim() || isLoading}
            className="h-10 w-10 p-0 flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};
