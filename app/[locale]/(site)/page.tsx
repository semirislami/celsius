import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/settings";
import { listProducts } from "@/lib/products/store";
import { Hero } from "@/components/home/Hero";
import { Features } from "@/components/home/Features";
import { ProductGrid } from "@/components/home/ProductGrid";
import { Testimonials } from "@/components/home/Testimonials";
import { CTASection } from "@/components/home/CTASection";

export const dynamic = "force-dynamic";

export default async function HomePage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const products = await listProducts();

  return (
    <>
      <Hero />
      <Features />
      <ProductGrid locale={locale} products={products} />
      <Testimonials />
      <CTASection />
    </>
  );
}
