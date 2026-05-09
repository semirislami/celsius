import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Trim trailing slashes / whitespace — Vercel env paste can introduce them
// and the storage client builds malformed URLs ("…supabase.co//storage/...")
// which Supabase rejects with "Invalid path specified in request URL".
function clean(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim().replace(/\/+$/, "");
  return trimmed || undefined;
}

const URL = clean(process.env.NEXT_PUBLIC_SUPABASE_URL);
const ANON = clean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const SERVICE = clean(process.env.SUPABASE_SERVICE_ROLE_KEY);

export const STORAGE_BUCKET = (clean(process.env.SUPABASE_STORAGE_BUCKET) ?? "product-images");

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
