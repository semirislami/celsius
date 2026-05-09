"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Locale } from "@/lib/i18n/settings";

export function Breadcrumbs({ locale, current }: { locale: Locale; current: string }) {
  const { t } = useTranslation();
  return (
    <nav className="flex items-center gap-1.5 text-xs text-ink-muted" aria-label="Breadcrumb">
      <Link href={`/${locale}`} className="hover:text-celsius-500">
        {t("shop.breadcrumbHome")}
      </Link>
      <ChevronRight size={14} className="text-ink/30" />
      <Link href={`/${locale}/shop`} className="hover:text-celsius-500">
        {t("shop.breadcrumbShop")}
      </Link>
      <ChevronRight size={14} className="text-ink/30" />
      <span className="truncate text-ink">{current}</span>
    </nav>
  );
}
