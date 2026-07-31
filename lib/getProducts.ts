import { createClient } from "@supabase/supabase-js";
import { products as fallbackProducts, type Product } from "@/data/products";

type ProductRow = {
  id: string;
  name: string;
  category: string;
  price: number;
  old_price: number | null;
  specs: string[];
  rating: number;
  reviews: number;
  badge: string | null;
  image: string;
};

function rowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    price: Number(row.price),
    oldPrice: row.old_price != null ? Number(row.old_price) : undefined,
    specs: row.specs,
    rating: Number(row.rating),
    reviews: row.reviews,
    badge: (row.badge as Product["badge"]) || undefined,
    image: row.image,
  };
}

// Public read — uses the anon key, safe for server components. Falls back to
// the static demo catalog if Supabase isn't configured yet, the products
// table hasn't been created, or the query fails for any reason — so the
// storefront never goes blank while you're setting things up.
export async function getProducts(): Promise<Product[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return fallbackProducts;

  try {
    const supabase = createClient(url, anonKey);
    const { data, error } = await supabase
      .from("products")
      .select("id, name, category, price, old_price, specs, rating, reviews, badge, image")
      .order("created_at", { ascending: true });

    if (error || !data || data.length === 0) return fallbackProducts;
    return data.map(rowToProduct);
  } catch {
    return fallbackProducts;
  }
}
