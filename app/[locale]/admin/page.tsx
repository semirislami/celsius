import { notFound } from "next/navigation";
import {
  BadgePercent,
  Boxes,
  Coins,
  Layers,
  PercentSquare,
  Plus,
  Tag,
  TrendingUp
} from "lucide-react";
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
  const products = await listProducts();
  const a = computeAnalytics(products);

  const primary: StatCardItem[] = [
    {
      key: "total",
      labelKey: "admin.analytics.totalProducts",
      value: a.totalProducts.toLocaleString("mk-MK").replace(/,/g, "."),
      Icon: Boxes,
      tone: "celsius"
    },
    {
      key: "value",
      labelKey: "admin.analytics.totalValue",
      value: `${formatMkd(a.totalValueMkd)} ден.`,
      Icon: Coins,
      tone: "emerald"
    },
    {
      key: "avgPrice",
      labelKey: "admin.analytics.avgPrice",
      value: `${formatMkd(Math.round(a.avgPriceMkd))} ден.`,
      Icon: Tag,
      tone: "neutral"
    },
    {
      key: "onSale",
      labelKey: "admin.analytics.onSale",
      value: a.productsOnSale.toLocaleString("mk-MK").replace(/,/g, "."),
      Icon: BadgePercent,
      tone: "heating"
    }
  ];

  const secondary: StatCardItem[] = [
    {
      key: "recent",
      labelKey: "admin.analytics.recentProducts",
      sublabelKey: "admin.analytics.recentWindow",
      value: a.recentProducts.toLocaleString("mk-MK").replace(/,/g, "."),
      Icon: Plus,
      tone: "celsius"
    },
    {
      key: "brands",
      labelKey: "admin.analytics.brands",
      value: a.brandCount.toLocaleString("mk-MK").replace(/,/g, "."),
      Icon: Layers,
      tone: "neutral"
    },
    {
      key: "avgDiscount",
      labelKey: "admin.analytics.avgDiscount",
      value: `${a.avgDiscountPct.toFixed(1)}%`,
      Icon: PercentSquare,
      tone: "heating"
    },
    {
      key: "savings",
      labelKey: "admin.analytics.totalSavings",
      value: `${formatMkd(a.totalSavingsMkd)} ден.`,
      Icon: TrendingUp,
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
