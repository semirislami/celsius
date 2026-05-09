"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Boxes, Plus, Settings, ShoppingCart, type LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Locale } from "@/lib/i18n/settings";
import { cn } from "@/lib/utils";

type Props = { locale: Locale };

const items: { key: "analytics" | "products" | "orders" | "settings"; Icon: LucideIcon; href: string }[] = [
  { key: "analytics", Icon: BarChart3, href: "" },
  { key: "products", Icon: Boxes, href: "/products" },
  { key: "orders", Icon: ShoppingCart, href: "/orders" },
  { key: "settings", Icon: Settings, href: "/settings" }
];

export function AdminSidebar({ locale }: Props) {
  const { t } = useTranslation();
  const pathname = usePathname() ?? "";
  const adminBase = `/${locale}/admin`;
  const sub = pathname.startsWith(adminBase) ? pathname.slice(adminBase.length) : "";

  const isActive = (href: string) => {
    if (href === "") return sub === "" || sub === "/";
    return sub === href || sub.startsWith(`${href}/`);
  };

  return (
    <aside className="hidden lg:flex flex-col border-r border-ink/5 bg-white">
      <div className="px-6 py-7">
        <Link href={`/${locale}/admin`} className="block">
          <div className="text-xl font-semibold text-celsius-500">
            {t("admin.brand.title")}
          </div>
          <div className="text-xs text-ink-muted">{t("admin.brand.subtitle")}</div>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-2" aria-label="Admin">
        <ul className="space-y-1">
          {items.map(({ key, Icon, href }) => {
            const active = isActive(href);
            return (
              <li key={key}>
                <Link
                  href={`/${locale}/admin${href}`}
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
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-celsius-500 px-5 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-celsius-600"
        >
          <Plus size={16} />
          {t("admin.addProduct")}
        </Link>
      </div>
    </aside>
  );
}
