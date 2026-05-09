import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET ?? "product-images";

let readSingleton: SupabaseClient | null = null;
let adminSingleton: SupabaseClient | null = null;

const baseOptions = {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
};

/**
 * Server-side read client. Uses the anon key — assumes RLS allows public reads
 * on whatever table is being queried. Safe to use in server components.
 */
export function getReadClient(): SupabaseClient {
  if (readSingleton) return readSingleton;
  if (!URL || !ANON) {
    throw new Error(
      "Supabase env missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local."
    );
  }
  readSingleton = createClient(URL, ANON, baseOptions);
  return readSingleton;
}

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
