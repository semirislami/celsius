import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/settings";
import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  return <ProductForm locale={locale} mode={{ kind: "create" }} />;
}
