"use client";

import { motion } from "framer-motion";
import { Leaf, Smartphone, VolumeX, type LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

const items: { key: "energy" | "smart" | "quiet"; Icon: LucideIcon; tone: string }[] = [
  { key: "energy", Icon: Leaf, tone: "bg-celsius-50 text-celsius-500" },
  { key: "smart", Icon: Smartphone, tone: "bg-heating-50 text-heating-500" },
  { key: "quiet", Icon: VolumeX, tone: "bg-celsius-50 text-celsius-500" }
];

export function Features() {
  const { t } = useTranslation();

  return (
    <section className="section bg-canvas-soft">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-[-0.02em] text-ink">
            {t("home.features.title")}
          </h2>
          <p className="mt-4 text-ink-muted">
            {t("home.features.subtitle")}
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {items.map(({ key, Icon, tone }, idx) => (
            <motion.article
              key={key}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="rounded-3xl bg-white p-7 shadow-card ring-1 ring-ink/5 transition-shadow hover:shadow-card-lg"
            >
              <span className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${tone}`}>
                <Icon size={20} />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-ink">
                {t(`home.features.items.${key}.title`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {t(`home.features.items.${key}.body`)}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
