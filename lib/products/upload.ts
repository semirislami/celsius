import "server-only";
import path from "path";
import { randomUUID } from "crypto";
import { getAdminClient, STORAGE_BUCKET } from "@/lib/supabase/server";

const ALLOWED = new Set(["image/png", "image/jpeg", "image/webp", "image/svg+xml"]);
const MAX_BYTES = 5 * 1024 * 1024;

function extFor(type: string, name: string): string {
  if (type === "image/png") return ".png";
  if (type === "image/jpeg") return ".jpg";
  if (type === "image/webp") return ".webp";
  if (type === "image/svg+xml") return ".svg";
  const fallback = path.extname(name).toLowerCase();
  return fallback || ".bin";
}

export type UploadResult = { url: string } | { error: string };

let bucketEnsured = false;

/**
 * Idempotently make sure the storage bucket exists and is public. Lets the
 * app self-bootstrap on a fresh Supabase project even if the SQL migration
 * wasn't run.
 */
async function ensureBucket(): Promise<{ ok: true } | { ok: false; error: string }> {
  if (bucketEnsured) return { ok: true };
  const sb = getAdminClient();

  const existing = await sb.storage.getBucket(STORAGE_BUCKET);
  if (existing.data) {
    bucketEnsured = true;
    return { ok: true };
  }
  // getBucket returns an error when the bucket is missing; only treat
  // a real "not found" as a signal to create. Anything else is a config issue.
  const status = (existing.error as { status?: number } | undefined)?.status;
  if (status && status !== 400 && status !== 404) {
    console.error("[upload] getBucket failed:", existing.error);
    return { ok: false, error: existing.error?.message ?? "could not query bucket" };
  }

  const created = await sb.storage.createBucket(STORAGE_BUCKET, {
    public: true,
    fileSizeLimit: `${MAX_BYTES}`
  });
  if (created.error) {
    // Race-create from another invocation: treat "already exists" as success.
    const msg = created.error.message?.toLowerCase() ?? "";
    if (msg.includes("already exists") || msg.includes("duplicate")) {
      bucketEnsured = true;
      return { ok: true };
    }
    console.error("[upload] createBucket failed:", created.error);
    return { ok: false, error: created.error.message ?? "could not create bucket" };
  }

  bucketEnsured = true;
  return { ok: true };
}

export async function saveUploadedImage(file: File): Promise<UploadResult> {
  if (!file || !(file instanceof File) || file.size === 0) {
    return { error: "Empty upload" };
  }
  if (file.size > MAX_BYTES) return { error: "File too large (max 5MB)" };
  if (!ALLOWED.has(file.type)) return { error: `Unsupported type: ${file.type}` };

  const ensured = await ensureBucket();
  if (!ensured.ok) return { error: `bucket setup failed: ${ensured.error}` };

  const sb = getAdminClient();
  const filename = `${randomUUID()}${extFor(file.type, file.name)}`;
  const buf = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await sb.storage
    .from(STORAGE_BUCKET)
    .upload(filename, buf, {
      contentType: file.type,
      cacheControl: "public, max-age=31536000, immutable",
      upsert: false
    });
  if (uploadError) {
    console.error(
      "[upload] storage.upload failed",
      JSON.stringify(
        {
          bucket: STORAGE_BUCKET,
          filename,
          type: file.type,
          size: file.size,
          message: uploadError.message,
          name: uploadError.name,
          // @ts-expect-error — StorageError sometimes carries extra fields
          status: uploadError.status,
          // @ts-expect-error — same
          statusCode: uploadError.statusCode
        },
        null,
        2
      )
    );
    return { error: `upload failed: ${uploadError.message}` };
  }

  const { data } = sb.storage.from(STORAGE_BUCKET).getPublicUrl(filename);
  if (!data?.publicUrl) return { error: "could not resolve public URL" };
  return { url: data.publicUrl };
}

export async function deleteUploadedImage(url: string | undefined | null): Promise<void> {
  if (!url) return;
  const filePath = parseStoragePath(url);
  if (!filePath) return;
  try {
    const sb = getAdminClient();
    await sb.storage.from(STORAGE_BUCKET).remove([filePath]);
  } catch {
    // best-effort cleanup
  }
}

function parseStoragePath(url: string): string | null {
  const marker = `/storage/v1/object/public/${STORAGE_BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx < 0) return null;
  const filePath = url.slice(idx + marker.length);
  if (!filePath || filePath.includes("..") || filePath.startsWith("/")) return null;
  return filePath;
}
