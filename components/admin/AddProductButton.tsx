"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Locale } from "@/lib/i18n/settings";

export function AddProductButton({ locale }: { locale: Locale }) {
  const { t } = useTranslation();
  return (
    <Link
      href={`/${locale}/admin/products/new`}
      className="inline-flex items-center gap-2 rounded-full bg-celsius-500 px-5 py-2.5 text-sm font-semibold text-white shadow-card transition hover:bg-celsius-600"
    >
      <Plus size={15} />
      {t("admin.addProduct")}
    </Link>
  );
}
