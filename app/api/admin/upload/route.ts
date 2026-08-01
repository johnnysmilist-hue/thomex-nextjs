import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

const MAX_BYTES = 8 * 1024 * 1024; // 8MB — generous for a phone photo, small enough to stay fast
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Please upload a JPG, PNG, WEBP, or GIF image" },
      { status: 400 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Image is too large — please use one under 8MB" },
      { status: 400 }
    );
  }

  const supabase = getSupabaseAdmin();
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("products")
    .upload(path, await file.arrayBuffer(), {
      contentType: file.type,
      cacheControl: "31536000", // 1 year — product photos rarely change once uploaded
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data } = supabase.storage.from("products").getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
