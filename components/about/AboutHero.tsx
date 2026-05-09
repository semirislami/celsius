"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export function AboutHero() {
  const { t } = useTranslation();
  return (
    <section className="relative overflow-hidden bg-canvas-soft">
      <div className="container grid gap-12 py-16 md:py-24 lg:grid-cols-12 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7"
        >
          <span className="eyebrow">{t("about.eyebrow")}</span>
          <h1 className="mt-4 heading-display text-ink">{t("about.title")}</h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-muted md:text-lg">
            {t("about.description")}
          </p>

          <div className="mt-10 flex flex-wrap gap-10">
            <Stat
              value={t("about.stats.experience")}
              label={t("about.stats.experienceLabel")}
            />
            <Stat
              value={t("about.stats.clients")}
              label={t("about.stats.clientsLabel")}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="lg:col-span-5"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-[36px] bg-canvas shadow-card-lg">
            <RoomArt />
            <div className="absolute -bottom-4 left-6 right-6 glass-badge rounded-2xl px-5 py-3">
              <p className="text-sm italic text-ink">{t("about.imageQuote")}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-3xl font-semibold text-celsius-500">{value}</div>
      <div className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
        {label}
      </div>
    </div>
  );
}

function RoomArt() {
  return (
    <svg viewBox="0 0 400 500" className="h-full w-full" aria-hidden preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="room-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F4F6FB" />
          <stop offset="1" stopColor="#DCE3F0" />
        </linearGradient>
        <linearGradient id="window" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F1F5FF" />
          <stop offset="1" stopColor="#CDD7EE" />
        </linearGradient>
      </defs>
      <rect width="400" height="500" fill="url(#room-bg)" />
      <rect x="40" y="60" width="180" height="240" rx="6" fill="url(#window)" stroke="#B8C2D8" />
      <line x1="130" y1="60" x2="130" y2="300" stroke="#B8C2D8" />
      <line x1="40" y1="180" x2="220" y2="180" stroke="#B8C2D8" />
      <rect x="260" y="120" width="100" height="60" rx="10" fill="#FFFFFF" stroke="#C9D0E0" />
      <rect x="270" y="135" width="80" height="6" rx="3" fill="#E2E7F2" />
      <rect x="270" y="148" width="60" height="6" rx="3" fill="#E2E7F2" />
      <rect x="0" y="360" width="400" height="140" fill="#3F4A6B" />
      <g opacity="0.5" stroke="#FFFFFF" strokeWidth="2">
        <line x1="60" y1="210" x2="220" y2="320" />
        <line x1="220" y1="210" x2="60" y2="320" />
      </g>
    </svg>
  );
}
