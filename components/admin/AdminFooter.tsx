"use client";

import { useTranslation } from "react-i18next";

export function AdminFooter() {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-ink/5 bg-white px-4 py-6 md:px-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-base font-semibold text-celsius-500">
            {t("admin.brand.title")}
          </div>
          <div className="text-xs text-ink-muted">{t("admin.footer.copyright")}</div>
        </div>
        <div className="flex items-center gap-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
          <a href="#" className="hover:text-celsius-500">{t("admin.footer.support")}</a>
          <a href="#" className="hover:text-celsius-500">{t("admin.footer.privacy")}</a>
          <a href="#" className="hover:text-celsius-500">{t("admin.footer.terms")}</a>
        </div>
      </div>
    </footer>
  );
}
