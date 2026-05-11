import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/settings";
import { listProducts } from "@/lib/products/store";
import { computeAnalytics } from "@/lib/products/analytics";
import { formatMkd } from "@/lib/products/format";
import { StatCards, type StatCardItem } from "@/components/admin/StatCards";
import { Distribution } from "@/components/admin/Distribution";
import { RecentProducts } from "@/components/admin/RecentProducts";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminDashboard({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;

  let products: Awaited<ReturnType<typeof listProducts>> = [];
  try {
    products = await listProducts();
  } catch (err) {
    console.error("[admin/page] listProducts failed:", err);
  }

  const a = computeAnalytics(products);
  const fmtCount = (n: number) => n.toLocaleString("mk-MK").replace(/,/g, ".");

  const primary: StatCardItem[] = [
    {
      key: "total",
      labelKey: "admin.analytics.totalProducts",
      value: fmtCount(a.totalProducts),
      iconKey: "boxes",
      tone: "celsius"
    },
    {
      key: "value",
      labelKey: "admin.analytics.totalValue",
      value: `${formatMkd(a.totalValueMkd)} ден.`,
      iconKey: "coins",
      tone: "emerald"
    },
    {
      key: "avgPrice",
      labelKey: "admin.analytics.avgPrice",
      value: `${formatMkd(Math.round(a.avgPriceMkd))} ден.`,
      iconKey: "tag",
      tone: "neutral"
    },
    {
      key: "onSale",
      labelKey: "admin.analytics.onSale",
      value: fmtCount(a.productsOnSale),
      iconKey: "badgePercent",
      tone: "heating"
    }
  ];

  const secondary: StatCardItem[] = [
    {
      key: "recent",
      labelKey: "admin.analytics.recentProducts",
      sublabelKey: "admin.analytics.recentWindow",
      value: fmtCount(a.recentProducts),
      iconKey: "plus",
      tone: "celsius"
    },
    {
      key: "brands",
      labelKey: "admin.analytics.brands",
      value: fmtCount(a.brandCount),
      iconKey: "layers",
      tone: "neutral"
    },
    {
      key: "avgDiscount",
      labelKey: "admin.analytics.avgDiscount",
      value: `${a.avgDiscountPct.toFixed(1)}%`,
      iconKey: "percent",
      tone: "heating"
    },
    {
      key: "savings",
      labelKey: "admin.analytics.totalSavings",
      value: `${formatMkd(a.totalSavingsMkd)} ден.`,
      iconKey: "trendingUp",
      tone: "emerald"
    }
  ];

  const latest = products.slice(0, 5);

  return (
    <div className="space-y-8">
      <StatCards stats={primary} />
      <StatCards stats={secondary} />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <Distribution
          titleKey="admin.analytics.byBrand"
          items={a.byBrand}
          barClass="bg-celsius-500"
        />
        <Distribution
          titleKey="admin.analytics.byCapacity"
          items={a.byCapacity}
          barClass="bg-heating-500"
        />
        <Distribution
          titleKey="admin.analytics.byEnergyClass"
          items={a.byEnergyClass}
          barClass="bg-emerald-500"
        />
      </div>

      <RecentProducts locale={locale} products={latest} />
    </div>
  );
}
