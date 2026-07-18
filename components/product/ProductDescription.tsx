"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

/** Height (px) of the collapsed preview on the product page. */
const COLLAPSED_MAX = 240;

type Block =
  | { type: "specs"; rows: { label: string; value: string }[] }
  | { type: "text"; text: string };

/**
 * Short "Label: value" line → a spec row. Prose sentences are long and rarely
 * split cleanly on an early colon, so the length guard keeps them out.
 */
function toSpecRow(line: string): { label: string; value: string } | null {
  if (line.length > 90) return null;
  const idx = line.indexOf(":");
  if (idx <= 0) return null;
  const label = line.slice(0, idx).trim();
  const value = line.slice(idx + 1).trim();
  if (!value || label.length > 60) return null;
  return { label, value };
}

/**
 * Turns a free-text description into ordered blocks: consecutive spec lines are
 * grouped into one table, everything else becomes a paragraph. Blank lines (the
 * stray "\n\n\n" gaps from pasted text) are dropped so nothing sprawls.
 */
function parseDescription(desc: string): Block[] {
  const lines = desc
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const blocks: Block[] = [];
  for (const line of lines) {
    const row = toSpecRow(line);
    if (row) {
      const last = blocks[blocks.length - 1];
      if (last && last.type === "specs") last.rows.push(row);
      else blocks.push({ type: "specs", rows: [row] });
    } else {
      blocks.push({ type: "text", text: line });
    }
  }
  return blocks;
}

export function ProductDescription({ text }: { text: string }) {
  const { t } = useTranslation();
  const blocks = useMemo(() => parseDescription(text), [text]);
  const ref = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);

  // Only offer a toggle when the full content is taller than the preview.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => setOverflowing(el.scrollHeight > COLLAPSED_MAX + 8);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [text]);

  return (
    <div className="mt-5">
      <div
        ref={ref}
        className="relative overflow-hidden"
        style={{ maxHeight: expanded ? undefined : COLLAPSED_MAX }}
      >
        <div className="space-y-4">
          {blocks.map((block, i) =>
            block.type === "specs" ? (
              <dl
                key={i}
                className="overflow-hidden rounded-2xl bg-canvas-soft ring-1 ring-ink/5"
              >
                {block.rows.map((row, j) => (
                  <div
                    key={j}
                    className="flex items-baseline justify-between gap-4 border-t border-ink/5 px-4 py-2.5 first:border-t-0"
                  >
                    <dt className="text-[13px] leading-snug text-ink-muted">
                      {row.label}
                    </dt>
                    <dd className="text-right text-[13px] font-semibold leading-snug text-ink">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p
                key={i}
                className="break-words text-[15px] leading-relaxed text-ink-soft"
              >
                {block.text}
              </p>
            )
          )}
        </div>

        {!expanded && overflowing && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
        )}
      </div>

      {(overflowing || expanded) && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className={cn(
            "mt-2 text-sm font-semibold text-celsius-500 transition hover:text-celsius-600"
          )}
        >
          {expanded ? t("product.readLess") : t("product.readMore")}
        </button>
      )}
    </div>
  );
}
