"use client";

import { useTranslation } from "react-i18next";

export function SystemStatus() {
  const { t } = useTranslation();
  return (
    <article className="relative overflow-hidden rounded-3xl bg-celsius-gradient p-6 text-white shadow-card-lg">
      <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-celsius-100">
        {t("admin.system.title")}
      </div>
      <div className="mt-3 flex items-baseline gap-3">
        <div className="text-4xl font-semibold">{t("admin.system.value")}</div>
        <span className="rounded-full bg-white/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider">
          {t("admin.system.status")}
        </span>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-celsius-50/90">
        {t("admin.system.description")}
      </p>
    </article>
  );
}
