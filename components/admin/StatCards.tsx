"use client";

import { Boxes, Layers, Plus, type LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

type Props = {
  totalProducts: number;
  recentProducts: number;
  brandCount: number;
};

export function StatCards({ totalProducts, recentProducts, brandCount }: Props) {
  const { t } = useTranslation();

  const cards: {
    labelKey: string;
    value: number;
    Icon: LucideIcon;
    bg: string;
    color: string;
    sublabelKey?: string;
  }[] = [
    {
      labelKey: "admin.analytics.totalProducts",
      value: totalProducts,
      Icon: Boxes,
      bg: "bg-celsius-50",
      color: "text-celsius-500"
    },
    {
      labelKey: "admin.analytics.recentProducts",
      sublabelKey: "admin.analytics.recentWindow",
      value: recentProducts,
      Icon: Plus,
      bg: "bg-heating-50",
      color: "text-heating-500"
    },
    {
      labelKey: "admin.analytics.brands",
      value: brandCount,
      Icon: Layers,
      bg: "bg-canvas-muted",
      color: "text-ink-soft"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map(({ labelKey, sublabelKey, value, Icon, bg, color }) => (
        <article
          key={labelKey}
          className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-ink/5"
        >
          <span
            className={cn(
              "inline-flex h-11 w-11 items-center justify-center rounded-2xl",
              bg,
              color
            )}
          >
            <Icon size={20} />
          </span>
          <div className="mt-6 text-sm text-ink-muted">
            {t(labelKey)}
            {sublabelKey && (
              <span className="ml-1 text-xs text-ink-muted/70">
                {t(sublabelKey)}
              </span>
            )}
          </div>
          <div className="mt-1 text-3xl font-semibold tracking-tight text-ink">
            {value.toLocaleString("mk-MK").replace(/,/g, ".")}
          </div>
        </article>
      ))}
    </div>
  );
}
