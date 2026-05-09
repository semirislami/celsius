"use client";

import { useTranslation } from "react-i18next";

export function HoursCard() {
  const { t } = useTranslation();
  const rows = [
    { label: t("contact.hours.weekdays"), value: t("contact.hours.weekdaysValue") },
    { label: t("contact.hours.saturday"), value: t("contact.hours.saturdayValue") },
    { label: t("contact.hours.sunday"), value: t("contact.hours.sundayValue") }
  ];
  return (
    <div className="overflow-hidden rounded-3xl bg-celsius-gradient p-7 text-white shadow-card-lg">
      <h3 className="text-lg font-semibold">{t("contact.hours.title")}</h3>
      <ul className="mt-5 divide-y divide-white/15">
        {rows.map((r) => (
          <li key={r.label} className="flex items-center justify-between py-3 text-sm">
            <span className="text-celsius-50/90">{r.label}</span>
            <span className="font-semibold">{r.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
