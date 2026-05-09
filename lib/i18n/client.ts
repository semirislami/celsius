"use client";

import i18next, { type i18n } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next";
import { getOptions, type Locale, defaultLocale } from "./settings";

let initializedInstance: i18n | null = null;

export function getClientI18n(locale: Locale = defaultLocale): i18n {
  if (initializedInstance) {
    if (initializedInstance.language !== locale) {
      void initializedInstance.changeLanguage(locale);
    }
    return initializedInstance;
  }

  const instance = i18next.createInstance();

  void instance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (lang: string, ns: string) => import(`@/locales/${lang}/${ns}.json`)
      )
    )
    .init({
      ...getOptions(locale),
      detection: { order: ["htmlTag"], caches: [] },
      preload: typeof window === "undefined" ? ["mk", "sq"] : []
    });

  initializedInstance = instance;
  return instance;
}
