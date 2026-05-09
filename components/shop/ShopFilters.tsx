"use client";

import { useTranslation } from "react-i18next";
import { BRANDS, CAPACITIES, ENERGY_CLASSES, type Brand, type EnergyClass } from "@/lib/products/types";
import { formatMkd } from "@/lib/products/format";
import { cn } from "@/lib/utils";

export const PRICE_MIN = 15000;
export const PRICE_MAX = 85000;

export type ShopFilterState = {
  maxPrice: number;
  brands: Brand[];
  capacities: number[];
  energyClass: EnergyClass | null;
};

export const initialFilters: ShopFilterState = {
  maxPrice: PRICE_MAX,
  brands: [],
  capacities: [],
  energyClass: null
};

type Props = {
  value: ShopFilterState;
  onChange: (next: ShopFilterState) => void;
};

export function ShopFilters({ value, onChange }: Props) {
  const { t } = useTranslation();

  const toggleBrand = (b: Brand) => {
    const next = value.brands.includes(b)
      ? value.brands.filter((x) => x !== b)
      : [...value.brands, b];
    onChange({ ...value, brands: next });
  };
  const toggleCapacity = (c: number) => {
    const next = value.capacities.includes(c)
      ? value.capacities.filter((x) => x !== c)
      : [...value.capacities, c];
    onChange({ ...value, capacities: next });
  };

  return (
    <aside className="space-y-8 rounded-3xl bg-white p-6 shadow-card ring-1 ring-ink/5 lg:sticky lg:top-24">
      <Section label={t("shop.filters.price")}>
        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={1000}
          value={value.maxPrice}
          onChange={(e) => onChange({ ...value, maxPrice: Number(e.target.value) })}
          className="celsius-range w-full"
          aria-label={t("shop.filters.price")}
        />
        <div className="mt-2 flex justify-between text-xs text-ink-muted">
          <span>{formatMkd(PRICE_MIN)}</span>
          <span>{formatMkd(value.maxPrice)}</span>
        </div>
      </Section>

      <Section label={t("shop.filters.brand")}>
        <ul className="space-y-3">
          {BRANDS.map((b) => (
            <li key={b}>
              <label className="flex items-center gap-3 cursor-pointer text-sm text-ink-soft">
                <span
                  className={cn(
                    "grid h-5 w-5 place-items-center rounded-md border transition",
                    value.brands.includes(b)
                      ? "border-celsius-500 bg-celsius-500 text-white"
                      : "border-ink/20 bg-white"
                  )}
                  aria-hidden
                >
                  {value.brands.includes(b) && (
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6.5L4.8 9 10 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={value.brands.includes(b)}
                  onChange={() => toggleBrand(b)}
                />
                {t(`shop.filters.brands.${b}`)}
              </label>
            </li>
          ))}
        </ul>
      </Section>

      <Section label={t("shop.filters.capacity")}>
        <div className="grid grid-cols-2 gap-2">
          {CAPACITIES.map((c) => {
            const active = value.capacities.includes(c);
            return (
              <button
                key={c}
                type="button"
                onClick={() => toggleCapacity(c)}
                className={cn(
                  "rounded-xl px-3 py-2.5 text-sm font-semibold transition ring-1",
                  active
                    ? "bg-celsius-500 text-white ring-celsius-500"
                    : "bg-white text-ink-soft ring-ink/10 hover:ring-ink/20"
                )}
              >
                {c.toLocaleString("mk-MK").replace(/,/g, ".")}
              </button>
            );
          })}
        </div>
      </Section>

      <Section label={t("shop.filters.energyClass")}>
        <ul className="space-y-3">
          {ENERGY_CLASSES.map((cls) => {
            const active = value.energyClass === cls;
            return (
              <li key={cls}>
                <label className="flex items-center gap-3 cursor-pointer text-sm text-ink-soft">
                  <span
                    className={cn(
                      "grid h-5 w-5 place-items-center rounded-full border transition",
                      active ? "border-heating-500" : "border-ink/20"
                    )}
                    aria-hidden
                  >
                    {active && <span className="h-2.5 w-2.5 rounded-full bg-heating-500" />}
                  </span>
                  <input
                    type="radio"
                    name="energy-class"
                    className="sr-only"
                    checked={active}
                    onChange={() =>
                      onChange({ ...value, energyClass: active ? null : cls })
                    }
                  />
                  {t(`shop.filters.energy.${cls}`)}
                </label>
              </li>
            );
          })}
        </ul>
      </Section>

      <button
        type="button"
        onClick={() => onChange(initialFilters)}
        className="w-full rounded-full bg-canvas-soft px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted hover:bg-canvas-muted hover:text-ink"
      >
        {t("shop.filters.clear")}
      </button>
    </aside>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
        {label}
      </div>
      {children}
    </div>
  );
}
