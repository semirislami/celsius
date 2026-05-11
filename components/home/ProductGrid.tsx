"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Snowflake, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { formatMkd } from "@/lib/products/format";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/settings";
import type { Product } from "@/lib/products/types";
import { WhatsAppButton } from "@/components/common/WhatsAppButton";

type Props = { locale: Locale; products: Product[] };

export function ProductGrid({ locale, products }: Props) {
  const { t } = useTranslation();
  const items = products.slice(0, 3);

  return (
    <section className="section">
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-[-0.02em] text-ink">
              {t("home.products.title")}
            </h2>
            <p className="mt-3 text-ink-muted">{t("home.products.subtitle")}</p>
          </div>
          <Link
            href={`/${locale}/shop`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-celsius-500 hover:text-celsius-600"
          >
            {t("home.products.viewAll")}
            <ArrowRight size={16} />
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="mt-10 rounded-3xl bg-canvas-soft p-12 text-center text-sm text-ink-muted">
            {t("shop.empty.title")} — {t("shop.empty.subtitle")}
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {items.map((p, idx) => (
              <motion.article
                key={p.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="group overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-ink/5 transition-shadow hover:shadow-card-lg"
              >
                <Link
                  href={`/${locale}/shop/${p.slug}`}
                  className="relative block aspect-[4/3] overflow-hidden bg-canvas-muted"
                >
                  {p.imageUrl && (
                    <Image
                      src={p.imageUrl}
                      alt={p.name}
                      fill
                      sizes="(min-width: 1024px) 360px, 90vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  )}
                  {p.badge && (
                    <span
                      className={cn(
                        "absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white",
                        p.badge === "best-seller" && "bg-heating-500",
                        p.badge === "new" && "bg-ink",
                        p.badge === "top-power" && "bg-celsius-500"
                      )}
                    >
                      {t(`shop.badge.${p.badge}`)}
                    </span>
                  )}
                </Link>
                <div className="p-6">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-lg font-semibold text-ink">
                      <Link href={`/${locale}/shop/${p.slug}`} className="hover:text-celsius-500">
                        {p.name}
                      </Link>
                    </h3>
                    <div className="text-base font-semibold text-celsius-500">
                      {formatMkd(p.priceMkd)}{" "}
                      <span className="text-xs font-medium text-ink-muted">
                        {t("common.currency")}
                      </span>
                    </div>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-muted">
                    {p.description}
                  </p>
                  <div className="mt-4 flex items-center gap-4 text-xs text-ink-muted">
                    <span className="inline-flex items-center gap-1.5">
                      <Zap size={13} className="text-heating-500" />
                      {p.capacityBtu.toLocaleString("mk-MK").replace(/,/g, ".")} BTU
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Snowflake size={13} className="text-celsius-500" />
                      {p.energyClass}
                    </span>
                  </div>
                  <div className="mt-5">
                    <WhatsAppButton product={p} locale={locale} variant="card" />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
