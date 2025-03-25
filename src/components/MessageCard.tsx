
import { formatDistanceToNow } from "date-fns";
import { MessageThread } from "../utils/types";
import { useAuth } from "../context/AuthContext";
import { cn } from "@/lib/utils";
import { MOCK_USERS } from "../utils/types";

interface MessageCardProps {
  thread: MessageThread;
  onClick: () => void;
  isActive?: boolean;
}

export const MessageCard = ({ thread, onClick, isActive = false }: MessageCardProps) => {
  const { user } = useAuth();
  
  // If user is not defined, return null
  if (!user) return null;
  
  // Determine the other participant
  const otherParticipantId = thread.participants.find(id => id !== user.id);
  const otherUser = MOCK_USERS.find(u => u.id === otherParticipantId);
  
  // If we can't find the other user, return null
  if (!otherUser) return null;
  
  // Calculate time ago
  const timeAgo = formatDistanceToNow(new Date(thread.lastMessage.createdAt), { addSuffix: true });
  
  // Determine if the last message was from the current user
  const isFromCurrentUser = thread.lastMessage.senderId === user.id;

  return (
    <div 
      className={cn(
        "p-4 border-b cursor-pointer transition-colors",
        isActive 
          ? "bg-primary/5 border-primary" 
          : "hover:bg-gray-50 border-gray-100",
        thread.unreadCount > 0 && !isFromCurrentUser && "bg-blue-50/50"
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        {/* User Avatar */}
        <div className="flex-shrink-0">
          {otherUser.avatar ? (
            <img 
              src={otherUser.avatar} 
              alt={otherUser.name}
              className="w-10 h-10 rounded-full object-cover" 
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-medium">
                {otherUser.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        
        {/* Message Content */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-baseline mb-1">
            <h4 className="font-medium text-foreground truncate">
              {otherUser.name}
            </h4>
            <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
              {timeAgo}
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground truncate">
            {isFromCurrentUser && "You: "}
            {thread.lastMessage.content}
          </p>
          
          <div className="mt-1 text-xs text-muted-foreground truncate">
            Re: {thread.product.title}
          </div>
        </div>
      </div>
      
      {/* Unread Count Badge */}
      {thread.unreadCount > 0 && !isFromCurrentUser && (
        <div className="mt-2 flex justify-end">
          <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary rounded-full">
            {thread.unreadCount}
          </span>
        </div>
      )}
    </div>
  );
};
