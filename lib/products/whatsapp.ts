import type { Locale } from "@/lib/i18n/settings";
import type { Product } from "./types";
import { brandLabel } from "./types";

export const WHATSAPP_NUMBER = "38972244291";

function formatMkdLocal(n: number): string {
  return n.toLocaleString("mk-MK").replace(/,/g, ".");
}

type Labels = {
  greeting: string;
  priceLabel: string;
  oldPrice: string;
  capacity: string;
  brand: string;
  currency: string;
  inverter: string;
  installKit: string;
  techDetails: string;
  maxPower: string;
  coolingHeating: string;
  coolingClass: string;
  heatingClass: string;
  airCirc: string;
  opTemp: string;
  noise: string;
  annualH: string;
  annualC: string;
};

const LABELS_MK: Labels = {
  greeting: "Здраво! Заинтересиран сум за нарачка:",
  priceLabel: "Цена",
  oldPrice: "стара",
  capacity: "Капацитет",
  brand: "Бренд",
  currency: "ден.",
  inverter: "✓ Со инвертер технологија",
  installKit: "✓ Со кит за монтажа",
  techDetails: "Технички детали:",
  maxPower: "Моќност до",
  coolingHeating: "Моќност ладење/греење",
  coolingClass: "Енергетска класа (ладење)",
  heatingClass: "Енергетска класа (греење)",
  airCirc: "Циркулација на воздух",
  opTemp: "Работна температура",
  noise: "Ниво на бучава",
  annualH: "Годишна потрошувачка (греење)",
  annualC: "Годишна потрошувачка (ладење)"
};

const LABELS_SQ: Labels = {
  greeting: "Përshëndetje! Jam i interesuar të porosis:",
  priceLabel: "Çmimi",
  oldPrice: "i vjetër",
  capacity: "Kapaciteti",
  brand: "Marka",
  currency: "den.",
  inverter: "✓ Me teknologji inverter",
  installKit: "✓ Me kit instalimi të përfshirë",
  techDetails: "Detajet teknike:",
  maxPower: "Fuqia maksimale",
  coolingHeating: "Fuqia ftohje/ngrohje",
  coolingClass: "Klasa energjetike (ftohje)",
  heatingClass: "Klasa energjetike (ngrohje)",
  airCirc: "Qarkullimi i ajrit",
  opTemp: "Temperatura e punës",
  noise: "Niveli i zhurmës",
  annualH: "Konsumi vjetor (ngrohje)",
  annualC: "Konsumi vjetor (ftohje)"
};

export function buildWhatsAppOrderUrl(
  product: Product,
  locale: Locale,
  origin: string = ""
): string {
  const L = locale === "sq" ? LABELS_SQ : LABELS_MK;
  const productUrl = `${origin}/${locale}/shop/${product.slug}`;

  const lines: string[] = [];
  lines.push(L.greeting, "");
  lines.push(`📦 ${product.name}`);

  let priceLine = `💰 ${L.priceLabel}: ${formatMkdLocal(product.priceMkd)} ${L.currency}`;
  if (product.oldPriceMkd) {
    priceLine += ` (${L.oldPrice}: ${formatMkdLocal(product.oldPriceMkd)} ${L.currency})`;
  }
  lines.push(priceLine);
  lines.push(`⚡ ${L.capacity}: ${product.capacityBtu} BTU`);
  lines.push(`🏷️ ${L.brand}: ${brandLabel(product.brand)}`);

  const s = product.specs ?? {};
  const flags: string[] = [];
  if (s.isInverter) flags.push(L.inverter);
  if (s.installationKitIncluded) flags.push(L.installKit);
  if (flags.length) {
    lines.push("");
    lines.push(...flags);
  }

  const tech: string[] = [];
  if (s.maxPowerKw) tech.push(`• ${L.maxPower}: ${s.maxPowerKw}`);
  if (s.coolingHeatingPower) tech.push(`• ${L.coolingHeating}: ${s.coolingHeatingPower}`);
  if (s.coolingEnergyClass) tech.push(`• ${L.coolingClass}: ${s.coolingEnergyClass}`);
  if (s.heatingEnergyClass) tech.push(`• ${L.heatingClass}: ${s.heatingEnergyClass}`);
  if (s.airCirculation) tech.push(`• ${L.airCirc}: ${s.airCirculation}`);
  if (s.operatingTemp) tech.push(`• ${L.opTemp}: ${s.operatingTemp}`);
  if (s.seer) tech.push(`• SEER: ${s.seer}`);
  if (s.eer) tech.push(`• EER: ${s.eer}`);
  if (s.scop) tech.push(`• SCOP: ${s.scop}`);
  if (s.cop) tech.push(`• COP: ${s.cop}`);
  if (s.noiseLevel) tech.push(`• ${L.noise}: ${s.noiseLevel}`);
  if (s.annualConsumptionHeating) tech.push(`• ${L.annualH}: ${s.annualConsumptionHeating}`);
  if (s.annualConsumptionCooling) tech.push(`• ${L.annualC}: ${s.annualConsumptionCooling}`);

  if (tech.length) {
    lines.push("");
    lines.push(L.techDetails);
    lines.push(...tech);
  }

  if (productUrl) {
    lines.push("");
    lines.push(`🔗 ${productUrl}`);
  }

  const message = lines.join("\n");
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
