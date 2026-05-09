/**
 * Browser-side helper that uploads an image directly to Supabase Storage,
 * bypassing Vercel's 4.5MB serverless body limit.
 *
 * Two steps:
 *   1) Ask our server (service-role) for a short-lived signed upload URL.
 *   2) PUT the file directly to that URL — payload never touches our function.
 */
export async function uploadProductImage(file: File): Promise<{ publicUrl: string }> {
  if (!file) throw new Error("no file provided");

  const sigRes = await fetch("/api/products/upload-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contentType: file.type, size: file.size })
  });
  if (!sigRes.ok) {
    const data = (await sigRes.json().catch(() => ({}))) as { error?: string };
    throw new Error(data.error || `signed URL request failed (${sigRes.status})`);
  }
  const sig = (await sigRes.json()) as {
    signedUrl: string;
    publicUrl: string;
    path: string;
    token: string;
  };

  const putRes = await fetch(sig.signedUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
      "x-upsert": "false",
      "Cache-Control": "public, max-age=31536000, immutable"
    },
    body: file
  });
  if (!putRes.ok) {
    const text = await putRes.text().catch(() => "");
    throw new Error(`upload failed (${putRes.status}): ${text || "no body"}`);
  }

  return { publicUrl: sig.publicUrl };
}
