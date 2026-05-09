import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Trim whitespace from key-style env values.
function cleanKey(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed || undefined;
}

/**
 * Robustly normalize the Supabase project URL.
 *
 * Accepts any of:
 *   - "https://xyz.supabase.co"
 *   - "https://xyz.supabase.co/"
 *   - "xyz.supabase.co" (missing scheme)
 *   - "https://xyz.supabase.co/api" (extra path, e.g. someone copied a deeper page)
 *
 * Always returns the origin only ("https://xyz.supabase.co"). Returns
 * undefined if the value isn't a parsable URL.
 *
 * Without this, malformed URLs leak into the storage SDK as e.g.
 *   "…supabase.co//storage/v1/bucket"
 * which Supabase rejects with "Invalid path specified in request URL".
 */
function cleanUrl(value: string | undefined): string | undefined {
  if (!value) return undefined;
  let v = value.trim();
  if (!v) return undefined;
  if (!/^https?:\/\//i.test(v)) v = `https://${v}`;
  try {
    return new globalThis.URL(v).origin;
  } catch {
    return undefined;
  }
}

const URL = cleanUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
const ANON = cleanKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const SERVICE = cleanKey(process.env.SUPABASE_SERVICE_ROLE_KEY);

export const STORAGE_BUCKET = (cleanKey(process.env.SUPABASE_STORAGE_BUCKET) ?? "product-images");

/** Exposed for /api/debug to confirm what the server actually parsed. */
export function getDebugConfig() {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return {
    url: { resolved: URL ?? null, rawLength: raw.length, hadTrailingSlash: raw.endsWith("/"), hadScheme: /^https?:\/\//i.test(raw) },
    anon: { present: !!ANON, length: ANON?.length ?? 0 },
    service: { present: !!SERVICE, length: SERVICE?.length ?? 0 },
    bucket: STORAGE_BUCKET
  };
}

let readSingleton: SupabaseClient | null = null;
let adminSingleton: SupabaseClient | null = null;

const baseOptions = {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
};

/**
 * Server-side read client. Uses the anon key — assumes RLS allows public reads
 * on whatever table is being queried. Safe to use in server components.
 *
 * Throws if env is missing — use this when the caller wants to fail loudly
 * (e.g. write-side helpers that must not silently no-op).
 */
export function getReadClient(): SupabaseClient {
  const sb = tryGetReadClient();
  if (!sb) {
    throw new Error(
      "Supabase env missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }
  return sb;
}

/**
 * Same as getReadClient but returns null (with a console.warn) when env is
 * missing, so server components can render an empty state instead of throwing
 * a 500. Use this from public read paths (homepage, shop, product detail).
 */
export function tryGetReadClient(): SupabaseClient | null {
  if (readSingleton) return readSingleton;
  if (!URL || !ANON) {
    if (!warnedRead) {
      console.warn(
        "[supabase] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY missing — read paths will return empty results."
      );
      warnedRead = true;
    }
    return null;
  }
  readSingleton = createClient(URL, ANON, baseOptions);
  return readSingleton;
}

let warnedRead = false;

/**
 * Server-side admin client. Uses the service role key (bypasses RLS).
 * NEVER import this from a client component or send the client to the browser.
 * Only use inside route handlers or server-only modules.
 */
export function getAdminClient(): SupabaseClient {
  if (adminSingleton) return adminSingleton;
  if (!URL || !SERVICE) {
    throw new Error(
      "Supabase admin env missing. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local."
    );
  }
  adminSingleton = createClient(URL, SERVICE, baseOptions);
  return adminSingleton;
}
