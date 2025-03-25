
/**
 * A utility for formatting product descriptions using AI assistance
 * 
 * In a production environment, this would call an AI API
 * such as OpenAI, Perplexity, or a similar service
 */

/**
 * Format a product description using AI assistance
 * This is a mock implementation that would be replaced with an actual AI API call
 */
export const formatDescription = async (description: string): Promise<string> => {
  // In a real implementation, we would call an AI API here
  // For now, we'll just do some basic formatting
  
  if (!description) return "";
  
  try {
    // Split into paragraphs
    let paragraphs = description.split(/\n+/);
    
    // Process each paragraph
    paragraphs = paragraphs.map(p => {
      // Capitalize first letter of each sentence
      const sentences = p.split(/(?<=[.!?])\s+/);
      const formattedSentences = sentences.map(s => {
        if (s.trim().length === 0) return s;
        return s.charAt(0).toUpperCase() + s.slice(1);
      });
      
      return formattedSentences.join(' ').trim();
    }).filter(p => p.length > 0);
    
    // Add bullet points for lists if they exist
    paragraphs = paragraphs.map(p => {
      if (p.includes(',') && p.split(',').length >= 3 && p.length < 100) {
        // Likely a list
        const items = p.split(',').map(item => item.trim());
        return items.map(item => `• ${item}`).join('\n');
      }
      return p;
    });
    
    // Remove redundant space
    const formatted = paragraphs.join('\n\n').replace(/\s{2,}/g, ' ');
    
    // Correct common spelling errors
    const corrected = formatted
      .replace(/\bi\b/g, 'I')
      .replace(/\bim\b/g, "I'm")
      .replace(/\bdont\b/g, "don't")
      .replace(/\bwont\b/g, "won't");
    
    // In a real implementation, the AI would do much more sophisticated formatting
    
    return corrected;
  } catch (error) {
    console.error("Error formatting description:", error);
    return description; // Return original if formatting fails
  }
};

/**
 * Check if a description contains contact information or external sale attempts
 * Returns true if suspicious content is found
 */
export const containsExternalSaleAttempt = (description: string): boolean => {
  if (!description) return false;
  
  const lowercaseDesc = description.toLowerCase();
  
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
    if (pattern.test(lowercaseDesc)) {
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
    if (pattern.test(lowercaseDesc)) {
      return true;
    }
  }
  
  return false;
};
