"use client";

import Link from "next/link";
import { Snowflake, ShieldCheck, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatMkd } from "@/lib/products/format";
import type { Product } from "@/lib/products/types";
import type { Locale } from "@/lib/i18n/settings";
import { WhatsAppButton } from "@/components/common/WhatsAppButton";

type Props = { product: Product; locale: Locale };

export function ProductInfo({ product, locale }: Props) {
  const { t } = useTranslation();
  const reviewCount = product.reviewCount ?? 0;
  const guaranteeYears = product.guaranteeYears ?? 5;

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-3">
        <span className="rounded-full bg-heating-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-heating-500">
          {product.badge ? t(`shop.badge.${product.badge}`) : t("product.badge")}
        </span>
        <span className="flex items-center gap-1 text-heating-500">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
          ))}
        </span>
        {reviewCount > 0 && (
          <span className="text-xs text-ink-muted">
            {t("product.reviews", { count: reviewCount })}
          </span>
        )}
      </div>

      <h1 className="mt-4 font-display text-3xl md:text-4xl lg:text-[42px] font-semibold leading-[1.1] tracking-[-0.02em] text-ink">
        {product.name}
      </h1>
      <p className="mt-4 text-ink-muted">{product.description}</p>

      <div className="mt-6 flex items-baseline gap-3">
        <span className="text-3xl font-semibold text-celsius-500">
          {formatMkd(product.priceMkd)}{" "}
          <span className="text-base font-medium text-ink-muted">{t("common.currency")}</span>
        </span>
        {product.oldPriceMkd ? (
          <span className="text-base font-medium text-ink-muted line-through">
            {formatMkd(product.oldPriceMkd)} {t("common.currency")}
          </span>
        ) : null}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Pill
          icon={<Snowflake size={16} />}
          label={t("product.energyClassLabel")}
          value={product.energyClass}
          tone="celsius"
        />
        <Pill
          icon={<ShieldCheck size={16} />}
          label={t("product.guaranteeLabel")}
          value={`${guaranteeYears} ${t("product.guaranteeValue").replace(/^\d+\s*/, "")}`}
          tone="heating"
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <WhatsAppButton product={product} locale={locale} variant="primary" />
        <Link href={`/${locale}/contact`} className="btn-secondary">
          {t("product.contactUs")}
        </Link>
      </div>
    </div>
  );
}

function Pill({
  icon,
  label,
  value,
  tone
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "celsius" | "heating";
}) {
  const cls =
    tone === "celsius"
      ? "bg-celsius-50 text-celsius-500"
      : "bg-heating-50 text-heating-500";
  return (
    <div className="rounded-2xl bg-canvas-soft p-4 ring-1 ring-ink/5">
      <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${cls}`}>
        {icon}
      </span>
      <div className="mt-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
        {label}
      </div>
      <div className="mt-1 text-lg font-semibold text-ink">{value}</div>
    </div>
  );
}
