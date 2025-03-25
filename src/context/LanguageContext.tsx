import React, { createContext, useContext, ReactNode } from "react";

// Translation texts (keeping only English)
const translations = {
  // General
  language: "Toggle language",
  marketplace: "Marketplace",
  barIlanMarketplace: "Bar Ilan Marketplace",
  browse: "Browse",
  sell: "Sell",
  profile: "Profile",
  signIn: "Sign In",
  signOut: "Sign Out",
  messages: "Messages",
  search: "Search",
  
  // Home page
  welcome: "Welcome to Bar Ilan University Marketplace",
  welcomeSubtitle: "Buy and sell items exclusively for Bar Ilan students",
  featuredListings: "Featured Listings",
  recentlyAdded: "Recently Added",
  viewAll: "View All",
  campusOnly: "All transactions must be completed on campus",
  
  // Product listings
  condition: "Condition",
  price: "Price",
  location: "Location",
  postedBy: "Posted by",
  contactSeller: "Contact Seller",
  viewDetails: "View Details",
  
  // Product creation
  createListing: "Create Listing",
  listingDetails: "Listing Details",
  title: "Title",
  description: "Description",
  category: "Category",
  uploadImages: "Upload Images",
  submit: "Submit",
  
  // Messaging
  send: "Send",
  typeMessage: "Type your message...",
  
  // Platform fees and payments
  platformFee: "Platform Fee (5%)",
  total: "Total",
  transactionNote: "Note: All transactions must be completed on Bar Ilan campus",
  payOnPlatform: "Pay securely through our platform",
  paymentProcessingMessage: "Payment processing... In a real implementation, this would redirect to a payment gateway.",
  processingPayment: "Processing payment...",
  paymentSuccess: "Payment successful!",
  paymentFailed: "Payment failed. Please try again.",
  proceedToPayment: "Proceed to Payment",
  securePayment: "Secure Payment",
  paymentDetails: "Payment Details",
  cardInformation: "Card Information",
  expiryDate: "Expiry Date",
  cvv: "CVV",
  nameOnCard: "Name on Card",
  
  // Categories
  books: "Books",
  electronics: "Electronics",
  furniture: "Furniture",
  clothing: "Clothing",
  other: "Other",
  
  // Bar-Mart specific content
  forBarIlanStudents: "For Bar Ilan students only",
  barMartTagline: "Save Money, Support Sustainability",
  barMartDescription: "Buy and sell pre-owned items exclusively within the Bar Ilan community. Save money while reducing waste.",
  searchPlaceholder: "Search for items...",
  whyBarMart: "Why Bar-Mart?",
  barMartValueProp: "Bar-Mart helps students save money and reduce waste by creating a closed marketplace for the campus community.",
  saveMoneyTitle: "Save Money",
  saveMoneyDesc: "Get quality items at a fraction of retail prices from fellow students.",
  sustainableTitle: "Eco-Friendly",
  sustainableDesc: "Extend the life of products and reduce waste by buying and selling used items.",
  communityTitle: "Campus Community",
  communityDesc: "Trade exclusively with verified Bar Ilan students in a safe environment.",
  browseCategories: "Browse Categories",
  exploreCategoriesDesc: "Find exactly what you need across our diverse selection of categories.",
  featuredItems: "Featured Items",
  discoverLatestListings: "Discover the latest listings from fellow students",
  howItWorks: "How It Works",
  simpleSteps: "Bar-Mart makes buying and selling simple with these easy steps",
  createListingDesc: "Take photos and list your items in minutes. Add details to help it sell faster.",
  connectBuyers: "Connect with Buyers",
  connectBuyersDesc: "Respond to messages from interested buyers through our secure platform.",
  completeSale: "Complete the Sale",
  completeSaleDesc: "Arrange payment through our platform and meet on campus for item handover.",
  startSelling: "Start Selling Today",
  footerTagline: "Bar-Mart - The marketplace for Bar Ilan students",
  allRightsReserved: "© 2023 Bar-Mart. All rights reserved.",
  
  // New translation keys for CreateListing
  maximumImagesReached: "Maximum Images Reached",
  maximumImagesReachedDesc: "You can upload a maximum of 5 images per listing.",
  titleRequired: "Title is required",
  descriptionRequired: "Description is required",
  priceRequired: "Price is required",
  pricePositive: "Price must be a positive number",
  categoryRequired: "Category is required",
  subcategoryRequired: "Subcategory is required",
  locationRequired: "Location is required",
  imageRequired: "At least one image is required",
  originalPricePositive: "Original price must be a positive number",
  authRequired: "Authentication Required",
  pleaseSignIn: "Please sign in to create a listing",
  listingCreated: "Listing Created",
  listingCreatedDesc: "Your listing has been successfully created",
  listingFailed: "Listing Failed",
  tryAgainLater: "Something went wrong. Please try again later.",
  listingDetailedInfo: "Fill out the details below to create your listing",
  listingTips: "Tips for a great listing",
  listingTip1: "Use clear, well-lit photos",
  listingTip2: "Be honest about the condition",
  listingTip3: "Set a competitive price",
  listingTip4: "Provide detailed description",
  titlePlaceholder: "Enter a descriptive title",
  originalPrice: "Original Price",
  optional: "Optional",
  priceNegotiable: "Price is negotiable",
  openToTrades: "Open to trades",
  images: "Images",
  maxImages: "Max 5 images",
  addImage: "Add Image",
  selectCategory: "Select a category",
  subcategory: "Subcategory",
  selectSubcategory: "Select a subcategory",
  brand: "Brand",
  brandPlaceholder: "Enter brand name",
  color: "Color",
  colorPlaceholder: "Enter color",
  size: "Size",
  sizePlaceholder: "Enter size",
  locationPlaceholder: "Where on campus can buyers pick up?",
  tags: "Tags",
  maxTags: "Max 5 tags",
  tagsPlaceholder: "Add keywords to help buyers find your item",
  add: "Add",
  descriptionPlaceholder: "Describe your item in detail (condition, features, etc.)",
  platformFeeInfo: "Platform Fee Information",
  platformFeeExplanation: "Bar-Mart charges a 5% fee on all transactions. This fee will be added to the buyer's total.",
  yourListingPrice: "Your listing price",
  buyerWillPay: "Buyer will pay",
  creatingListing: "Creating listing..."
};

type TranslationKeys = keyof typeof translations;

interface LanguageContextType {
  t: (key: TranslationKeys) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const t = (key: TranslationKeys): string => {
    return translations[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
