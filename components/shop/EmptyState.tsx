"use client";

import Link from "next/link";
import { PackageOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Locale } from "@/lib/i18n/settings";

export function EmptyState({ locale }: { locale: Locale }) {
  const { t } = useTranslation();
  return (
    <div className="rounded-3xl bg-white p-12 text-center shadow-card ring-1 ring-ink/5">
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-canvas-soft text-celsius-500 ring-1 ring-ink/5">
        <PackageOpen size={28} />
      </span>
      <h3 className="mt-5 text-xl font-semibold text-ink">{t("shop.empty.title")}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">
        {t("shop.empty.subtitle")}
      </p>
      <Link href={`/${locale}/admin`} className="btn-primary mt-6 inline-flex">
        {t("shop.empty.cta")}
      </Link>
    </div>
  );
}

export function NoResults() {
  const { t } = useTranslation();
  return (
    <div className="rounded-3xl bg-white p-10 text-center shadow-card ring-1 ring-ink/5 text-sm text-ink-muted">
      {t("shop.results.none")}
    </div>
  );
}
