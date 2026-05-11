import "server-only";
import { getAdminClient, getReadClient, tryGetReadClient } from "@/lib/supabase/server";
import { productToRow, rowToProduct, type ProductRow } from "@/lib/supabase/mappers";
import type { NewProductInput, Product, ProductPatch } from "./types";

const TABLE = "products";

/**
 * Public-page reads degrade gracefully: if Supabase isn't configured, or the
 * table doesn't exist yet, or RLS denies access, we log and return an empty
 * result. This keeps the homepage/shop/detail pages from 500'ing in
 * production when env or schema isn't fully set up.
 */
export async function listProducts(): Promise<Product[]> {
  const sb = tryGetReadClient();
  if (!sb) return [];
  try {
    const { data, error } = await sb
      .from(TABLE)
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("[products] listProducts:", error.message);
      return [];
    }
    return ((data ?? []) as ProductRow[]).map(rowToProduct);
  } catch (err) {
    console.error(
      "[products] listProducts failed:",
      err instanceof Error ? err.message : err
    );
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const sb = tryGetReadClient();
  if (!sb) return null;
  try {
    const { data, error } = await sb
      .from(TABLE)
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error) {
      console.error("[products] getProductBySlug:", error.message);
      return null;
    }
    return data ? rowToProduct(data as ProductRow) : null;
  } catch (err) {
    console.error(
      "[products] getProductBySlug failed:",
      err instanceof Error ? err.message : err
    );
    return null;
  }
}

/**
 * Single-product lookup by id. This is only ever called from admin contexts
 * (edit page, PUT, DELETE), so we use the service-role client to bypass RLS
 * and any sample-row weirdness — same client that the write goes through, so
 * a successful lookup guarantees the delete/update will also see the row.
 */
export async function getProductById(id: string): Promise<Product | null> {
  if (!id) {
    console.warn("[products] getProductById called with empty id");
    return null;
  }
  try {
    const sb = getAdminClient();
    const { data, error } = await sb
      .from(TABLE)
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) {
      console.error("[products] getProductById error:", {
        id,
        message: error.message,
        code: (error as { code?: string }).code,
        details: (error as { details?: string }).details
      });
      return null;
    }
    if (!data) {
      console.warn("[products] getProductById no row for id:", id);
      return null;
    }
    return rowToProduct(data as ProductRow);
  } catch (err) {
    console.error(
      "[products] getProductById threw:",
      err instanceof Error ? err.message : err
    );
    return null;
  }
}

export async function createProduct(input: NewProductInput): Promise<Product> {
  const sb = getAdminClient();
  const baseSlug = (input.slug && input.slug.trim()) || slugify(input.name);
  const slug = await uniqueSlug(baseSlug);
  const row = productToRow({ ...input, slug });
  const { data, error } = await sb.from(TABLE).insert(row).select("*").single();
  if (error) throw new Error(`createProduct: ${error.message}`);
  return rowToProduct(data as ProductRow);
}

export async function updateProduct(id: string, patch: ProductPatch): Promise<Product | null> {
  const sb = getAdminClient();
  const finalPatch: ProductPatch = { ...patch };

  if (finalPatch.slug !== undefined) {
    const desired = slugify(finalPatch.slug || "");
    finalPatch.slug = await uniqueSlug(desired, id);
  }

  const row = productToRow(finalPatch);
  const { data, error } = await sb
    .from(TABLE)
    .update(row)
    .eq("id", id)
    .select("*")
    .maybeSingle();
  if (error) throw new Error(`updateProduct: ${error.message}`);
  return data ? rowToProduct(data as ProductRow) : null;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const sb = getAdminClient();
  const { error, count } = await sb
    .from(TABLE)
    .delete({ count: "exact" })
    .eq("id", id);
  if (error) throw new Error(`deleteProduct: ${error.message}`);
  return (count ?? 0) > 0;
}

const CYRILLIC_MAP: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", ѓ: "gj", е: "e", ж: "zh", з: "z", ѕ: "dz",
  и: "i", ј: "j", к: "k", л: "l", љ: "lj", м: "m", н: "n", њ: "nj", о: "o", п: "p",
  р: "r", с: "s", т: "t", ќ: "kj", у: "u", ф: "f", х: "h", ц: "c", ч: "ch", џ: "dj", ш: "sh"
};

export function slugify(input: string): string {
  const lower = (input || "").toLowerCase().trim();
  const transliterated = lower
    .split("")
    .map((c) => CYRILLIC_MAP[c] ?? c)
    .join("")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "");
  const slug = transliterated
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
  return slug || `product-${Date.now().toString(36)}`;
}

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  const sb = getReadClient();
  const { data, error } = await sb.from(TABLE).select("id, slug");
  if (error) throw new Error(`uniqueSlug: ${error.message}`);
  const taken = new Set(
    ((data ?? []) as { id: string; slug: string }[])
      .filter((r) => r.id !== excludeId)
      .map((r) => r.slug)
  );
  if (!taken.has(base)) return base;
  let i = 2;
  while (taken.has(`${base}-${i}`)) i++;
  return `${base}-${i}`;
}
