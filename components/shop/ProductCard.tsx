"use client";

import Link from "next/link";
import Image from "next/image";
import { Snowflake, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { formatMkd } from "@/lib/products/format";
import type { Locale } from "@/lib/i18n/settings";
import type { Product } from "@/lib/products/types";
import { WhatsAppButton } from "@/components/common/WhatsAppButton";

type Props = {
  product: Product;
  locale: Locale;
};

export function ProductCard({ product, locale }: Props) {
  const { t } = useTranslation();
  const detailHref = `/${locale}/shop/${product.slug}`;
  const badge = product.badge;

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-ink/5 transition-shadow hover:shadow-card-lg">
      <Link href={detailHref} className="relative block aspect-[4/3] overflow-hidden bg-canvas-muted">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="grid h-full place-items-center text-ink-muted">—</div>
        )}
        {badge && (
          <span
            className={cn(
              "absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white",
              badge === "best-seller" && "bg-heating-500",
              badge === "new" && "bg-ink",
              badge === "top-power" && "bg-celsius-500"
            )}
          >
            {t(`shop.badge.${badge}`)}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold leading-snug text-ink">
            <Link href={detailHref} className="hover:text-celsius-500">
              {product.name}
            </Link>
          </h3>
          <div className="shrink-0 text-right">
            {product.oldPriceMkd && product.oldPriceMkd > product.priceMkd && (
              <div className="text-xs font-medium text-ink-muted line-through">
                {formatMkd(product.oldPriceMkd)} {t("common.currency")}
              </div>
            )}
            <div className="text-xl font-semibold leading-none text-celsius-500">
              {formatMkd(product.priceMkd)}
            </div>
            <div className="mt-0.5 text-[11px] text-ink-muted">{t("common.currency")}</div>
          </div>
        </div>

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-muted">
          {product.description}
        </p>

        <div className="mt-4 flex items-center gap-4 text-xs text-ink-muted">
          <span className="inline-flex items-center gap-1.5">
            <Zap size={13} className="text-heating-500" />
            {product.capacityBtu.toLocaleString("mk-MK").replace(/,/g, ".")} BTU
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Snowflake size={13} className="text-celsius-500" />
            {product.energyClass}
          </span>
        </div>

        <div className="mt-5 flex flex-col gap-2.5">
          <WhatsAppButton product={product} locale={locale} variant="card" />
          <Link
            href={detailHref}
            className="text-center text-sm font-semibold text-celsius-500 hover:text-celsius-600"
          >
            {t("shop.viewDetails")}
          </Link>
        </div>
      </div>
    </article>
  );
}
