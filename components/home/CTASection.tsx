"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export function CTASection() {
  const { t } = useTranslation();

  return (
    <section className="pb-20 md:pb-24">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-celsius-gradient px-8 py-12 md:px-14 md:py-16"
        >
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-12 h-72 w-72 rounded-full bg-celsius-300/30 blur-2xl" />

          <div className="relative max-w-2xl">
            <h2 className="font-display text-3xl md:text-4xl lg:text-[44px] leading-[1.1] tracking-[-0.02em] font-semibold text-white">
              {t("home.cta.title")}
            </h2>
            <p className="mt-4 max-w-lg text-celsius-50/90">
              {t("home.cta.subtitle")}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button type="button" className="btn-orange">
                {t("home.cta.primary")}
                <ArrowRight size={16} />
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-celsius-700 transition hover:bg-celsius-50"
              >
                {t("home.cta.secondary")}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
