import { createInstance, type i18n } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next";
import { getOptions, type Locale } from "./settings";

export async function initServerI18n(locale: Locale, ns: string = "common"): Promise<i18n> {
  const instance = createInstance();
  await instance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (lang: string, namespace: string) => import(`@/locales/${lang}/${namespace}.json`)
      )
    )
    .init(getOptions(locale, ns));
  return instance;
}

export async function getServerTranslation(locale: Locale, ns: string = "common") {
  const instance = await initServerI18n(locale, ns);
  return {
    t: instance.getFixedT(locale, ns),
    i18n: instance
  };
}
