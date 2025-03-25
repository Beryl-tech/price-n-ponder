
/**
 * Utility for message moderation to prevent off-platform sales
 */

/**
 * Check if a message contains attempts to take the transaction off-platform
 * Returns true if suspicious content is found
 */
export const containsExternalSaleAttempt = (message: string): boolean => {
  if (!message) return false;
  
  const lowercaseMsg = message.toLowerCase();
  
  // Check for contact information
  const contactPatterns = [
    /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/, // Phone numbers
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/, // Email addresses
    /\b(telegram|whatsapp|signal|facebook|instagram|snap|snapchat)\b/, // Social media platforms
    /\bmeet( me)? (outside|elsewhere)\b/,
    /\bcontact( me)?\b/,
    /\bcall( me)?\b/,
    /\btext( me)?\b/,
    /\bmessage( me)?\b/,
    /\bdm( me)?\b/,
    /\bdirect message\b/,
  ];
  
  for (const pattern of contactPatterns) {
    if (pattern.test(lowercaseMsg)) {
      return true;
    }
  }
  
  // Check for direct sale language
  const salePatterns = [
    /\bpay( me)? (cash|directly|venmo|paypal|outside)\b/,
    /\bmeet( me)? (outside|elsewhere)\b/,
    /\bavoid( the)? fee\b/,
    /\boff(-| )platform\b/,
    /\boff(-| )site\b/,
    /\bnot( through)? (this|the) (site|platform|website)\b/,
  ];
  
  for (const pattern of salePatterns) {
    if (pattern.test(lowercaseMsg)) {
      return true;
    }
  }
  
  return false;
};

/**
 * Generate a warning message for when a user attempts to take a sale off-platform
 */
export const generateWarningMessage = (): string => {
  const warnings = [
    "For your safety, all transactions must happen on the platform. This message has been flagged.",
    "To protect all users, we don't allow sharing contact information or arranging off-platform sales.",
    "Your message has been flagged as it appears to be attempting to arrange an off-platform transaction.",
    "Bar-Mart requires all payments to be processed through our secure system. This message has been reported."
  ];
  
  return warnings[Math.floor(Math.random() * warnings.length)];
};

/**
 * Check if a product has been purchased by the user
 * In a real implementation, this would check transaction history
 */
export const isProductPurchased = (productId: string, userId: string): boolean => {
  // This is a mock implementation
  // In production, this would check the transaction database
  return false;
};

/**
 * Format a pickup message to be sent after a successful purchase
 */
export const formatPickupMessage = (sellerName: string, location: string): string => {
  return `Now that you've completed your purchase, you can arrange pickup with ${sellerName}. The item is available at: ${location}. Please coordinate a convenient time through this chat.`;
};
