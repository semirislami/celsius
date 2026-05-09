"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Locale } from "@/lib/i18n/settings";
import { Logo } from "@/components/brand/Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { cn } from "@/lib/utils";

type Props = { locale: Locale };

export function Header({ locale }: Props) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const nav = [
    { key: "home", href: `/${locale}` },
    { key: "shop", href: `/${locale}/shop` },
    { key: "about", href: `/${locale}/about` },
    { key: "contact", href: `/${locale}/contact` }
  ] as const;

  return (
    <header className="sticky top-0 z-40 border-b border-ink/5 bg-white/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-6 md:h-20">
        <Link href={`/${locale}`} className="shrink-0" aria-label="Celsius home">
          <Logo />
        </Link>

        <nav className="hidden md:flex items-center gap-8" aria-label="Main">
          {nav.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="text-sm font-medium text-ink-soft transition-colors hover:text-celsius-500"
            >
              {t(`nav.${item.key}`)}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center">
          <LanguageSwitcher locale={locale} />
        </div>

        <button
          type="button"
          aria-label={open ? t("nav.closeMenu") : t("nav.openMenu")}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-ink/10"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <div
        className={cn(
          "md:hidden border-t border-ink/5 bg-white",
          open ? "block" : "hidden"
        )}
      >
        <nav className="container flex flex-col gap-1 py-4" aria-label="Mobile">
          {nav.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-base font-medium text-ink-soft hover:bg-canvas-soft"
            >
              {t(`nav.${item.key}`)}
            </Link>
          ))}
          <div className="mt-2 border-t border-ink/5 pt-4">
            <LanguageSwitcher locale={locale} />
          </div>
        </nav>
      </div>
    </header>
  );
}
