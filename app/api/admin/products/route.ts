import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ products: data });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const body = await req.json();
  const { id, name, category, price, oldPrice, specs, rating, reviews, badge, image } = body;

  if (!id || !name || !category || !price || !image) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("products").insert({
    id,
    name,
    category,
    price,
    old_price: oldPrice || null,
    specs: specs || [],
    rating: rating || 0,
    reviews: reviews || 0,
    badge: badge || null,
    image,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
