import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { deleteProduct, getProductById, updateProduct } from "@/lib/products/store";
import { deleteUploadedImage } from "@/lib/products/upload";
import {
  BADGES,
  BRANDS,
  ENERGY_CLASSES,
  type Badge,
  type Brand,
  type EnergyClass,
  type ProductPatch,
  type ProductSpecs
} from "@/lib/products/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const product = await getProductById(params.id);
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ product });
}

/**
 * Updates a product. JSON body — image (if changed) is uploaded directly to
 * Storage from the browser, and only the new public URL is sent here.
 */
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const existing = await getProductById(params.id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }
  if (!raw || typeof raw !== "object") {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const b = raw as Record<string, unknown>;
  const has = (k: string) => Object.prototype.hasOwnProperty.call(b, k);
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const optNum = (v: unknown) => {
    if (v === undefined || v === null || v === "") return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  };

  const patch: ProductPatch = {};
  if (has("name")) patch.name = str(b.name);
  if (has("slug")) patch.slug = str(b.slug);
  if (has("description")) patch.description = str(b.description);
  if (has("priceMkd")) {
    const n = Number(b.priceMkd);
    if (!Number.isFinite(n) || n <= 0)
      return NextResponse.json({ error: "priceMkd is invalid" }, { status: 400 });
    patch.priceMkd = n;
  }
  if (has("oldPriceMkd")) patch.oldPriceMkd = optNum(b.oldPriceMkd);
  if (has("capacityBtu")) {
    const n = Number(b.capacityBtu);
    if (!Number.isFinite(n) || n <= 0)
      return NextResponse.json({ error: "capacityBtu is invalid" }, { status: 400 });
    patch.capacityBtu = n;
  }
  if (has("brand")) {
    const v = str(b.brand);
    if (!(BRANDS as readonly string[]).includes(v))
      return NextResponse.json({ error: "brand is invalid" }, { status: 400 });
    patch.brand = v as Brand;
  }
  if (has("energyClass")) {
    const v = str(b.energyClass);
    if (!(ENERGY_CLASSES as readonly string[]).includes(v))
      return NextResponse.json({ error: "energyClass is invalid" }, { status: 400 });
    patch.energyClass = v as EnergyClass;
  }
  if (has("badge")) {
    const v = str(b.badge);
    patch.badge = v && (BADGES as readonly string[]).includes(v) ? (v as Badge) : null;
  }
  if (has("guaranteeYears")) patch.guaranteeYears = optNum(b.guaranteeYears);
  if (has("noiseDb")) patch.noiseDb = optNum(b.noiseDb);

  if (has("specs")) {
    const r = (b.specs ?? {}) as Record<string, unknown>;
    const s = (k: string) => (typeof r[k] === "string" ? (r[k] as string).trim() : "");
    const bb = (k: string) => r[k] === true || r[k] === "true" || r[k] === 1 || r[k] === "1";
    const specs: ProductSpecs = {
      isInverter: bb("isInverter") || undefined,
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
      installationKitIncluded: bb("installationKitIncluded") || undefined,
      cooling: s("cooling") || undefined,
      heating: s("heating") || undefined,
      temp: s("temp") || undefined,
      noise: s("noise") || undefined,
      gas: s("gas") || undefined,
      wifi: s("wifi") || undefined
    };
    const has_any = Object.values(specs).some(
      (v) => v !== undefined && v !== "" && v !== false
    );
    patch.specs = has_any ? specs : undefined;
  }

  // Image: client uploads directly and only sends the new URL
  if (has("imageUrl")) {
    const newUrl = str(b.imageUrl);
    if (newUrl && newUrl !== existing.imageUrl) {
      patch.imageUrl = newUrl;
      // Best-effort cleanup of the previous image
      await deleteUploadedImage(existing.imageUrl);
    }
  }

  const updated = await updateProduct(params.id, patch);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  revalidatePath("/", "layout");
  return NextResponse.json({ product: updated });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  console.log("[DELETE /api/products/[id]] received id:", JSON.stringify(params.id));

  const existing = await getProductById(params.id);
  if (!existing) {
    return NextResponse.json(
      { error: `Product not found for id="${params.id}"` },
      { status: 404 }
    );
  }
  await deleteUploadedImage(existing.imageUrl);
  const ok = await deleteProduct(params.id);
  if (!ok) {
    return NextResponse.json(
      { error: `Delete reported no rows affected for id="${params.id}"` },
      { status: 404 }
    );
  }

  // Invalidate every page that lists products so the next navigation picks up
  // the change immediately on Vercel (no stale RSC payload).
  revalidatePath("/", "layout");

  return NextResponse.json(
    { ok: true, id: params.id },
    { headers: { "Cache-Control": "no-store" } }
  );
}
