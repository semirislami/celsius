"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

/**
 * Product description that stays compact on phones: it clamps to a few lines
 * so the price and the order button remain reachable, and reveals the full
 * text on tap. Long unbroken tokens wrap instead of overflowing the card.
 */
export function ProductDescription({ text }: { text: string }) {
  const { t } = useTranslation();
  const ref = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);

  // Detect whether the clamped text actually gets cut off — only then is a
  // toggle worth showing. Re-check on resize since the line count shifts.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => {
      if (expanded) return;
      setOverflowing(el.scrollHeight - el.clientHeight > 4);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [text, expanded]);

  return (
    <div className="mt-4">
      <p
        ref={ref}
        className={cn(
          "whitespace-pre-line break-words text-sm leading-relaxed text-ink-muted sm:text-base",
          !expanded && "line-clamp-4"
        )}
      >
        {text}
      </p>
      {(overflowing || expanded) && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="mt-1.5 text-sm font-semibold text-celsius-500 transition hover:text-celsius-600"
        >
          {expanded ? t("product.readLess") : t("product.readMore")}
        </button>
      )}
    </div>
  );
}
