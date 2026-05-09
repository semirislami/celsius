"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { locales, type Locale, isLocale } from "@/lib/i18n/settings";
import { cn } from "@/lib/utils";

type Props = {
  locale: Locale;
  className?: string;
};

const labels: Record<Locale, string> = {
  mk: "Macedonian",
  sq: "Albanian"
};

export function LanguageSwitcher({ locale, className }: Props) {
  const pathname = usePathname() ?? "/";

  const swappedPaths = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    const first = segments[0];
    const rest = isLocale(first) ? segments.slice(1) : segments;
    const restPath = rest.length ? `/${rest.join("/")}` : "";
    return Object.fromEntries(
      locales.map((l) => [l, `/${l}${restPath}`])
    ) as Record<Locale, string>;
  }, [pathname]);

  return (
    <div
      className={cn(
        "flex items-center gap-3 text-sm font-medium",
        className
      )}
      role="group"
      aria-label="Language switcher"
    >
      {locales.map((l, idx) => (
        <span key={l} className="flex items-center gap-3">
          <Link
            href={swappedPaths[l]}
            aria-current={l === locale ? "true" : undefined}
            className={cn(
              "transition-colors",
              l === locale
                ? "text-celsius-500 underline decoration-celsius-500 decoration-2 underline-offset-[6px]"
                : "text-ink-muted hover:text-ink"
            )}
          >
            {labels[l]}
          </Link>
          {idx < locales.length - 1 && (
            <span className="h-3 w-px bg-ink/15" aria-hidden />
          )}
        </span>
      ))}
    </div>
  );
}
