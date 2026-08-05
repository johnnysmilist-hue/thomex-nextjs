import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

const BUCKET = "products";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.storage.from(BUCKET).list("", {
    limit: 200,
    sortBy: { column: "created_at", order: "desc" },
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const files = (data || [])
    .filter((f) => f.id) // storage.list() can include a placeholder folder entry; skip it
    .map((f) => ({
      name: f.name,
      url: supabase.storage.from(BUCKET).getPublicUrl(f.name).data.publicUrl,
      size: f.metadata?.size ?? null,
      createdAt: f.created_at,
    }));

  return NextResponse.json({ files });
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const { name } = await req.json();
  if (!name) return NextResponse.json({ error: "name is required" }, { status: 400 });

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.storage.from(BUCKET).remove([name]);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
