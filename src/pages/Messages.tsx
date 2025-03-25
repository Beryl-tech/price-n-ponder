
import { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { useProducts } from "../context/ProductContext";
import { useAuth } from "../context/AuthContext";
import { MessageCard } from "../components/MessageCard";
import { MessageThread } from "../components/MessageThread";
import { useNavigate } from "react-router-dom";
import { MessageSquare } from "lucide-react";

const Messages = () => {
  const { messageThreads } = useProducts();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [activeThread, setActiveThread] = useState<any | null>(null);
  
  // Filter threads for the current user
  const userThreads = messageThreads.filter(thread => 
    user && thread.participants.includes(user.id)
  );
  
  // Set first thread as active by default if available
  useEffect(() => {
    if (userThreads.length > 0 && !activeThreadId) {
      setActiveThreadId(userThreads[0].id);
    }
  }, [userThreads, activeThreadId]);
  
  // Update active thread when activeThreadId changes
  useEffect(() => {
    if (activeThreadId) {
      const thread = userThreads.find(t => t.id === activeThreadId);
      setActiveThread(thread || null);
    }
  }, [activeThreadId, userThreads]);
  
  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }
  
  // If no user, return null (this is a safeguard)
  if (!user) return null;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container py-24 px-0 md:px-6">
        <div className="flex flex-col md:flex-row h-[70vh] border rounded-lg overflow-hidden bg-white">
          {/* Thread List */}
          <div className="w-full md:w-80 border-r flex flex-col h-full">
            <div className="p-4 border-b bg-gray-50">
              <h1 className="text-xl font-bold">Messages</h1>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {userThreads.length > 0 ? (
                userThreads.map(thread => (
                  <MessageCard
                    key={thread.id}
                    thread={thread}
                    onClick={() => setActiveThreadId(thread.id)}
                    isActive={activeThreadId === thread.id}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <MessageSquare className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No messages yet</h3>
                  <p className="text-muted-foreground text-sm">
                    Start a conversation by messaging a seller about an item you're interested in.
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Message Thread Content */}
          <div className="flex-1 flex">
            {activeThread ? (
              <MessageThread
                threadId={activeThread.id}
                productId={activeThread.productId}
                receiverId={activeThread.participants.find((id: string) => id !== user.id)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center w-full text-center p-6">
                <MessageSquare className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                <p className="text-muted-foreground text-sm">
                  Choose a conversation from the list to start messaging.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Messages;
