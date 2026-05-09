"use client";

import { User } from "lucide-react";
import { useTranslation } from "react-i18next";

const items = ["trajkovski", "angelova", "petrov"] as const;

export function RequestsList() {
  const { t } = useTranslation();
  return (
    <article className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-ink/5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-ink">{t("admin.requests.title")}</h3>
        <a href="#" className="text-xs font-semibold text-celsius-500 hover:text-celsius-600">
          {t("admin.requests.viewAll")}
        </a>
      </div>

      <ul className="mt-5 space-y-4">
        {items.map((key) => (
          <li key={key} className="flex items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-canvas-muted text-ink-muted ring-1 ring-ink/5">
              <User size={16} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-ink">
                {t(`admin.requests.items.${key}.name`)}
              </div>
              <div className="truncate text-xs text-ink-muted">
                {t(`admin.requests.items.${key}.subject`)}
              </div>
            </div>
            <div className="text-xs text-ink-muted">
              {t(`admin.requests.items.${key}.time`)}
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
}
