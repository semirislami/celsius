import { brandLabel, type Product } from "./types";

export type DistributionItem = {
  key: string;
  label: string;
  count: number;
};

export type Analytics = {
  totalProducts: number;
  recentProducts: number; // last N days
  brandCount: number;

  totalValueMkd: number; // sum of priceMkd across catalog
  avgPriceMkd: number;
  minPriceMkd: number;
  maxPriceMkd: number;

  productsOnSale: number; // products with oldPriceMkd > priceMkd
  avgDiscountPct: number; // average discount % among on-sale products
  totalSavingsMkd: number; // sum of (oldPrice - price) across on-sale products

  byBrand: DistributionItem[];
  byCapacity: DistributionItem[];
  byEnergyClass: DistributionItem[];
};

const DEFAULT_RECENT_WINDOW_DAYS = 7;

export function computeAnalytics(
  products: Product[],
  recentWindowDays: number = DEFAULT_RECENT_WINDOW_DAYS
): Analytics {
  const total = products.length;
  const now = Date.now();
  const windowMs = recentWindowDays * 24 * 60 * 60 * 1000;

  const recentCount = products.filter((p) => {
    const t = Date.parse(p.createdAt);
    return Number.isFinite(t) && now - t <= windowMs;
  }).length;

  const prices = products.map((p) => p.priceMkd).filter((n) => Number.isFinite(n));
  const totalValue = prices.reduce((sum, n) => sum + n, 0);
  const avgPrice = prices.length ? totalValue / prices.length : 0;
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 0;

  const onSale = products.filter(
    (p) => typeof p.oldPriceMkd === "number" && p.oldPriceMkd > p.priceMkd
  );
  const totalSavings = onSale.reduce(
    (sum, p) => sum + ((p.oldPriceMkd ?? 0) - p.priceMkd),
    0
  );
  const avgDiscountPct = onSale.length
    ? onSale.reduce((sum, p) => {
        const old = p.oldPriceMkd ?? p.priceMkd;
        if (old <= 0) return sum;
        return sum + ((old - p.priceMkd) / old) * 100;
      }, 0) / onSale.length
    : 0;

  return {
    totalProducts: total,
    recentProducts: recentCount,
    brandCount: new Set(products.map((p) => p.brand)).size,

    totalValueMkd: totalValue,
    avgPriceMkd: avgPrice,
    minPriceMkd: minPrice,
    maxPriceMkd: maxPrice,

    productsOnSale: onSale.length,
    avgDiscountPct,
    totalSavingsMkd: totalSavings,

    byBrand: distribution(products, (p) => p.brand, (k) => brandLabel(k)),
    byCapacity: distribution(
      products,
      (p) => String(p.capacityBtu),
      (k) => `${Number(k).toLocaleString("mk-MK").replace(/,/g, ".")} BTU`
    ),
    byEnergyClass: distribution(products, (p) => p.energyClass, (k) => k)
  };
}

function distribution<T>(
  items: T[],
  keyOf: (item: T) => string,
  labelOf: (key: string) => string
): DistributionItem[] {
  const counts = new Map<string, number>();
  for (const item of items) {
    const k = keyOf(item) || "—";
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([key, count]) => ({ key, label: labelOf(key), count }))
    .sort((a, b) => b.count - a.count);
}
