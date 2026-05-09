"use client";

import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const items = ["ai", "quiet", "filter"] as const;

export function TechBlock() {
  const { t } = useTranslation();
  return (
    <section className="section">
      <div className="container grid gap-12 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-6 grid grid-cols-2 gap-4">
          <CircuitArt />
          <InstallerArt />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-6"
        >
          <span className="eyebrow">{t("about.tech.eyebrow")}</span>
          <h2 className="mt-3 font-display text-3xl md:text-4xl font-semibold tracking-[-0.02em] text-ink">
            {t("about.tech.title")}
          </h2>
          <p className="mt-4 text-ink-muted">{t("about.tech.description")}</p>

          <ul className="mt-6 space-y-3">
            {items.map((key) => (
              <li key={key} className="flex items-start gap-3 text-ink">
                <CheckCircle2
                  size={20}
                  className="mt-0.5 shrink-0 text-celsius-500"
                  fill="#1B45FF"
                  stroke="#FFFFFF"
                />
                <span>{t(`about.tech.items.${key}`)}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}

function CircuitArt() {
  return (
    <div className="aspect-square overflow-hidden rounded-3xl bg-[#0B1020] ring-1 ring-ink/10">
      <svg viewBox="0 0 240 240" className="h-full w-full" aria-hidden>
        <defs>
          <linearGradient id="board" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0F2A1A" />
            <stop offset="1" stopColor="#0B1F12" />
          </linearGradient>
        </defs>
        <rect width="240" height="240" fill="#0B1020" />
        <rect x="30" y="30" width="180" height="180" rx="8" fill="url(#board)" stroke="#15401E" />
        <g stroke="#22C55E" strokeWidth="1.2" opacity="0.7" fill="none">
          {Array.from({ length: 8 }).map((_, i) => (
            <path
              key={i}
              d={`M${40 + i * 18} 50 L${40 + i * 18} ${100 + (i % 3) * 20} L${100 + i * 12} ${120 + (i % 2) * 20}`}
            />
          ))}
        </g>
        <rect x="80" y="100" width="80" height="60" rx="4" fill="#0B1020" stroke="#22C55E" />
        <text x="120" y="135" textAnchor="middle" fontFamily="monospace" fontSize="10" fill="#22C55E">CELSIUS</text>
        {[60, 90, 120, 150, 180].map((x) => (
          <circle key={x} cx={x} cy="200" r="3" fill="#FBBF24" />
        ))}
      </svg>
    </div>
  );
}

function InstallerArt() {
  return (
    <div className="aspect-square overflow-hidden rounded-3xl bg-canvas-soft ring-1 ring-ink/5">
      <svg viewBox="0 0 240 240" className="h-full w-full" aria-hidden preserveAspectRatio="xMidYMid slice">
        <rect width="240" height="240" fill="#EEF2F8" />
        <rect x="20" y="40" width="200" height="60" rx="8" fill="#FFFFFF" stroke="#CFD6E4" />
        <line x1="20" y1="70" x2="220" y2="70" stroke="#E2E7F2" />
        <g transform="translate(120 110)">
          <circle r="20" fill="#F4C29A" />
          <rect x="-22" y="20" width="44" height="60" rx="14" fill="#1F4FBF" />
          <rect x="-32" y="32" width="64" height="14" rx="6" fill="#F4C29A" />
        </g>
        <rect x="60" y="190" width="120" height="14" rx="4" fill="#9CA3AF" />
      </svg>
    </div>
  );
}
