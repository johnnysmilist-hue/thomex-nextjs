import { createClient } from "@supabase/supabase-js";

export type Review = {
  id: string;
  created_at: string;
  product_id: string;
  user_id: string;
  customer_name: string;
  rating: number;
  comment: string | null;
};

// Public read — uses the anon key, safe for server components. Returns an
// empty list if Supabase isn't configured yet or the query fails, so a
// product page never breaks while reviews are being set up.
export async function getReviews(productId: string): Promise<Review[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return [];

  try {
    const supabase = createClient(url, anonKey);
    const { data, error } = await supabase
      .from("reviews")
      .select("id, created_at, product_id, user_id, customer_name, rating, comment")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    return data;
  } catch {
    return [];
  }
}
