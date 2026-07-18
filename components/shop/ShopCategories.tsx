"use client";

import Link from "next/link";
import { AirVent, ArrowRight, Boxes, ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Locale } from "@/lib/i18n/settings";
import { CATEGORIES, type Category, type Product } from "@/lib/products/types";

type Props = { locale: Locale; products: Product[] };

const CATEGORY_ICONS: Record<Category, LucideIcon> = {
  split: AirVent,
  "multi-split": Boxes
};

export function ShopCategories({ locale, products }: Props) {
  const { t } = useTranslation();

  const counts = products.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="container py-10 md:py-14">
      <nav className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
        <Link href={`/${locale}`} className="hover:text-celsius-500">
          {t("shop.breadcrumbHome")}
        </Link>
        <ChevronRight size={14} className="text-ink/30" />
        <span className="text-ink">{t("shop.breadcrumbShop")}</span>
      </nav>

      <h1 className="mt-3 heading-display text-ink">{t("shop.categories.title")}</h1>
      <p className="mt-3 max-w-xl text-base text-ink-muted">
        {t("shop.categories.subtitle")}
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {CATEGORIES.map((cat) => {
          const Icon = CATEGORY_ICONS[cat];
          const count = counts[cat] ?? 0;
          return (
            <Link
              key={cat}
              href={`/${locale}/shop?category=${cat}`}
              className="group relative flex flex-col overflow-hidden rounded-3xl bg-white p-8 shadow-card ring-1 ring-ink/5 transition-shadow hover:shadow-card-lg"
            >
              <span className="grid h-16 w-16 place-items-center rounded-2xl bg-celsius-50 text-celsius-500 ring-1 ring-celsius-100 transition group-hover:bg-celsius-500 group-hover:text-white">
                <Icon size={30} strokeWidth={1.6} />
              </span>

              <h2 className="mt-6 text-2xl font-semibold tracking-tight text-ink">
                {t(`shop.categories.${cat}.title`)}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">
                {t(`shop.categories.${cat}.desc`)}
              </p>

              <div className="mt-6 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
                  {t("shop.categories.count", { count })}
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-celsius-500 transition group-hover:gap-2.5">
                  {t("shop.categories.browse")}
                  <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
