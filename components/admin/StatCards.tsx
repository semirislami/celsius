"use client";

import { Eye, Mail, Users, type LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

const cards: {
  key: "visitors" | "requests" | "views";
  Icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  positive: boolean;
}[] = [
  { key: "visitors", Icon: Users, iconBg: "bg-celsius-50", iconColor: "text-celsius-500", positive: true },
  { key: "requests", Icon: Mail, iconBg: "bg-heating-50", iconColor: "text-heating-500", positive: true },
  { key: "views", Icon: Eye, iconBg: "bg-canvas-muted", iconColor: "text-ink-soft", positive: false }
];

export function StatCards() {
  const { t } = useTranslation();
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map(({ key, Icon, iconBg, iconColor, positive }) => (
        <article
          key={key}
          className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-ink/5"
        >
          <div className="flex items-start justify-between">
            <span className={cn("inline-flex h-11 w-11 items-center justify-center rounded-2xl", iconBg, iconColor)}>
              <Icon size={20} />
            </span>
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-semibold",
                positive
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-rose-50 text-rose-600"
              )}
            >
              {t(`admin.stats.${key}Trend`)}
            </span>
          </div>
          <div className="mt-6 text-sm text-ink-muted">
            {t(`admin.stats.${key}`)}
          </div>
          <div className="mt-1 text-3xl font-semibold tracking-tight text-ink">
            {t(`admin.stats.${key}Value`)}
          </div>
        </article>
      ))}
    </div>
  );
}
