"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronRight, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Locale } from "@/lib/i18n/settings";
import type { Product } from "@/lib/products/types";
import { ProductCard } from "./ProductCard";
import { ShopFilters, initialFilters, type ShopFilterState } from "./ShopFilters";
import { Pagination } from "./Pagination";
import { EmptyState, NoResults } from "./EmptyState";

const PAGE_SIZE = 9;

type Props = { locale: Locale; products: Product[] };

export function ShopBrowser({ locale, products }: Props) {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<ShopFilterState>(initialFilters);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (p.priceMkd > filters.maxPrice) return false;
      if (filters.brands.length && !filters.brands.includes(p.brand)) return false;
      if (filters.capacities.length && !filters.capacities.includes(p.capacityBtu)) return false;
      if (filters.energyClass && p.energyClass !== filters.energyClass) return false;
      if (q) {
        const hay = `${p.name} ${p.description} ${p.capacityBtu}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [products, filters, search]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  if (products.length === 0) {
    return (
      <div className="container py-12 md:py-16">
        <Header locale={locale} />
        <div className="mt-10">
          <EmptyState locale={locale} />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10 md:py-14">
      <Header locale={locale} />

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 lg:hidden">
        <SearchBox
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          placeholder={t("shop.searchPlaceholder")}
        />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <ShopFilters
            value={filters}
            onChange={(next) => {
              setFilters(next);
              setPage(1);
            }}
          />
        </div>

        <div className="lg:col-span-9 space-y-8">
          <div className="hidden lg:flex">
            <SearchBox
              value={search}
              onChange={(v) => {
                setSearch(v);
                setPage(1);
              }}
              placeholder={t("shop.searchPlaceholder")}
            />
          </div>

          {filtered.length === 0 ? (
            <NoResults />
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {visible.map((p) => (
                  <ProductCard key={p.id} product={p} locale={locale} />
                ))}
              </div>
              <Pagination page={safePage} pageCount={pageCount} onChange={setPage} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Header({ locale }: { locale: Locale }) {
  const { t } = useTranslation();
  return (
    <div>
      <nav className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
        <Link href={`/${locale}`} className="hover:text-celsius-500">
          {t("shop.breadcrumbHome")}
        </Link>
        <ChevronRight size={14} className="text-ink/30" />
        <span className="text-ink">{t("shop.breadcrumbShop")}</span>
      </nav>
      <h1 className="mt-3 heading-display text-ink">{t("shop.title")}</h1>
    </div>
  );
}

function SearchBox({
  value,
  onChange,
  placeholder
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative w-full max-w-xl">
      <Search
        size={16}
        className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-ink-muted"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full bg-canvas-soft py-3.5 pl-12 pr-5 text-sm text-ink placeholder:text-ink-muted ring-1 ring-transparent transition focus:bg-white focus:ring-celsius-300 focus:outline-none"
      />
    </div>
  );
}
