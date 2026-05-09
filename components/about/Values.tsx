"use client";

import { Leaf, Wrench, LifeBuoy, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

const items: {
  key: "sustainability" | "precision" | "support";
  Icon: LucideIcon;
  highlight?: boolean;
}[] = [
  { key: "sustainability", Icon: Leaf },
  { key: "precision", Icon: Wrench, highlight: true },
  { key: "support", Icon: LifeBuoy }
];

export function Values() {
  const { t } = useTranslation();
  return (
    <section className="section">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-[-0.02em] text-ink">
            {t("about.values.title")}
          </h2>
          <p className="mt-3 text-ink-muted">{t("about.values.subtitle")}</p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {items.map(({ key, Icon, highlight }, idx) => (
            <motion.article
              key={key}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className={cn(
                "rounded-3xl p-7 ring-1 transition-shadow",
                highlight
                  ? "bg-celsius-gradient text-white ring-celsius-700 shadow-card-lg"
                  : "bg-white text-ink ring-ink/5 shadow-card hover:shadow-card-lg"
              )}
            >
              <span
                className={cn(
                  "inline-flex h-11 w-11 items-center justify-center rounded-xl",
                  highlight
                    ? "bg-white/15 text-white"
                    : "bg-celsius-50 text-celsius-500"
                )}
              >
                <Icon size={20} />
              </span>
              <h3 className={cn("mt-5 text-lg font-semibold", highlight ? "text-white" : "text-ink")}>
                {t(`about.values.items.${key}.title`)}
              </h3>
              <p
                className={cn(
                  "mt-2 text-sm leading-relaxed",
                  highlight ? "text-white/80" : "text-ink-muted"
                )}
              >
                {t(`about.values.items.${key}.body`)}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
