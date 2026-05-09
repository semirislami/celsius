import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/settings";
import { getProductById } from "@/lib/products/store";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params
}: {
  params: { locale: string; id: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const product = await getProductById(params.id);
  if (!product) notFound();
  return <ProductForm locale={locale} mode={{ kind: "edit", product }} />;
}
