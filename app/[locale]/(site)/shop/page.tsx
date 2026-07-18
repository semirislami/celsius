import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/settings";
import { listProducts } from "@/lib/products/store";
import { isCategory } from "@/lib/products/types";
import { ShopBrowser } from "@/components/shop/ShopBrowser";
import { ShopCategories } from "@/components/shop/ShopCategories";

export const dynamic = "force-dynamic";

export default async function ShopPage({
  params,
  searchParams
}: {
  params: { locale: string };
  searchParams: { category?: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const products = await listProducts();

  // No (or unknown) category → show the Split / Multi-Split chooser first.
  const category = isCategory(searchParams.category) ? searchParams.category : null;
  if (!category) {
    return <ShopCategories locale={locale} products={products} />;
  }

  return <ShopBrowser locale={locale} products={products} category={category} />;
}
