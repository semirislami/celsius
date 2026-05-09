"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";

const items = ["ivanov", "stojanova"] as const;

export function Testimonials() {
  const { t } = useTranslation();

  return (
    <section className="section">
      <div className="container">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-[-0.02em] text-ink">
              {t("home.testimonials.title")}
            </h2>
            <div className="mt-3 flex items-center gap-1 text-heating-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} fill="currentColor" strokeWidth={0} />
              ))}
            </div>
            <p className="mt-4 max-w-sm text-ink-muted">
              {t("home.testimonials.subtitle")}
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <Stat
                value={t("home.testimonials.stats.installs")}
                label={t("home.testimonials.stats.installsLabel")}
              />
              <Stat
                value={t("home.testimonials.stats.rating")}
                label={t("home.testimonials.stats.ratingLabel")}
              />
            </div>
          </div>

          <div className="md:col-span-8 grid gap-5 md:grid-cols-2">
            {items.map((key, idx) => (
              <motion.figure
                key={key}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="rounded-3xl bg-canvas-soft p-7 ring-1 ring-ink/5"
              >
                <blockquote className="text-base italic leading-relaxed text-ink">
                  &ldquo;{t(`home.testimonials.items.${key}.quote`)}&rdquo;
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-celsius-100 text-xs font-semibold text-celsius-700">
                    {t(`home.testimonials.items.${key}.author`)
                      .split(" ")
                      .map((s) => s[0])
                      .join("")}
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-ink">
                      {t(`home.testimonials.items.${key}.author`)}
                    </div>
                    <div className="text-xs text-ink-muted">
                      {t(`home.testimonials.items.${key}.city`)}
                    </div>
                  </div>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-canvas-soft px-4 py-3">
      <div className="text-2xl font-semibold text-ink">{value}</div>
      <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
        {label}
      </div>
    </div>
  );
}
