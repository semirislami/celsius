"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";

export function InfoCard() {
  const { t } = useTranslation();
  return (
    <div className="rounded-3xl bg-white p-7 shadow-card ring-1 ring-ink/5">
      <h3 className="text-lg font-semibold text-ink">{t("contact.info.title")}</h3>

      <ul className="mt-6 space-y-5">
        <Row
          icon={<Phone size={18} />}
          tone="bg-celsius-50 text-celsius-500"
          label={t("contact.info.phoneLabel")}
          value={t("contact.info.phoneValue")}
        />
        <Row
          icon={<Mail size={18} />}
          tone="bg-heating-50 text-heating-500"
          label={t("contact.info.emailLabel")}
          value={t("contact.info.emailValue")}
        />
        <Row
          icon={<MapPin size={18} />}
          tone="bg-celsius-50 text-celsius-500"
          label={t("contact.info.addressLabel")}
          value={t("contact.info.addressValue")}
        />
      </ul>
    </div>
  );
}

function Row({
  icon,
  tone,
  label,
  value
}: {
  icon: React.ReactNode;
  tone: string;
  label: string;
  value: string;
}) {
  return (
    <li className="flex items-start gap-4">
      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${tone}`}>
        {icon}
      </span>
      <div className="min-w-0">
        <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
          {label}
        </div>
        <div className="mt-1 text-sm font-medium leading-relaxed text-ink">{value}</div>
      </div>
    </li>
  );
}
