"use client";

import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export function AboutCTA() {
  const { t } = useTranslation();
  return (
    <section className="pb-20 md:pb-24">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-celsius-gradient px-8 py-14 md:px-14 md:py-20 text-center"
        >
          <div className="pointer-events-none absolute inset-0 opacity-30 bg-[radial-gradient(800px_400px_at_50%_-20%,rgba(255,255,255,0.45),transparent)]" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="font-display text-3xl md:text-4xl lg:text-[44px] leading-[1.1] tracking-[-0.02em] font-semibold text-white">
              {t("about.cta.title")}
            </h2>
            <p className="mt-4 text-celsius-50/90">{t("about.cta.subtitle")}</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-celsius-700 transition hover:bg-celsius-50"
              >
                {t("about.cta.primary")}
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-celsius-700/40 ring-1 ring-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-celsius-700/60"
              >
                {t("about.cta.secondary")}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
