"use client";

import Link from "next/link";
import { FileUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Locale } from "@/lib/i18n/settings";

type Props = { locale: Locale };

export function UploadCard({ locale }: Props) {
  const { t } = useTranslation();
  return (
    <article className="rounded-3xl border-2 border-dashed border-ink/15 bg-white p-10 text-center">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-canvas-soft text-celsius-500 ring-1 ring-ink/5">
        <FileUp size={22} />
      </span>
      <h3 className="mt-5 text-base font-semibold text-ink">
        {t("admin.upload.title")}
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">
        {t("admin.upload.subtitle")}
      </p>
      <Link
        href={`/${locale}/admin/products/new`}
        className="mt-6 inline-flex items-center justify-center rounded-full bg-celsius-500 px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-celsius-600"
      >
        {t("admin.upload.button")}
      </Link>
    </article>
  );
}
