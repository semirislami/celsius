"use client";

import { ArrowRight, Snowflake } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-soft-radial">
      <div className="container grid gap-12 py-16 md:py-24 lg:grid-cols-12 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="lg:col-span-6 flex flex-col justify-center"
        >
          <span className="eyebrow">{t("home.hero.eyebrow")}</span>
          <h1 className="mt-4 heading-display text-ink">
            {t("home.hero.titleLine1")}{" "}
            <span className="italic text-celsius-500">
              {t("home.hero.titleEmphasis")}
            </span>
            {t("home.hero.titleLine2")}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-muted md:text-lg">
            {t("home.hero.subtitle")}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button type="button" className="btn-primary">
              {t("home.hero.primaryCta")}
              <ArrowRight size={16} />
            </button>
            <button type="button" className="btn-secondary">
              {t("home.hero.secondaryCta")}
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="lg:col-span-6 relative"
        >
          <div className="relative mx-auto aspect-[5/4] w-full max-w-[560px]">
            <div className="absolute inset-0 rounded-[36px] bg-gradient-to-br from-celsius-50 via-white to-canvas-muted shadow-card-lg" />
            <div className="absolute inset-6 rounded-[28px] bg-white ring-1 ring-ink/5 shadow-card overflow-hidden">
              <HeroAcArt />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute -bottom-6 left-6 md:left-10 glass-badge rounded-2xl px-4 py-3 flex items-center gap-3"
            >
              <span className="grid h-9 w-9 place-items-center rounded-full bg-heating-100 text-heating-500">
                <Snowflake size={18} />
              </span>
              <div className="text-left">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                  {t("home.hero.badgeSubtitle")}
                </div>
                <div className="text-base font-semibold text-ink">
                  {t("home.hero.badgeTitle")}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function HeroAcArt() {
  return (
    <svg
      viewBox="0 0 560 460"
      className="h-full w-full"
      role="img"
      aria-hidden
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#F5F7FF" />
          <stop offset="1" stopColor="#E7ECFF" />
        </linearGradient>
        <linearGradient id="unit" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#E7ECF5" />
        </linearGradient>
        <radialGradient id="fan" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#1B45FF" stopOpacity="0.18" />
          <stop offset="1" stopColor="#1B45FF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="560" height="460" fill="url(#bg)" />
      <g transform="translate(120 90)">
        <rect width="320" height="220" rx="24" fill="url(#unit)" stroke="#D7DCEA" />
        <circle cx="160" cy="118" r="86" fill="url(#fan)" />
        <circle cx="160" cy="118" r="74" fill="#FFFFFF" stroke="#D7DCEA" />
        <g stroke="#9AA4BF" strokeWidth="2" strokeLinecap="round">
          <line x1="160" y1="50" x2="160" y2="186" />
          <line x1="92" y1="118" x2="228" y2="118" />
          <line x1="111" y1="69" x2="209" y2="167" />
          <line x1="209" y1="69" x2="111" y2="167" />
        </g>
        <circle cx="160" cy="118" r="10" fill="#1B45FF" />
        <rect x="20" y="186" width="280" height="14" rx="6" fill="#E2E7F2" />
      </g>
      <g opacity="0.6" stroke="#1B45FF" strokeWidth="1.5" strokeDasharray="4 6" fill="none">
        <path d="M40 360c40-30 80-30 120 0s80 30 120 0 80-30 120 0 80 30 120 0" />
      </g>
    </svg>
  );
}
