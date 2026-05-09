export const locales = ["mk", "sq"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "mk";

export const localeLabels: Record<Locale, string> = {
  mk: "Macedonian",
  sq: "Albanian"
};

export const localeNative: Record<Locale, string> = {
  mk: "Македонски",
  sq: "Shqip"
};

export const namespaces = ["common"] as const;
export const defaultNamespace = "common";

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

export function getOptions(locale: Locale = defaultLocale, ns: string = defaultNamespace) {
  return {
    supportedLngs: locales,
    fallbackLng: defaultLocale,
    lng: locale,
    fallbackNS: defaultNamespace,
    defaultNS: defaultNamespace,
    ns,
    interpolation: {
      escapeValue: false
    }
  };
}
