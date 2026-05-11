"use client";

import { useTranslation } from "react-i18next";
import type { Product } from "@/lib/products/types";

type Props = { product: Product };

export function Specs({ product }: Props) {
  const { t } = useTranslation();
  const s = product.specs ?? {};

  const performanceRows: KV[] = [
    { label: t("product.specs.power"), value: product.capacityBtu ? String(product.capacityBtu) : undefined }
  ];

  const leftRows: Row[] = [
    s.isInverter ? { bullet: t("product.specs.isInverter") } : null,
    kv(t("product.specs.maxPowerKw"), s.maxPowerKw),
    kv(t("product.specs.coolingHeatingPower"), s.coolingHeatingPower),
    kv(t("product.specs.coolingEnergyClass"), s.coolingEnergyClass),
    kv(t("product.specs.heatingEnergyClass"), s.heatingEnergyClass),
    kv(t("product.specs.airCirculation"), s.airCirculation),
    kv(t("product.specs.operatingTemp"), s.operatingTemp)
  ];

  const rightRows: Row[] = [
    kv(t("product.specs.seer"), s.seer),
    kv(t("product.specs.eer"), s.eer),
    kv(t("product.specs.scop"), s.scop),
    kv(t("product.specs.cop"), s.cop),
    kv(t("product.specs.noiseLevel"), s.noiseLevel),
    kv(t("product.specs.annualHeating"), s.annualConsumptionHeating),
    kv(t("product.specs.annualCooling"), s.annualConsumptionCooling)
  ];

  const includes: Row[] = s.installationKitIncluded
    ? [{ bullet: t("product.specs.installKit") }]
    : [];

  const anyLeft = compactRows(performanceRows).length > 0 || compactRows(leftRows).length > 0;
  const anyRight = compactRows(rightRows).length > 0 || includes.length > 0;
  if (!anyLeft && !anyRight) return null;

  return (
    <section className="section bg-canvas-soft">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-semibold uppercase tracking-[-0.01em] text-ink">
          {t("product.specs.title")}
        </h2>

        <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:items-start">
          <div className="space-y-6">
            {compactRows(performanceRows).length > 0 && (
              <Panel title={t("product.specPanel.performance")} rows={performanceRows} />
            )}
            {compactRows(leftRows).length > 0 && (
              <Panel title={t("product.specPanel.mainLeft")} rows={leftRows} />
            )}
          </div>

          <div className="space-y-6">
            {compactRows(rightRows).length > 0 && (
              <Panel title={t("product.specPanel.mainRight")} rows={rightRows} />
            )}
            {includes.length > 0 && (
              <Panel title={t("product.specPanel.includes")} rows={includes} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

type KV = { label: string; value?: string };
type BulletRow = { bullet: string };
type Row = KV | BulletRow | null;

function kv(label: string, value: string | undefined): KV {
  return { label, value };
}

function compactRows(rows: Row[]): Exclude<Row, null>[] {
  return rows.filter((r): r is Exclude<Row, null> => {
    if (!r) return false;
    if ("bullet" in r) return !!r.bullet;
    return !!r.value;
  });
}

function Panel({ title, rows }: { title: string; rows: Row[] }) {
  const visible = compactRows(rows);
  if (visible.length === 0) return null;
  return (
    <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-ink/5 shadow-card">
      <header className="border-b border-celsius-100 bg-celsius-50/60 px-5 py-3">
        <h3 className="text-sm font-semibold text-celsius-700">{title}</h3>
      </header>
      <ul className="divide-y divide-ink/5">
        {visible.map((r, i) => (
          <li key={i} className="px-5 py-3 text-sm text-ink">
            {"bullet" in r ? (
              <span className="flex items-baseline gap-2">
                <span className="text-celsius-500" aria-hidden>•</span>
                <span>{r.bullet}</span>
              </span>
            ) : (
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <span className="text-ink-soft">{r.label}</span>
                <span className="font-semibold text-ink">{r.value}</span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
