"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export function ContactHero() {
  const { t } = useTranslation();
  return (
    <section className="bg-canvas">
      <div className="container grid gap-10 py-12 md:py-16 lg:grid-cols-12 lg:gap-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-6 flex flex-col justify-center"
        >
          <span className="eyebrow">{t("contact.eyebrow")}</span>
          <h1 className="mt-4 heading-display text-ink">
            {t("contact.titleLine1")}{" "}
            <span className="text-celsius-500">{t("contact.titleEmphasis")}</span>
            {t("contact.titleLine2")}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-muted md:text-lg">
            {t("contact.description")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="lg:col-span-6"
        >
          <div className="relative aspect-[5/4] overflow-hidden rounded-[28px] bg-canvas-soft shadow-card-lg">
            <OfficeArt />
            <div className="absolute right-6 bottom-6 rounded-2xl bg-celsius-500 px-5 py-3 text-white shadow-card-lg">
              <div className="text-2xl font-semibold leading-none">
                {t("contact.support.label")}
              </div>
              <div className="mt-1 text-xs text-celsius-50/90">
                {t("contact.support.sublabel")}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function OfficeArt() {
  return (
    <svg viewBox="0 0 600 480" className="h-full w-full" aria-hidden preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1F2937" />
          <stop offset="1" stopColor="#0F172A" />
        </linearGradient>
        <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E2E8F0" />
          <stop offset="1" stopColor="#CBD5E1" />
        </linearGradient>
      </defs>
      <rect width="600" height="320" fill="url(#wall)" />
      <rect y="320" width="600" height="160" fill="url(#floor)" />
      {[40, 180, 320, 460].map((x) => (
        <g key={x}>
          <rect x={x} y="60" width="100" height="200" fill="#F1F5FF" stroke="#A8B4CC" />
          <line x1={x + 50} y1="60" x2={x + 50} y2="260" stroke="#A8B4CC" />
        </g>
      ))}
      <g>
        <rect x="160" y="350" width="120" height="60" rx="4" fill="#1F2937" />
        <rect x="180" y="320" width="80" height="36" rx="3" fill="#0B1020" />
      </g>
      <g>
        <rect x="320" y="350" width="120" height="60" rx="4" fill="#1F2937" />
        <rect x="340" y="320" width="80" height="36" rx="3" fill="#0B1020" />
      </g>
      <g>
        <ellipse cx="120" cy="420" rx="20" ry="6" fill="#000000" opacity="0.3" />
        <rect x="108" y="380" width="24" height="40" rx="6" fill="#0B1020" />
      </g>
    </svg>
  );
}
