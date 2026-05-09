import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getAdminClient, STORAGE_BUCKET } from "@/lib/supabase/server";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  ensureBucket,
  extForImage
} from "@/lib/products/upload";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Returns a Supabase signed upload URL so the browser can PUT the image
 * directly to Storage, bypassing Vercel's 4.5 MB serverless body limit.
 *
 * Request:  { contentType: string, size?: number }
 * Response: { signedUrl, token, path, publicUrl }
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }

  const b = (body ?? {}) as { contentType?: unknown; size?: unknown };
  const contentType = typeof b.contentType === "string" ? b.contentType : "";
  const size = typeof b.size === "number" ? b.size : undefined;

  if (!ALLOWED_IMAGE_TYPES.has(contentType)) {
    return NextResponse.json(
      { error: `Unsupported content type: ${contentType || "(empty)"}` },
      { status: 400 }
    );
  }
  if (size !== undefined && size > MAX_IMAGE_BYTES) {
    return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 413 });
  }

  const ensured = await ensureBucket();
  if (!ensured.ok) {
    return NextResponse.json(
      { error: `bucket setup failed: ${ensured.error}` },
      { status: 500 }
    );
  }

  const sb = getAdminClient();
  const filename = `${randomUUID()}${extForImage(contentType)}`;

  const { data, error } = await sb.storage
    .from(STORAGE_BUCKET)
    .createSignedUploadUrl(filename);

  if (error || !data) {
    console.error("[upload-url] createSignedUploadUrl failed:", error);
    return NextResponse.json(
      { error: error?.message ?? "could not create signed upload URL" },
      { status: 500 }
    );
  }

  const { data: pub } = sb.storage.from(STORAGE_BUCKET).getPublicUrl(filename);

  return NextResponse.json({
    signedUrl: data.signedUrl,
    token: data.token,
    path: filename,
    publicUrl: pub.publicUrl
  });
}
