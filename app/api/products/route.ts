import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createProduct, listProducts } from "@/lib/products/store";
import {
  BADGES,
  BRANDS,
  ENERGY_CLASSES,
  type Badge,
  type Brand,
  type EnergyClass,
  type NewProductInput,
  type ProductSpecs
} from "@/lib/products/types";

function readSpecs(raw: unknown): ProductSpecs {
  const r = (raw ?? {}) as Record<string, unknown>;
  const s = (k: string) => (typeof r[k] === "string" ? (r[k] as string).trim() : "");
  const b = (k: string) => r[k] === true || r[k] === "true" || r[k] === 1 || r[k] === "1";
  return {
    isInverter: b("isInverter") || undefined,
    maxPowerKw: s("maxPowerKw") || undefined,
    coolingHeatingPower: s("coolingHeatingPower") || undefined,
    coolingEnergyClass: s("coolingEnergyClass") || undefined,
    heatingEnergyClass: s("heatingEnergyClass") || undefined,
    airCirculation: s("airCirculation") || undefined,
    operatingTemp: s("operatingTemp") || undefined,
    seer: s("seer") || undefined,
    eer: s("eer") || undefined,
    scop: s("scop") || undefined,
    cop: s("cop") || undefined,
    noiseLevel: s("noiseLevel") || undefined,
    annualConsumptionHeating: s("annualConsumptionHeating") || undefined,
    annualConsumptionCooling: s("annualConsumptionCooling") || undefined,
    installationKitIncluded: b("installationKitIncluded") || undefined,
    // legacy passthrough so old rows survive edits
    cooling: s("cooling") || undefined,
    heating: s("heating") || undefined,
    temp: s("temp") || undefined,
    noise: s("noise") || undefined,
    gas: s("gas") || undefined,
    wifi: s("wifi") || undefined
  };
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const products = await listProducts();
  return NextResponse.json({ products });
}

/**
 * Creates a product. Body is JSON — the image is uploaded directly to
 * Supabase Storage from the browser via /api/products/upload-url, and only
 * the resulting public URL is sent here. This keeps payloads small enough to
 * fit through Vercel's 4.5MB serverless function body limit.
 */
export async function POST(req: Request) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }

  const parsed = parseProductInput(raw, { requireImage: true });
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

  const product = await createProduct(parsed.input);
  revalidatePath("/", "layout");
  return NextResponse.json({ product }, { status: 201 });
}

// ---------- shared parser (not exported — Next route files only allow HTTP methods) ----------

function parseProductInput(
  raw: unknown,
  opts: { requireImage: boolean }
): { ok: true; input: NewProductInput } | { ok: false; error: string } {
  if (!raw || typeof raw !== "object") return { ok: false, error: "invalid body" };
  const b = raw as Record<string, unknown>;

  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const num = (v: unknown) => {
    if (typeof v === "number") return v;
    if (typeof v === "string" && v.trim()) return Number(v);
    return NaN;
  };
  const optNum = (v: unknown) => {
    if (v === undefined || v === null || v === "") return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  };

  const name = str(b.name);
  const description = str(b.description);
  const slug = str(b.slug);
  const priceMkd = num(b.priceMkd);
  const capacityBtu = num(b.capacityBtu);
  const brandRaw = str(b.brand);
  const energyRaw = str(b.energyClass);
  const badgeRaw = str(b.badge);
  const imageUrl = str(b.imageUrl);

  if (!name) return { ok: false, error: "name is required" };
  // description is optional now — DB column is NOT NULL so an empty string is fine.
  if (!Number.isFinite(priceMkd) || priceMkd <= 0)
    return { ok: false, error: "priceMkd is invalid" };
  if (!Number.isFinite(capacityBtu) || capacityBtu <= 0)
    return { ok: false, error: "capacityBtu is invalid" };
  if (!(BRANDS as readonly string[]).includes(brandRaw))
    return { ok: false, error: "brand is invalid" };
  if (!(ENERGY_CLASSES as readonly string[]).includes(energyRaw))
    return { ok: false, error: "energyClass is invalid" };
  if (opts.requireImage && !imageUrl)
    return { ok: false, error: "imageUrl is required" };

  const specs = readSpecs(b.specs);
  const hasSpecs = Object.values(specs).some(
    (v) => v !== undefined && v !== "" && v !== false
  );

  const input: NewProductInput = {
    name,
    slug,
    description,
    priceMkd,
    oldPriceMkd: optNum(b.oldPriceMkd),
    capacityBtu,
    brand: brandRaw as Brand,
    energyClass: energyRaw as EnergyClass,
    badge: (BADGES as readonly string[]).includes(badgeRaw) ? (badgeRaw as Badge) : null,
    imageUrl,
    guaranteeYears: optNum(b.guaranteeYears),
    noiseDb: optNum(b.noiseDb),
    specs: hasSpecs ? specs : undefined
  };

  return { ok: true, input };
}
