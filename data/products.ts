export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  specs: string[];
  rating: number;
  reviews: number;
  badge?: "New" | "Deal" | "Best Seller";
  image: string;
};

export const products: Product[] = [
  {
    id: "p1",
    name: "Nova X13 Smartphone, 256GB",
    category: "Phones",
    price: 42999,
    oldPrice: 54999,
    specs: ["256GB", "5G", "108MP"],
    rating: 4.6,
    reviews: 812,
    badge: "Deal",
    image:
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "p2",
    name: "AeroBook 14 Laptop, i5 / 16GB",
    category: "Laptops",
    price: 78999,
    oldPrice: 92999,
    specs: ["16GB RAM", "512GB SSD", "14in"],
    rating: 4.8,
    reviews: 356,
    badge: "Best Seller",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "p3",
    name: "PulseFit Watch Series 3",
    category: "Wearables",
    price: 8499,
    oldPrice: 12999,
    specs: ["GPS", "7-day battery", "AMOLED"],
    rating: 4.4,
    reviews: 604,
    badge: "Deal",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "p4",
    name: "EchoWave Wireless Earbuds",
    category: "Audio",
    price: 3999,
    oldPrice: 5999,
    specs: ["ANC", "30hr case", "IPX5"],
    rating: 4.5,
    reviews: 1204,
    badge: "New",
    image:
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "p5",
    name: "OrbitCam 4K Action Camera",
    category: "Cameras",
    price: 15999,
    specs: ["4K/60fps", "Waterproof", "Stabilized"],
    rating: 4.3,
    reviews: 219,
    image:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "p6",
    name: "GlideBar Bluetooth Soundbar",
    category: "Audio",
    price: 6499,
    oldPrice: 8999,
    specs: ["2.1ch", "Bluetooth 5.2", "HDMI ARC"],
    rating: 4.2,
    reviews: 143,
    badge: "Deal",
    image:
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=600&auto=format&fit=crop",
  },
];

export const categories = [
  { name: "Phones", icon: "smartphone" },
  { name: "Laptops", icon: "laptop" },
  { name: "Audio", icon: "headphones" },
  { name: "Wearables", icon: "watch" },
  { name: "Cameras", icon: "camera" },
  { name: "Gaming", icon: "gamepad-2" },
  { name: "Smart Home", icon: "house" },
  { name: "Accessories", icon: "cable" },
] as const;
