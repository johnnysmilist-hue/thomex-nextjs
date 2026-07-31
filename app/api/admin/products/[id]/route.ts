import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const body = await req.json();
  const { name, category, price, oldPrice, specs, rating, reviews, badge, image } = body;

  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("products")
    .update({
      name,
      category,
      price,
      old_price: oldPrice || null,
      specs: specs || [],
      rating: rating || 0,
      reviews: reviews || 0,
      badge: badge || null,
      image,
    })
    .eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("products").delete().eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
