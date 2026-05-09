"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Snowflake, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatMkd } from "@/lib/products/format";
import type { Locale } from "@/lib/i18n/settings";
import type { Product } from "@/lib/products/types";
import { cn } from "@/lib/utils";

type Props = { items: Product[]; locale: Locale };

export function SimilarModels({ items, locale }: Props) {
  const { t } = useTranslation();
  if (!items.length) return null;

  return (
    <section className="section">
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-[-0.02em] text-ink">
              {t("product.similar.title")}
            </h2>
            <p className="mt-2 text-ink-muted">{t("product.similar.subtitle")}</p>
          </div>
          <Link
            href={`/${locale}/shop`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-celsius-500 hover:text-celsius-600"
          >
            {t("product.similar.viewAll")}
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {items.map((p) => (
            <Link
              key={p.id}
              href={`/${locale}/shop/${p.slug}`}
              className="group overflow-hidden rounded-3xl bg-white ring-1 ring-ink/5 shadow-card transition-shadow hover:shadow-card-lg"
            >
              <div className="relative aspect-[4/3] bg-canvas-muted">
                {p.imageUrl && (
                  <Image
                    src={p.imageUrl}
                    alt={p.name}
                    fill
                    sizes="(min-width: 1024px) 280px, 90vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                )}
                {p.badge && (
                  <span
                    className={cn(
                      "absolute right-3 top-3 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white",
                      p.badge === "best-seller" && "bg-heating-500",
                      p.badge === "new" && "bg-ink",
                      p.badge === "top-power" && "bg-celsius-500"
                    )}
                  >
                    {t(`shop.badge.${p.badge}`)}
                  </span>
                )}
              </div>
              <div className="p-5">
                <h3 className="text-sm font-semibold text-ink">{p.name}</h3>
                <div className="mt-1 text-base font-semibold text-celsius-500">
                  {formatMkd(p.priceMkd)}{" "}
                  <span className="text-xs font-medium text-ink-muted">
                    {t("common.currency")}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-3 text-xs text-ink-muted">
                  <span className="inline-flex items-center gap-1">
                    <Zap size={12} className="text-heating-500" />
                    {p.capacityBtu.toLocaleString("mk-MK").replace(/,/g, ".")} BTU
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Snowflake size={12} className="text-celsius-500" />
                    {p.energyClass}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
