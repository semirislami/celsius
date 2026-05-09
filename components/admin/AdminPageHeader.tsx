"use client";

import { useTranslation } from "react-i18next";

type Props = {
  titleKey: string;
  subtitleKey?: string;
  action?: React.ReactNode;
};

export function AdminPageHeader({ titleKey, subtitleKey, action }: Props) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">{t(titleKey)}</h1>
        {subtitleKey && (
          <p className="mt-1 text-sm text-ink-muted">{t(subtitleKey)}</p>
        )}
      </div>
      {action}
    </div>
  );
}
