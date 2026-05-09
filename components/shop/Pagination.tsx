"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
};

export function Pagination({ page, pageCount, onChange }: Props) {
  if (pageCount <= 1) return null;
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);

  return (
    <nav className="flex items-center justify-center gap-2" aria-label="Pagination">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page <= 1}
        className="grid h-10 w-10 place-items-center rounded-full bg-canvas-muted text-ink-muted disabled:opacity-40 hover:bg-canvas-soft hover:text-ink"
        aria-label="Previous"
      >
        <ChevronLeft size={16} />
      </button>
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          aria-current={p === page ? "page" : undefined}
          className={cn(
            "h-10 w-10 rounded-full text-sm font-semibold transition",
            p === page
              ? "bg-celsius-500 text-white shadow-card"
              : "bg-canvas-muted text-ink-muted hover:bg-canvas-soft hover:text-ink"
          )}
        >
          {p}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onChange(Math.min(pageCount, page + 1))}
        disabled={page >= pageCount}
        className="grid h-10 w-10 place-items-center rounded-full bg-canvas-muted text-ink-muted disabled:opacity-40 hover:bg-canvas-soft hover:text-ink"
        aria-label="Next"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
