export const sidebarCategories = [
  { name: "Official Stores", icon: "store" },
  { name: "Phones & Tablets", icon: "smartphone" },
  { name: "Laptops & Computing", icon: "laptop" },
  { name: "Audio & Headphones", icon: "headphones" },
  { name: "Wearables", icon: "watch" },
  { name: "Cameras", icon: "camera" },
  { name: "Gaming", icon: "gamepad-2" },
  { name: "Smart Home", icon: "house" },
  { name: "Accessories & Cables", icon: "cable" },
  { name: "Clearance Sale", icon: "tag" },
] as const;

export type CircleShortcut =
  | {
      type: "photo";
      label: string;
      image: string;
    }
  | {
      type: "promo";
      label: string;
      sublabel: string;
      icon: string;
      accent: "orange" | "mint" | "amber";
    };

export const circleShortcuts: CircleShortcut[] = [
  {
    type: "promo",
    label: "Best Deals",
    sublabel: "Top prices",
    icon: "badge-percent",
    accent: "orange",
  },
  {
    type: "photo",
    label: "Phone Deals",
    image:
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=200&auto=format&fit=crop",
  },
  {
    type: "photo",
    label: "Laptops",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=200&auto=format&fit=crop",
  },
  {
    type: "photo",
    label: "Audio Gear",
    image:
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=200&auto=format&fit=crop",
  },
  {
    type: "photo",
    label: "Wearables",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200&auto=format&fit=crop",
  },
  {
    type: "promo",
    label: "Extra Off",
    sublabel: "At checkout",
    icon: "sparkles",
    accent: "mint",
  },
  {
    type: "promo",
    label: "Flash Sale",
    sublabel: "Limited time",
    icon: "zap",
    accent: "orange",
  },
  {
    type: "photo",
    label: "Cameras",
    image:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=200&auto=format&fit=crop",
  },
  {
    type: "photo",
    label: "Smart Home",
    image:
      "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=200&auto=format&fit=crop",
  },
  {
    type: "photo",
    label: "Gaming",
    image:
      "https://images.unsplash.com/photo-1592840496694-26d035b52b48?q=80&w=200&auto=format&fit=crop",
  },
  {
    type: "photo",
    label: "Accessories",
    image:
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=200&auto=format&fit=crop",
  },
  {
    type: "promo",
    label: "Clearance",
    sublabel: "While stocks last",
    icon: "tag",
    accent: "amber",
  },
];
