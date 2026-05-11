"use client";

import { useTranslation } from "react-i18next";
import type { DistributionItem } from "@/lib/products/analytics";
import { cn } from "@/lib/utils";

type Props = {
  titleKey: string;
  items: DistributionItem[];
  /** Tailwind class for the bar fill. Default: bg-celsius-500. */
  barClass?: string;
  /** Optional total for percentage display. Defaults to sum of counts. */
  total?: number;
  emptyKey?: string;
};

export function Distribution({
  titleKey,
  items,
  barClass = "bg-celsius-500",
  total,
  emptyKey = "admin.analytics.empty"
}: Props) {
  const { t } = useTranslation();
  const max = items.reduce((m, i) => Math.max(m, i.count), 0);
  const sumTotal = total ?? items.reduce((s, i) => s + i.count, 0);

  return (
    <article className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-ink/5">
      <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink-muted">
        {t(titleKey)}
      </h3>

      {items.length === 0 ? (
        <p className="mt-6 text-sm text-ink-muted">{t(emptyKey)}</p>
      ) : (
        <ul className="mt-5 space-y-4">
          {items.map((item) => {
            const pct = max ? (item.count / max) * 100 : 0;
            const share = sumTotal ? Math.round((item.count / sumTotal) * 100) : 0;
            return (
              <li key={item.key}>
                <div className="flex items-baseline justify-between text-sm">
                  <span className="font-medium text-ink">{item.label}</span>
                  <span className="text-ink-muted">
                    <span className="font-semibold text-ink">{item.count}</span>{" "}
                    <span className="text-xs">· {share}%</span>
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-canvas-muted">
                  <div
                    className={cn("h-full rounded-full", barClass)}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </article>
  );
}
