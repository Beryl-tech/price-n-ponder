
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  condition: "new" | "like-new" | "good" | "fair" | "poor";
  category: string;
  location: string;
  seller: User;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  productId: string;
  createdAt: string;
  read: boolean;
}

export interface MessageThread {
  id: string;
  participants: [string, string];
  productId: string;
  product: Product;
  lastMessage: Message;
  unreadCount: number;
}

// Mock data for development
export const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex@example.com",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    createdAt: new Date(2023, 0, 15).toISOString(),
  },
  {
    id: "2",
    name: "Sarah Miller",
    email: "sarah@example.com",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    createdAt: new Date(2023, 1, 20).toISOString(),
  },
  {
    id: "3",
    name: "Mike Davis",
    email: "mike@example.com",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    createdAt: new Date(2023, 2, 5).toISOString(),
  },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    title: "Vintage Leather Jacket",
    description: "Genuine leather jacket in excellent condition. Worn only a few times.",
    price: 120,
    images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1375&q=80"],
    condition: "like-new",
    category: "Clothing",
    location: "San Francisco, CA",
    seller: MOCK_USERS[0],
    createdAt: new Date(2023, 3, 10).toISOString(),
    updatedAt: new Date(2023, 3, 10).toISOString(),
  },
  {
    id: "2",
    title: "MacBook Pro 2022",
    description: "16-inch MacBook Pro with M1 Pro chip, 16GB RAM, 512GB SSD. Includes charger and original box.",
    price: 1800,
    images: ["https://images.unsplash.com/photo-1569770218135-bea267ed7e84?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80"],
    condition: "good",
    category: "Electronics",
    location: "New York, NY",
    seller: MOCK_USERS[1],
    createdAt: new Date(2023, 4, 5).toISOString(),
    updatedAt: new Date(2023, 4, 6).toISOString(),
  },
  {
    id: "3",
    title: "Mountain Bike",
    description: "Trek mountain bike in great condition. Recently serviced with new brakes and tires.",
    price: 450,
    images: ["https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"],
    condition: "good",
    category: "Sports",
    location: "Denver, CO",
    seller: MOCK_USERS[2],
    createdAt: new Date(2023, 5, 15).toISOString(),
    updatedAt: new Date(2023, 5, 15).toISOString(),
  },
  {
    id: "4",
    title: "Modern Coffee Table",
    description: "Scandinavian design coffee table made from solid oak. Minimal wear.",
    price: 250,
    images: ["https://images.unsplash.com/photo-1532372576444-dda954194ad0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80"],
    condition: "like-new",
    category: "Furniture",
    location: "Austin, TX",
    seller: MOCK_USERS[0],
    createdAt: new Date(2023, 6, 1).toISOString(),
    updatedAt: new Date(2023, 6, 1).toISOString(),
  },
  {
    id: "5",
    title: "Canon EOS R5 Camera",
    description: "Professional mirrorless camera with 45MP sensor. Includes 24-70mm lens and extra battery.",
    price: 3200,
    images: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1164&q=80"],
    condition: "like-new",
    category: "Electronics",
    location: "Chicago, IL",
    seller: MOCK_USERS[1],
    createdAt: new Date(2023, 7, 12).toISOString(),
    updatedAt: new Date(2023, 7, 12).toISOString(),
  },
  {
    id: "6",
    title: "Vintage Vinyl Records Collection",
    description: "Collection of 50+ classic rock and jazz vinyl records from the 60s and 70s. All in great playing condition.",
    price: 300,
    images: ["https://images.unsplash.com/photo-1603048588665-791ca8aea617?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80"],
    condition: "good",
    category: "Music",
    location: "Portland, OR",
    seller: MOCK_USERS[2],
    createdAt: new Date(2023, 8, 8).toISOString(),
    updatedAt: new Date(2023, 8, 8).toISOString(),
  },
];

export const MOCK_MESSAGES: Message[] = [
  {
    id: "1",
    content: "Hi, is this item still available?",
    senderId: "2",
    receiverId: "1",
    productId: "1",
    createdAt: new Date(2023, 8, 10, 10, 30).toISOString(),
    read: true,
  },
  {
    id: "2",
    content: "Yes, it's still available! Are you interested?",
    senderId: "1",
    receiverId: "2",
    productId: "1",
    createdAt: new Date(2023, 8, 10, 11, 0).toISOString(),
    read: true,
  },
  {
    id: "3",
    content: "Great! Would you be willing to meet tomorrow to take a look at it?",
    senderId: "2",
    receiverId: "1",
    productId: "1",
    createdAt: new Date(2023, 8, 10, 11, 15).toISOString(),
    read: false,
  },
  {
    id: "4",
    content: "I'm interested in your MacBook. Is the price negotiable?",
    senderId: "3",
    receiverId: "2",
    productId: "2",
    createdAt: new Date(2023, 8, 9, 14, 0).toISOString(),
    read: true,
  },
  {
    id: "5",
    content: "Hello! I could come down a bit on the price. What were you thinking?",
    senderId: "2",
    receiverId: "3",
    productId: "2",
    createdAt: new Date(2023, 8, 9, 15, 30).toISOString(),
    read: true,
  },
];

export const MOCK_MESSAGE_THREADS: MessageThread[] = [
  {
    id: "1",
    participants: ["1", "2"],
    productId: "1",
    product: MOCK_PRODUCTS[0],
    lastMessage: MOCK_MESSAGES[2],
    unreadCount: 1,
  },
  {
    id: "2",
    participants: ["2", "3"],
    productId: "2",
    product: MOCK_PRODUCTS[1],
    lastMessage: MOCK_MESSAGES[4],
    unreadCount: 0,
  },
];
