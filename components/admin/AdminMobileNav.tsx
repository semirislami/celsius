"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Boxes,
  Menu,
  Plus,
  Settings,
  ShoppingCart,
  X,
  type LucideIcon
} from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Locale } from "@/lib/i18n/settings";
import { cn } from "@/lib/utils";

type Props = { locale: Locale };

const items: {
  key: "analytics" | "products" | "orders" | "settings";
  Icon: LucideIcon;
  href: string;
}[] = [
  { key: "analytics", Icon: BarChart3, href: "" },
  { key: "products", Icon: Boxes, href: "/products" },
  { key: "orders", Icon: ShoppingCart, href: "/orders" },
  { key: "settings", Icon: Settings, href: "/settings" }
];

export function AdminMobileNav({ locale }: Props) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const pathname = usePathname() ?? "";

  const adminBase = `/${locale}/admin`;
  const sub = pathname.startsWith(adminBase) ? pathname.slice(adminBase.length) : "";
  const isActive = (href: string) => {
    if (href === "") return sub === "" || sub === "/";
    return sub === href || sub.startsWith(`${href}/`);
  };

  // Auto-close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while drawer is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // ESC closes
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label={t("nav.openMenu")}
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="lg:hidden inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink ring-1 ring-ink/10 transition hover:bg-canvas-soft"
      >
        <Menu size={18} />
      </button>

      <div
        aria-hidden={!open}
        className={cn(
          "lg:hidden fixed inset-0 z-50 transition-opacity duration-200",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <button
          type="button"
          aria-label={t("nav.closeMenu")}
          tabIndex={open ? 0 : -1}
          onClick={() => setOpen(false)}
          className="absolute inset-0 bg-ink/40"
        />

        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Admin menu"
          className={cn(
            "absolute left-0 top-0 flex h-full w-[280px] max-w-[85vw] flex-col bg-white shadow-card-lg transition-transform duration-300",
            open ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center justify-between px-6 py-6">
            <Link href={`/${locale}/admin`} className="block">
              <div className="text-xl font-semibold text-celsius-500">
                {t("admin.brand.title")}
              </div>
              <div className="text-xs text-ink-muted">{t("admin.brand.subtitle")}</div>
            </Link>
            <button
              type="button"
              aria-label={t("nav.closeMenu")}
              onClick={() => setOpen(false)}
              className="grid h-9 w-9 place-items-center rounded-full text-ink-muted transition hover:bg-canvas-soft hover:text-ink"
            >
              <X size={18} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-4" aria-label="Admin">
            <ul className="space-y-1">
              {items.map(({ key, Icon, href }) => {
                const active = isActive(href);
                return (
                  <li key={key}>
                    <Link
                      href={`/${locale}/admin${href}`}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition",
                        active
                          ? "bg-celsius-50 text-celsius-600"
                          : "text-ink-muted hover:bg-canvas-soft hover:text-ink"
                      )}
                    >
                      <Icon size={18} />
                      {t(`admin.nav.${key}`)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="p-4">
            <Link
              href={`/${locale}/admin/products/new`}
              onClick={() => setOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-celsius-500 px-5 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-celsius-600"
            >
              <Plus size={16} />
              {t("admin.addProduct")}
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
