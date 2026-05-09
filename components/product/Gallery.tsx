"use client";

import Image from "next/image";

type Props = { imageUrl: string; alt: string };

export function Gallery({ imageUrl, alt }: Props) {
  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-canvas-soft ring-1 ring-ink/5">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 600px, 90vw"
            className="object-cover"
            priority
          />
        ) : (
          <div className="grid h-full place-items-center text-ink-muted">—</div>
        )}
      </div>
    </div>
  );
}
