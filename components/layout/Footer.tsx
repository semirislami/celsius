"use client";

import Link from "next/link";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Logo } from "@/components/brand/Logo";

export function Footer() {
  const { t } = useTranslation();

  const productItems = ["residential", "commercial", "smart", "accessories"] as const;
  const companyItems = ["about", "sustainability", "support", "warranty"] as const;

  return (
    <footer className="mt-24 border-t border-ink/5 bg-white">
      <div className="container py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-muted">
              {t("footer.tagline")}
            </p>
            <div className="mt-6 flex items-center gap-3">
              {[Facebook, Instagram, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-ink-muted ring-1 ring-ink/10 transition-colors hover:text-celsius-500 hover:ring-celsius-200"
                  aria-label="Social link"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink">
              {t("footer.products.title")}
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-ink-muted">
              {productItems.map((key) => (
                <li key={key}>
                  <a href="#" className="hover:text-celsius-500">
                    {t(`footer.products.items.${key}`)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink">
              {t("footer.company.title")}
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-ink-muted">
              {companyItems.map((key) => (
                <li key={key}>
                  <a href="#" className="hover:text-celsius-500">
                    {t(`footer.company.items.${key}`)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink">
              {t("footer.contact.title")}
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-ink-muted">
              <li className="flex items-start gap-3">
                <Phone size={16} className="mt-0.5 text-celsius-500" />
                <span>{t("footer.contact.phone")}</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={16} className="mt-0.5 text-celsius-500" />
                <span>{t("footer.contact.email")}</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 text-celsius-500" />
                <span>{t("footer.contact.address")}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-ink/5 pt-6 text-xs text-ink-muted md:flex-row md:items-center">
          <p>{t("footer.legal.copyright")}</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-celsius-500">
              {t("footer.legal.privacy")}
            </Link>
            <Link href="#" className="hover:text-celsius-500">
              {t("footer.legal.terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
