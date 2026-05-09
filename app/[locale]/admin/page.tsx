import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/settings";
import { listProducts } from "@/lib/products/store";
import { StatCards } from "@/components/admin/StatCards";
import { ProductTable } from "@/components/admin/ProductTable";
import { RequestsList } from "@/components/admin/RequestsList";
import { UploadCard } from "@/components/admin/UploadCard";
import { SystemStatus } from "@/components/admin/SystemStatus";

export const dynamic = "force-dynamic";

export default async function AdminDashboard({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const products = await listProducts();

  return (
    <div className="space-y-8">
      <StatCards />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <ProductTable locale={locale} products={products} />
          <UploadCard locale={locale} />
        </div>
        <div className="space-y-6">
          <RequestsList />
          <SystemStatus />
        </div>
      </div>
    </div>
  );
}
