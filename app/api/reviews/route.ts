import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabaseServer";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

// Recomputes a product's average rating and review count from the reviews
// table, and writes it back onto the product row — this is what keeps the
// star rating shown across the site (cards, category pages, product page)
// in sync with real reviews instead of the original demo numbers.
async function recomputeProductRating(productId: string) {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("reviews")
    .select("rating")
    .eq("product_id", productId);

  const ratings = data || [];
  const count = ratings.length;
  const avg = count > 0 ? ratings.reduce((sum, r) => sum + r.rating, 0) / count : 0;

  await supabase
    .from("products")
    .update({ rating: Math.round(avg * 10) / 10, reviews: count })
    .eq("id", productId);
}

export async function POST(req: NextRequest) {
  const supabaseServer = getSupabaseServer();
  const {
    data: { user },
  } = await supabaseServer.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Sign in to leave a review" }, { status: 401 });
  }

  const { productId, rating, comment } = await req.json();
  if (!productId || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Invalid review" }, { status: 400 });
  }

  const customerName =
    (user.user_metadata?.full_name as string) || user.email?.split("@")[0] || "Thomex customer";

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("reviews").upsert(
    {
      product_id: productId,
      user_id: user.id,
      customer_name: customerName,
      rating,
      comment: comment?.trim() || null,
      created_at: new Date().toISOString(),
    },
    { onConflict: "product_id,user_id" }
  );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await recomputeProductRating(productId);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const supabaseServer = getSupabaseServer();
  const {
    data: { user },
  } = await supabaseServer.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { productId } = await req.json();
  if (!productId) {
    return NextResponse.json({ error: "productId is required" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("product_id", productId)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await recomputeProductRating(productId);
  return NextResponse.json({ ok: true });
}
