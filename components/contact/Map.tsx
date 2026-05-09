"use client";

import { MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

export function Map() {
  const { t } = useTranslation();
  return (
    <div className="relative aspect-[16/7] overflow-hidden rounded-3xl bg-canvas-muted ring-1 ring-ink/5">
      <MapArt />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-celsius-500 text-white shadow-card-lg ring-4 ring-white">
          <MapPin size={20} />
        </span>
      </div>
      <div className="absolute left-6 bottom-6 rounded-2xl bg-white p-4 shadow-card ring-1 ring-ink/5">
        <div className="text-sm font-semibold text-celsius-500">
          {t("contact.map.title")}
        </div>
        <div className="text-xs text-ink-muted">{t("contact.map.subtitle")}</div>
      </div>
    </div>
  );
}

function MapArt() {
  return (
    <svg viewBox="0 0 1200 520" className="h-full w-full" aria-hidden preserveAspectRatio="xMidYMid slice">
      <rect width="1200" height="520" fill="#9CA3AF" />
      <g stroke="#FFFFFF" strokeWidth="3" opacity="0.5">
        {Array.from({ length: 20 }).map((_, i) => (
          <line key={`h-${i}`} x1="0" y1={i * 30} x2="1200" y2={i * 30 - 60} />
        ))}
        {Array.from({ length: 24 }).map((_, i) => (
          <line key={`v-${i}`} x1={i * 60} y1="0" x2={i * 60 - 80} y2="520" />
        ))}
      </g>
      <g stroke="#FFFFFF" strokeWidth="6" opacity="0.85" fill="none">
        <path d="M0 280 C 200 240, 400 320, 600 260 S 1000 220, 1200 270" />
        <path d="M120 0 C 200 200, 280 360, 360 520" />
        <path d="M820 0 C 760 200, 700 360, 640 520" />
      </g>
    </svg>
  );
}
