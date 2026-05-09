import { NextResponse } from "next/server";
import { getAdminClient, STORAGE_BUCKET, getDebugConfig } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Diagnostic endpoint. Open in browser to see how the server parsed the
 * Supabase config and whether storage + DB are reachable.
 *
 * Does NOT return any key values — only lengths/booleans.
 */
export async function GET() {
  const config = getDebugConfig();

  let storage: unknown;
  try {
    const sb = getAdminClient();
    const { data, error } = await sb.storage.getBucket(STORAGE_BUCKET);
    storage = {
      reached: true,
      bucketExists: !!data,
      bucket: data ?? null,
      error: error
        ? {
            message: (error as { message?: string }).message,
            name: (error as { name?: string }).name,
            status: (error as { status?: number }).status,
            statusCode: (error as { statusCode?: number }).statusCode
          }
        : null
    };
  } catch (err) {
    storage = { reached: false, thrown: err instanceof Error ? err.message : String(err) };
  }

  let database: unknown;
  try {
    const sb = getAdminClient();
    const { count, error } = await sb
      .from("products")
      .select("*", { count: "exact", head: true });
    database = {
      reached: true,
      tableExists: !error,
      count,
      error: error ? { message: error.message, code: error.code } : null
    };
  } catch (err) {
    database = { reached: false, thrown: err instanceof Error ? err.message : String(err) };
  }

  return NextResponse.json({ config, storage, database }, { status: 200 });
}
