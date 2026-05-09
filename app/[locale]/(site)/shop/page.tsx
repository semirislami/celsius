import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/settings";
import { listProducts } from "@/lib/products/store";
import { ShopBrowser } from "@/components/shop/ShopBrowser";

export const dynamic = "force-dynamic";

export default async function ShopPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const products = await listProducts();
  return <ShopBrowser locale={locale} products={products} />;
}
