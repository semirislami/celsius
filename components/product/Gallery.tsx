"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = { images: string[]; alt: string };

export function Gallery({ images, alt }: Props) {
  const photos = images.filter(Boolean);
  const [active, setActive] = useState(0);
  const index = Math.min(active, Math.max(0, photos.length - 1));
  const current = photos[index] ?? "";
  const hasMany = photos.length > 1;

  const go = (dir: number) =>
    setActive((i) => {
      const n = photos.length;
      if (n === 0) return 0;
      return (i + dir + n) % n;
    });

  return (
    <div className="min-w-0 space-y-3">
      <div className="group relative aspect-[4/3] overflow-hidden rounded-3xl bg-canvas-soft ring-1 ring-ink/5">
        {current ? (
          <Image
            key={current}
            src={current}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 600px, 90vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            priority
          />
        ) : (
          <div className="grid h-full place-items-center text-ink-muted">—</div>
        )}

        {hasMany && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-ink shadow-card ring-1 ring-ink/5 backdrop-blur transition hover:bg-white opacity-0 group-hover:opacity-100 focus:opacity-100"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-ink shadow-card ring-1 ring-ink/5 backdrop-blur transition hover:bg-white opacity-0 group-hover:opacity-100 focus:opacity-100"
            >
              <ChevronRight size={18} />
            </button>
            <div className="absolute bottom-3 right-3 rounded-full bg-ink/70 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
              {index + 1} / {photos.length}
            </div>
          </>
        )}
      </div>

      {hasMany && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {photos.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View photo ${i + 1}`}
              className={`relative aspect-square h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-canvas-soft transition ${
                i === index
                  ? "ring-2 ring-celsius-500"
                  : "ring-1 ring-ink/10 hover:ring-celsius-300"
              }`}
            >
              <Image src={src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
