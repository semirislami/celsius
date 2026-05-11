"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, PackageOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatMkd } from "@/lib/products/format";
import { brandLabel, type Product } from "@/lib/products/types";
import type { Locale } from "@/lib/i18n/settings";

type Props = { locale: Locale; products: Product[] };

export function RecentProducts({ locale, products }: Props) {
  const { t } = useTranslation();

  return (
    <article className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-ink/5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-ink">
          {t("admin.analytics.recentTitle")}
        </h3>
        <Link
          href={`/${locale}/admin/products`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-celsius-500 hover:text-celsius-600"
        >
          {t("admin.analytics.viewAll")}
          <ArrowRight size={13} />
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-3 py-6 text-center">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-canvas-soft text-ink-muted ring-1 ring-ink/5">
            <PackageOpen size={20} />
          </span>
          <p className="text-sm text-ink-muted">
            {t("admin.analytics.empty")}
          </p>
        </div>
      ) : (
        <ul className="mt-5 space-y-3">
          {products.map((p) => (
            <li key={p.id}>
              <Link
                href={`/${locale}/admin/products/${p.id}/edit`}
                className="flex items-center gap-3 rounded-2xl p-2 transition hover:bg-canvas-soft"
              >
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-canvas-muted ring-1 ring-ink/5">
                  {p.imageUrl && (
                    <Image
                      src={p.imageUrl}
                      alt=""
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-ink">
                    {p.name}
                  </div>
                  <div className="truncate text-xs text-ink-muted">
                    {brandLabel(p.brand)} ·{" "}
                    {p.capacityBtu.toLocaleString("mk-MK").replace(/,/g, ".")} BTU
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-sm font-semibold text-celsius-500">
                    {formatMkd(p.priceMkd)}
                  </div>
                  <div className="text-[10px] text-ink-muted">
                    {t("common.currency")}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
