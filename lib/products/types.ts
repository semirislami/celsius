export const BRANDS = ["vivax", "fuego", "beko", "samsung"] as const;
export type Brand = (typeof BRANDS)[number];

/** Display labels for brands. Proper nouns — identical across locales. */
export const BRAND_LABELS: Record<Brand, string> = {
  vivax: "Vivax",
  fuego: "Fuego",
  beko: "Beko",
  samsung: "Samsung"
};

export function brandLabel(brand: string): string {
  return (BRAND_LABELS as Record<string, string>)[brand] ?? brand;
}

export const ENERGY_CLASSES = ["A+++", "A++", "A+"] as const;
export type EnergyClass = (typeof ENERGY_CLASSES)[number];

/**
 * Product family shown as the first choice on the shop page.
 * "split"       — a single indoor + outdoor unit (the common wall unit)
 * "multi-split" — one outdoor unit driving several indoor units
 */
export const CATEGORIES = ["split", "multi-split"] as const;
export type Category = (typeof CATEGORIES)[number];
export const DEFAULT_CATEGORY: Category = "split";

export function isCategory(value: string | undefined | null): value is Category {
  return !!value && (CATEGORIES as readonly string[]).includes(value);
}

export const BADGES = ["best-seller", "new", "top-power"] as const;
export type Badge = (typeof BADGES)[number];

export const CAPACITIES = [9000, 12000, 18000, 24000] as const;

export interface ProductSpecs {
  // Перформанси / Главни карактеристики (left column)
  isInverter?: boolean;
  maxPowerKw?: string;
  coolingHeatingPower?: string;
  coolingEnergyClass?: string;
  heatingEnergyClass?: string;
  airCirculation?: string;
  operatingTemp?: string;

  // Главни карактеристики (right column)
  seer?: string;
  eer?: string;
  scop?: string;
  cop?: string;
  noiseLevel?: string;
  annualConsumptionHeating?: string;
  annualConsumptionCooling?: string;

  // Вклучено
  installationKitIncluded?: boolean;

  // Legacy (preserved so existing rows still display)
  cooling?: string;
  heating?: string;
  temp?: string;
  noise?: string;
  gas?: string;
  wifi?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceMkd: number;
  oldPriceMkd?: number;
  capacityBtu: number;
  brand: Brand;
  category: Category;
  energyClass: EnergyClass;
  badge: Badge | null;
  imageUrl: string;
  images?: string[];
  guaranteeYears?: number;
  noiseDb?: number;
  reviewCount?: number;
  specs?: ProductSpecs;
  createdAt: string;
}

export type NewProductInput = Omit<Product, "id" | "createdAt">;
export type ProductPatch = Partial<Omit<Product, "id" | "createdAt">>;
