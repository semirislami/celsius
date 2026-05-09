"use client";

import { useTranslation } from "react-i18next";
import type { Product } from "@/lib/products/types";

const rows = ["cooling", "heating", "energy", "seer", "temp", "noise", "gas", "wifi"] as const;

type Props = { product: Product };

export function Specs({ product }: Props) {
  const { t } = useTranslation();
  const s = product.specs ?? {};

  const valueFor = (key: (typeof rows)[number]): string => {
    if (key === "energy") return product.energyClass;
    const k = key as keyof typeof s;
    return (s[k] && String(s[k])) || t(`product.specs.rows.${key}.value`);
  };

  return (
    <section className="section bg-canvas-soft">
      <div className="container">
        <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-[-0.02em] text-ink">
          {t("product.specs.title")}
        </h2>

        <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-ink/5">
              <table className="w-full text-sm">
                <tbody>
                  {rows.map((key, i) => {
                    const value = valueFor(key);
                    const isEnergy = key === "energy";
                    return (
                      <tr
                        key={key}
                        className={i !== rows.length - 1 ? "border-b border-ink/5" : ""}
                      >
                        <th
                          scope="row"
                          className="bg-canvas-soft px-5 py-4 text-left font-medium text-ink-soft"
                        >
                          {t(`product.specs.rows.${key}.label`)}
                        </th>
                        <td className="px-5 py-4 text-ink">
                          {isEnergy ? (
                            <span className="inline-flex items-center rounded-md bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-700">
                              {value}
                            </span>
                          ) : (
                            value
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-3xl bg-white p-6 ring-1 ring-ink/5 shadow-card">
              <FamilyArt />
              <blockquote className="mt-5 italic text-ink">
                &ldquo;{t("product.specs.quote")}&rdquo;
              </blockquote>
              <div className="mt-2 text-sm text-ink-muted">
                {t("product.specs.quoteAuthor")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FamilyArt() {
  return (
    <svg viewBox="0 0 400 240" className="h-44 w-full" aria-hidden>
      <defs>
        <radialGradient id="fam-bg" cx="0.5" cy="0.5" r="0.6">
          <stop offset="0" stopColor="#DCE3FF" />
          <stop offset="1" stopColor="#F4F6FB" />
        </radialGradient>
      </defs>
      <rect width="400" height="240" rx="18" fill="url(#fam-bg)" />
      <g transform="translate(60 60)">
        <circle cx="40" cy="40" r="20" fill="#F59E0B" />
        <rect x="22" y="60" width="36" height="60" rx="10" fill="#0EA5E9" />
        <circle cx="100" cy="36" r="22" fill="#FCA5A5" />
        <rect x="80" y="58" width="40" height="62" rx="10" fill="#EF4444" />
        <circle cx="160" cy="42" r="18" fill="#FBBF24" />
        <rect x="144" y="60" width="32" height="56" rx="10" fill="#22C55E" />
        <circle cx="220" cy="36" r="22" fill="#FDA4AF" />
        <rect x="200" y="58" width="40" height="62" rx="10" fill="#F97316" />
      </g>
    </svg>
  );
}
