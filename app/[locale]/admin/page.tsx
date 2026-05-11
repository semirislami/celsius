import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/settings";
import { listProducts } from "@/lib/products/store";
import { StatCards } from "@/components/admin/StatCards";
import { RecentProducts } from "@/components/admin/RecentProducts";
import { SystemStatus } from "@/components/admin/SystemStatus";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const RECENT_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

export default async function AdminDashboard({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const products = await listProducts();

  const now = Date.now();
  const totalProducts = products.length;
  const recentProducts = products.filter((p) => {
    const t = Date.parse(p.createdAt);
    return Number.isFinite(t) && now - t <= RECENT_WINDOW_MS;
  }).length;
  const brandCount = new Set(products.map((p) => p.brand)).size;
  const latest = products.slice(0, 5);

  return (
    <div className="space-y-8">
      <StatCards
        totalProducts={totalProducts}
        recentProducts={recentProducts}
        brandCount={brandCount}
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RecentProducts locale={locale} products={latest} />
        </div>
        <div>
          <SystemStatus />
        </div>
      </div>
    </div>
  );
}
