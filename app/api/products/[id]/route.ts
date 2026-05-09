import { NextResponse } from "next/server";
import { deleteProduct, getProductById, updateProduct } from "@/lib/products/store";
import { deleteUploadedImage, saveUploadedImage } from "@/lib/products/upload";
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

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const existing = await getProductById(params.id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const ctype = req.headers.get("content-type") ?? "";
  if (!ctype.includes("multipart/form-data")) {
    return NextResponse.json({ error: "Expected multipart/form-data" }, { status: 415 });
  }

  const form = await req.formData();
  const get = (k: string) => {
    const v = form.get(k);
    return typeof v === "string" ? v.trim() : "";
  };
  const has = (k: string) => form.has(k);

  const patch: ProductPatch = {};
  if (has("name")) patch.name = get("name");
  if (has("slug")) patch.slug = get("slug");
  if (has("description")) patch.description = get("description");
  if (has("priceMkd")) patch.priceMkd = Number(get("priceMkd"));
  if (has("oldPriceMkd")) {
    const v = get("oldPriceMkd");
    patch.oldPriceMkd = v ? Number(v) : undefined;
  }
  if (has("capacityBtu")) patch.capacityBtu = Number(get("capacityBtu"));
  if (has("brand")) {
    const v = get("brand");
    if (!(BRANDS as readonly string[]).includes(v)) return NextResponse.json({ error: "brand is invalid" }, { status: 400 });
    patch.brand = v as Brand;
  }
  if (has("energyClass")) {
    const v = get("energyClass");
    if (!(ENERGY_CLASSES as readonly string[]).includes(v)) return NextResponse.json({ error: "energyClass is invalid" }, { status: 400 });
    patch.energyClass = v as EnergyClass;
  }
  if (has("badge")) {
    const v = get("badge");
    patch.badge = v && (BADGES as readonly string[]).includes(v) ? (v as Badge) : null;
  }
  if (has("guaranteeYears")) {
    const v = get("guaranteeYears");
    patch.guaranteeYears = v ? Number(v) || undefined : undefined;
  }
  if (has("noiseDb")) {
    const v = get("noiseDb");
    patch.noiseDb = v ? Number(v) || undefined : undefined;
  }

  const specKeys = ["specsCooling", "specsHeating", "specsSeer", "specsTemp", "specsNoise", "specsGas", "specsWifi"];
  if (specKeys.some(has)) {
    const specs: ProductSpecs = {
      cooling: get("specsCooling") || undefined,
      heating: get("specsHeating") || undefined,
      seer: get("specsSeer") || undefined,
      temp: get("specsTemp") || undefined,
      noise: get("specsNoise") || undefined,
      gas: get("specsGas") || undefined,
      wifi: get("specsWifi") || undefined
    };
    patch.specs = Object.values(specs).some(Boolean) ? specs : undefined;
  }

  const file = form.get("image");
  if (file instanceof File && file.size > 0) {
    const upload = await saveUploadedImage(file);
    if ("error" in upload) return NextResponse.json({ error: upload.error }, { status: 400 });
    await deleteUploadedImage(existing.imageUrl);
    patch.imageUrl = upload.url;
  }

  const updated = await updateProduct(params.id, patch);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ product: updated });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const existing = await getProductById(params.id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await deleteUploadedImage(existing.imageUrl);
  const ok = await deleteProduct(params.id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
