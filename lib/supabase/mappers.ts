import type { Badge, Brand, EnergyClass, Product, ProductSpecs } from "@/lib/products/types";

export type ProductRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price_mkd: number;
  old_price_mkd: number | null;
  capacity_btu: number;
  brand: string;
  energy_class: string;
  badge: string | null;
  image_url: string;
  guarantee_years: number | null;
  noise_db: number | null;
  review_count: number | null;
  specs: ProductSpecs | null;
  created_at: string;
};

export function rowToProduct(r: ProductRow): Product {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    description: r.description,
    priceMkd: r.price_mkd,
    oldPriceMkd: r.old_price_mkd ?? undefined,
    capacityBtu: r.capacity_btu,
    brand: r.brand as Brand,
    energyClass: r.energy_class as EnergyClass,
    badge: (r.badge as Badge | null) ?? null,
    imageUrl: r.image_url,
    guaranteeYears: r.guarantee_years ?? undefined,
    noiseDb: r.noise_db ?? undefined,
    reviewCount: r.review_count ?? undefined,
    specs: r.specs ?? undefined,
    createdAt: r.created_at
  };
}

export function productToRow(p: Partial<Product>): Partial<ProductRow> {
  const r: Partial<ProductRow> = {};
  if (p.slug !== undefined) r.slug = p.slug;
  if (p.name !== undefined) r.name = p.name;
  if (p.description !== undefined) r.description = p.description;
  if (p.priceMkd !== undefined) r.price_mkd = p.priceMkd;
  if (p.oldPriceMkd !== undefined) r.old_price_mkd = p.oldPriceMkd ?? null;
  if (p.capacityBtu !== undefined) r.capacity_btu = p.capacityBtu;
  if (p.brand !== undefined) r.brand = p.brand;
  if (p.energyClass !== undefined) r.energy_class = p.energyClass;
  if (p.badge !== undefined) r.badge = p.badge ?? null;
  if (p.imageUrl !== undefined) r.image_url = p.imageUrl;
  if (p.guaranteeYears !== undefined) r.guarantee_years = p.guaranteeYears ?? null;
  if (p.noiseDb !== undefined) r.noise_db = p.noiseDb ?? null;
  if (p.reviewCount !== undefined) r.review_count = p.reviewCount ?? null;
  if (p.specs !== undefined) r.specs = p.specs ?? null;
  return r;
}
