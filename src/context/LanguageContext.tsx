
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Translation texts
const translations = {
  en: {
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
    
    // Platform fees
    platformFee: "Platform Fee (5%)",
    total: "Total",
    transactionNote: "Note: All transactions must be completed on Bar Ilan campus",
    payOnPlatform: "Pay securely through our platform",
    
    // Categories
    books: "Books",
    electronics: "Electronics",
    furniture: "Furniture",
    clothing: "Clothing",
    other: "Other",
  },
  he: {
    // General
    language: "החלף שפה",
    marketplace: "שוק",
    barIlanMarketplace: "שוק בר אילן",
    browse: "עיון",
    sell: "מכירה",
    profile: "פרופיל",
    signIn: "התחברות",
    signOut: "התנתקות",
    messages: "הודעות",
    search: "חיפוש",
    
    // Home page
    welcome: "ברוכים הבאים לשוק אוניברסיטת בר אילן",
    welcomeSubtitle: "קנה ומכור פריטים בלעדית לסטודנטים של בר אילן",
    featuredListings: "מוצרים מומלצים",
    recentlyAdded: "נוספו לאחרונה",
    viewAll: "צפה בהכל",
    campusOnly: "כל העסקאות חייבות להתבצע בקמפוס",
    
    // Product listings
    condition: "מצב",
    price: "מחיר",
    location: "מיקום",
    postedBy: "פורסם על ידי",
    contactSeller: "צור קשר עם המוכר",
    viewDetails: "לפרטים נוספים",
    
    // Product creation
    createListing: "יצירת מודעה",
    listingDetails: "פרטי המודעה",
    title: "כותרת",
    description: "תיאור",
    category: "קטגוריה",
    uploadImages: "העלאת תמונות",
    submit: "שליחה",
    
    // Messaging
    send: "שלח",
    typeMessage: "הקלד את ההודעה שלך...",
    
    // Platform fees
    platformFee: "עמלת פלטפורמה (5%)",
    total: "סך הכל",
    transactionNote: "הערה: כל העסקאות חייבות להתבצע בקמפוס בר אילן",
    payOnPlatform: "שלם בבטחה דרך הפלטפורמה שלנו",
    
    // Categories
    books: "ספרים",
    electronics: "אלקטרוניקה",
    furniture: "ריהוט",
    clothing: "ביגוד",
    other: "אחר",
  }
};

type LanguageKey = keyof typeof translations;
type TranslationKeys = keyof typeof translations.en;

interface LanguageContextType {
  language: LanguageKey;
  setLanguage: (lang: LanguageKey) => void;
  t: (key: TranslationKeys) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<LanguageKey>(() => {
    const savedLanguage = localStorage.getItem("language") as LanguageKey;
    return savedLanguage || "en";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
    
    // Set direction for RTL language
    document.documentElement.dir = language === "he" ? "rtl" : "ltr";
    
    // Add language class to the html element
    document.documentElement.lang = language;
    
    // Add appropriate class for RTL styling
    if (language === "he") {
      document.documentElement.classList.add("rtl");
    } else {
      document.documentElement.classList.remove("rtl");
    }
  }, [language]);

  const t = (key: TranslationKeys): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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
