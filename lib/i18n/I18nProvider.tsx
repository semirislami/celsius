"use client";

import { useEffect, useMemo } from "react";
import { I18nextProvider } from "react-i18next";
import { getClientI18n } from "./client";
import type { Locale } from "./settings";

type Props = {
  locale: Locale;
  children: React.ReactNode;
};

export function I18nProvider({ locale, children }: Props) {
  const i18n = useMemo(() => getClientI18n(locale), [locale]);

  useEffect(() => {
    if (i18n.language !== locale) {
      void i18n.changeLanguage(locale);
    }
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
  }, [i18n, locale]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
