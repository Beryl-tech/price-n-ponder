
import { Message, User, MessageThread } from "../utils/types";

interface MessageAlert {
  message: Message;
  reason: string;
  severity: 'low' | 'medium' | 'high';
  thread: MessageThread;
  timestamp: string;
}

// In-memory storage for flagged messages
// In a real implementation, this would be stored in a database
let flaggedMessages: MessageAlert[] = [];

/**
 * Flag a message for admin review
 */
export const flagMessageForReview = (
  message: Message, 
  thread: MessageThread,
  reason: string, 
  severity: 'low' | 'medium' | 'high' = 'medium'
): void => {
  const alert: MessageAlert = {
    message,
    reason,
    severity,
    thread,
    timestamp: new Date().toISOString(),
  };
  
  flaggedMessages.push(alert);
  
  // In a real implementation, this would also notify admins
  console.log(`Message flagged for review: ${reason}`, alert);
};

/**
 * Get all flagged messages for admin review
 */
export const getFlaggedMessages = (): MessageAlert[] => {
  return [...flaggedMessages];
};

/**
 * Clear a flagged message after review
 */
export const clearFlaggedMessage = (messageId: string): void => {
  flaggedMessages = flaggedMessages.filter(alert => alert.message.id !== messageId);
};

/**
 * Check if a conversation requires admin attention
 */
export const needsAdminAttention = (thread: MessageThread): boolean => {
  return flaggedMessages.some(alert => alert.thread.id === thread.id);
};

/**
 * In a real implementation, this would be part of an admin dashboard
 * to monitor and moderate all conversations
 */
export const getMessageAnalytics = () => {
  return {
    totalFlagged: flaggedMessages.length,
    highSeverity: flaggedMessages.filter(m => m.severity === 'high').length,
    mediumSeverity: flaggedMessages.filter(m => m.severity === 'medium').length,
    lowSeverity: flaggedMessages.filter(m => m.severity === 'low').length,
  };
};
