"use client";

import { Search, User } from "lucide-react";
import { useTranslation } from "react-i18next";

export function AdminTopbar() {
  const { t } = useTranslation();
  return (
    <header className="border-b border-ink/5 bg-white">
      <div className="flex items-center gap-4 px-4 py-4 md:px-8">
        <div className="relative flex-1 max-w-2xl">
          <Search
            size={16}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted"
          />
          <input
            type="search"
            placeholder={t("admin.search")}
            className="w-full rounded-full bg-canvas-soft py-3 pl-10 pr-4 text-sm placeholder:text-ink-muted ring-1 ring-transparent transition focus:bg-white focus:ring-celsius-300 focus:outline-none"
          />
        </div>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden text-right md:block">
            <div className="text-sm font-semibold text-ink">{t("admin.user.name")}</div>
            <div className="text-xs text-ink-muted">{t("admin.user.role")}</div>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-canvas-muted text-ink-muted ring-1 ring-ink/5">
            <User size={18} />
          </span>
        </div>
      </div>
    </header>
  );
}
