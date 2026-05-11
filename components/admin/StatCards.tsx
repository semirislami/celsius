"use client";

import type { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export type Tone = "celsius" | "heating" | "emerald" | "neutral";

const TONE_CLASSES: Record<Tone, { bg: string; color: string }> = {
  celsius: { bg: "bg-celsius-50", color: "text-celsius-500" },
  heating: { bg: "bg-heating-50", color: "text-heating-500" },
  emerald: { bg: "bg-emerald-50", color: "text-emerald-600" },
  neutral: { bg: "bg-canvas-muted", color: "text-ink-soft" }
};

export type StatCardItem = {
  key: string;
  labelKey: string;
  sublabelKey?: string;
  value: string | number;
  Icon: LucideIcon;
  tone: Tone;
};

type Props = { stats: StatCardItem[] };

export function StatCards({ stats }: Props) {
  const { t } = useTranslation();
  const colsClass =
    stats.length >= 4
      ? "md:grid-cols-2 xl:grid-cols-4"
      : "md:grid-cols-3";

  return (
    <div className={cn("grid gap-4", colsClass)}>
      {stats.map(({ key, labelKey, sublabelKey, value, Icon, tone }) => {
        const tc = TONE_CLASSES[tone];
        return (
          <article
            key={key}
            className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-ink/5"
          >
            <span
              className={cn(
                "inline-flex h-11 w-11 items-center justify-center rounded-2xl",
                tc.bg,
                tc.color
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
            <div className="mt-1 text-2xl font-semibold tracking-tight text-ink md:text-3xl">
              {value}
            </div>
          </article>
        );
      })}
    </div>
  );
}
