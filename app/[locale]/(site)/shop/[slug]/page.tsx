import type { Locale } from "@/lib/i18n/settings";
import { isLocale } from "@/lib/i18n/settings";
import { notFound } from "next/navigation";
import { getProductBySlug, listProducts } from "@/lib/products/store";
import { Breadcrumbs } from "@/components/product/Breadcrumbs";
import { Gallery } from "@/components/product/Gallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { TechFeatures } from "@/components/product/TechFeatures";
import { Specs } from "@/components/product/Specs";
import { SimilarModels } from "@/components/product/SimilarModels";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params
}: {
  params: { locale: string; slug: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;

  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const all = await listProducts();
  const similar = all.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <>
      <section className="bg-white">
        <div className="container pt-6">
          <Breadcrumbs locale={locale} current={product.name} />
        </div>
        <div className="container grid gap-10 py-8 lg:grid-cols-2 lg:gap-14 lg:py-12">
          <Gallery images={product.images ?? [product.imageUrl]} alt={product.name} />
          <ProductInfo product={product} locale={locale} />
        </div>
      </section>
      <TechFeatures />
      <Specs product={product} />
      <SimilarModels items={similar} locale={locale} />
    </>
  );
}
