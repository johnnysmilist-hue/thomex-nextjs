export const sidebarCategories = [
  { name: "Official Stores", icon: "store", slug: null },
  { name: "Phones & Tablets", icon: "smartphone", slug: "phones" },
  { name: "Laptops & Computing", icon: "laptop", slug: "laptops" },
  { name: "Audio & Headphones", icon: "headphones", slug: "audio" },
  { name: "Wearables", icon: "watch", slug: "wearables" },
  { name: "Cameras", icon: "camera", slug: "cameras" },
  { name: "Gaming", icon: "gamepad-2", slug: "gaming" },
  { name: "Smart Home", icon: "house", slug: "smart-home" },
  { name: "Accessories & Cables", icon: "cable", slug: "accessories" },
  { name: "Clearance Sale", icon: "tag", slug: "clearance" },
] as const;

// Canonical category list used for /category/[slug] pages.
export const shopCategories = [
  { name: "Phones", slug: "phones" },
  { name: "Laptops", slug: "laptops" },
  { name: "Audio", slug: "audio" },
  { name: "Wearables", slug: "wearables" },
  { name: "Cameras", slug: "cameras" },
  { name: "Gaming", slug: "gaming" },
  { name: "Smart Home", slug: "smart-home" },
  { name: "Accessories", slug: "accessories" },
  { name: "Clearance", slug: "clearance" },
] as const;

export type CircleShortcut =
  | {
      type: "photo";
      label: string;
      image: string;
      slug: string;
    }
  | {
      type: "promo";
      label: string;
      sublabel: string;
      icon: string;
      accent: "orange" | "mint" | "amber";
      href: string;
    };

export const circleShortcuts: CircleShortcut[] = [
  {
    type: "promo",
    label: "Best Deals",
    sublabel: "Top prices",
    icon: "badge-percent",
    accent: "orange",
    href: "/#deals",
  },
  {
    type: "photo",
    label: "Phone Deals",
    slug: "phones",
    image:
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=200&auto=format&fit=crop",
  },
  {
    type: "photo",
    label: "Laptops",
    slug: "laptops",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=200&auto=format&fit=crop",
  },
  {
    type: "photo",
    label: "Audio Gear",
    slug: "audio",
    image:
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=200&auto=format&fit=crop",
  },
  {
    type: "photo",
    label: "Wearables",
    slug: "wearables",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200&auto=format&fit=crop",
  },
  {
    type: "promo",
    label: "Extra Off",
    sublabel: "At checkout",
    icon: "sparkles",
    accent: "mint",
    href: "/#deals",
  },
  {
    type: "promo",
    label: "Flash Sale",
    sublabel: "Limited time",
    icon: "zap",
    accent: "orange",
    href: "/#deals",
  },
  {
    type: "photo",
    label: "Cameras",
    slug: "cameras",
    image:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=200&auto=format&fit=crop",
  },
  {
    type: "photo",
    label: "Smart Home",
    slug: "smart-home",
    image:
      "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=200&auto=format&fit=crop",
  },
  {
    type: "photo",
    label: "Gaming",
    slug: "gaming",
    image:
      "https://images.unsplash.com/photo-1592840496694-26d035b52b48?q=80&w=200&auto=format&fit=crop",
  },
  {
    type: "photo",
    label: "Accessories",
    slug: "accessories",
    image:
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=200&auto=format&fit=crop",
  },
  {
    type: "promo",
    label: "Clearance",
    sublabel: "While stocks last",
    icon: "tag",
    accent: "amber",
    href: "/category/clearance",
  },
];
