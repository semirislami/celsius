"use client";

import { useTranslation } from "react-i18next";
import { Sparkles, type LucideIcon } from "lucide-react";

type Props = { Icon?: LucideIcon };

export function ComingSoon({ Icon = Sparkles }: Props) {
  const { t } = useTranslation();
  return (
    <div className="rounded-3xl bg-white p-12 text-center shadow-card ring-1 ring-ink/5">
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-canvas-soft text-celsius-500 ring-1 ring-ink/5">
        <Icon size={26} />
      </span>
      <h2 className="mt-5 text-xl font-semibold text-ink">{t("admin.comingSoon.title")}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">
        {t("admin.comingSoon.subtitle")}
      </p>
    </div>
  );
}
