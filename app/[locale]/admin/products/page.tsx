import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/settings";
import { listProducts } from "@/lib/products/store";
import { ProductTable } from "@/components/admin/ProductTable";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AddProductButton } from "@/components/admin/AddProductButton";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage({
  params
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const products = await listProducts();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        titleKey="admin.pages.products.title"
        subtitleKey="admin.pages.products.subtitle"
        action={<AddProductButton locale={locale} />}
      />
      <ProductTable locale={locale} products={products} />
    </div>
  );
}
