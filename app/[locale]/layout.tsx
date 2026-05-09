import { notFound } from "next/navigation";
import { I18nProvider } from "@/lib/i18n/I18nProvider";
import { isLocale, locales, type Locale } from "@/lib/i18n/settings";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;

  return <I18nProvider locale={locale}>{children}</I18nProvider>;
}
