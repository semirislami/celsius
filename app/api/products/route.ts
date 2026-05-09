import { NextResponse } from "next/server";
import { createProduct, listProducts } from "@/lib/products/store";
import { saveUploadedImage } from "@/lib/products/upload";
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

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const products = await listProducts();
  return NextResponse.json({ products });
}

export async function POST(req: Request) {
  const ctype = req.headers.get("content-type") ?? "";
  if (!ctype.includes("multipart/form-data")) {
    return NextResponse.json({ error: "Expected multipart/form-data" }, { status: 415 });
  }

  const form = await req.formData();
  const get = (k: string) => {
    const v = form.get(k);
    return typeof v === "string" ? v.trim() : "";
  };

  const name = get("name");
  const description = get("description");
  const priceMkd = Number(get("priceMkd"));
  const oldPriceRaw = get("oldPriceMkd");
  const capacityBtu = Number(get("capacityBtu"));
  const brandRaw = get("brand");
  const energyRaw = get("energyClass");
  const badgeRaw = get("badge");
  const guaranteeRaw = get("guaranteeYears");
  const noiseRaw = get("noiseDb");
  const slug = get("slug");

  if (!name || !description) return NextResponse.json({ error: "name and description are required" }, { status: 400 });
  if (!Number.isFinite(priceMkd) || priceMkd <= 0) return NextResponse.json({ error: "priceMkd is invalid" }, { status: 400 });
  if (!Number.isFinite(capacityBtu) || capacityBtu <= 0) return NextResponse.json({ error: "capacityBtu is invalid" }, { status: 400 });
  if (!(BRANDS as readonly string[]).includes(brandRaw)) return NextResponse.json({ error: "brand is invalid" }, { status: 400 });
  if (!(ENERGY_CLASSES as readonly string[]).includes(energyRaw)) return NextResponse.json({ error: "energyClass is invalid" }, { status: 400 });

  const file = form.get("image");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "image is required" }, { status: 400 });
  }
  const upload = await saveUploadedImage(file);
  if ("error" in upload) return NextResponse.json({ error: upload.error }, { status: 400 });

  const specs: ProductSpecs = {
    cooling: get("specsCooling") || undefined,
    heating: get("specsHeating") || undefined,
    seer: get("specsSeer") || undefined,
    temp: get("specsTemp") || undefined,
    noise: get("specsNoise") || undefined,
    gas: get("specsGas") || undefined,
    wifi: get("specsWifi") || undefined
  };
  const hasSpecs = Object.values(specs).some(Boolean);

  const input: NewProductInput = {
    name,
    slug,
    description,
    priceMkd,
    oldPriceMkd: oldPriceRaw ? Number(oldPriceRaw) || undefined : undefined,
    capacityBtu,
    brand: brandRaw as Brand,
    energyClass: energyRaw as EnergyClass,
    badge: (BADGES as readonly string[]).includes(badgeRaw) ? (badgeRaw as Badge) : null,
    imageUrl: upload.url,
    guaranteeYears: guaranteeRaw ? Number(guaranteeRaw) || undefined : undefined,
    noiseDb: noiseRaw ? Number(noiseRaw) || undefined : undefined,
    specs: hasSpecs ? specs : undefined
  };

  const product = await createProduct(input);
  return NextResponse.json({ product }, { status: 201 });
}
