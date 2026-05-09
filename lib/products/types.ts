export const BRANDS = ["celsius-prime", "inverter-pro", "eco-thermal"] as const;
export type Brand = (typeof BRANDS)[number];

export const ENERGY_CLASSES = ["A+++", "A++", "A+"] as const;
export type EnergyClass = (typeof ENERGY_CLASSES)[number];

export const BADGES = ["best-seller", "new", "top-power"] as const;
export type Badge = (typeof BADGES)[number];

export const CAPACITIES = [9000, 12000, 18000, 24000] as const;

export interface ProductSpecs {
  cooling?: string;
  heating?: string;
  seer?: string;
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
  energyClass: EnergyClass;
  badge: Badge | null;
  imageUrl: string;
  guaranteeYears?: number;
  noiseDb?: number;
  reviewCount?: number;
  specs?: ProductSpecs;
  createdAt: string;
}

export type NewProductInput = Omit<Product, "id" | "createdAt">;
export type ProductPatch = Partial<Omit<Product, "id" | "createdAt">>;
