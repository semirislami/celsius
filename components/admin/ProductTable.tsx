"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { formatMkd } from "@/lib/products/format";
import type { Locale } from "@/lib/i18n/settings";
import type { Product } from "@/lib/products/types";
import { brandLabel } from "@/lib/products/types";

type Props = { locale: Locale; products: Product[] };

export function ProductTable({ locale, products }: Props) {
  const { t } = useTranslation();
  const router = useRouter();

  // Local state so the row disappears immediately after a successful delete —
  // doesn't depend on router.refresh propagating the server-side change.
  const [items, setItems] = useState<Product[]>(products);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Re-sync if the parent passes a new list (after router.refresh).
  useEffect(() => {
    setItems(products);
  }, [products]);

  const handleDelete = async (id: string) => {
    if (!window.confirm(t("admin.form.deleteConfirm"))) return;
    setDeletingId(id);
    setError(null);
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        cache: "no-store"
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error || `Delete failed (${res.status})`);
      }
      // Optimistically remove + ask Next to refetch server data.
      setItems((prev) => prev.filter((p) => p.id !== id));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("admin.form.errors.generic"));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <article className="rounded-3xl bg-white shadow-card ring-1 ring-ink/5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/5 px-6 py-5">
        <div>
          <h3 className="text-lg font-semibold text-ink">{t("admin.products.title")}</h3>
          <p className="mt-1 text-sm text-ink-muted">{t("admin.products.subtitle")}</p>
        </div>
        <Link
          href={`/${locale}/admin/products/new`}
          className="inline-flex items-center gap-2 rounded-full bg-celsius-500 px-4 py-2 text-sm font-semibold text-white shadow-card transition hover:bg-celsius-600"
        >
          <Plus size={15} />
          {t("admin.addProduct")}
        </Link>
      </div>

      {error && (
        <div className="border-b border-ink/5 bg-rose-50 px-6 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {items.length === 0 ? (
        <div className="px-6 py-12 text-center text-sm text-ink-muted">
          {t("admin.products2.empty")}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
                <th className="px-6 py-4">{t("admin.products.cols.product")}</th>
                <th className="px-6 py-4">{t("admin.products.cols.status")}</th>
                <th className="px-6 py-4">{t("admin.products.cols.price")}</th>
                <th className="px-6 py-4 text-right">{t("admin.products.cols.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p, i) => (
                <tr
                  key={p.id}
                  className={cn(
                    i !== items.length - 1 && "border-b border-ink/5",
                    deletingId === p.id && "opacity-50"
                  )}
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl ring-1 ring-ink/5 bg-canvas-muted">
                        {p.imageUrl && (
                          <Image
                            src={p.imageUrl}
                            alt=""
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/${locale}/admin/products/${p.id}/edit`}
                          className="block truncate font-semibold text-ink hover:text-celsius-500"
                        >
                          {p.name}
                        </Link>
                        <div className="text-xs text-ink-muted">
                          {brandLabel(p.brand)} ·{" "}
                          {p.capacityBtu.toLocaleString("mk-MK").replace(/,/g, ".")} BTU
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                      {t("admin.products.status.inStock")}
                    </span>
                  </td>
                  <td className="px-6 py-5 font-semibold text-ink">
                    {formatMkd(p.priceMkd)} {t("common.currency")}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="inline-flex items-center gap-2">
                      <Link
                        href={`/${locale}/admin/products/${p.id}/edit`}
                        aria-label={t("admin.products2.edit")}
                        className="grid h-9 w-9 place-items-center rounded-full text-ink-muted hover:bg-canvas-soft hover:text-celsius-500"
                      >
                        <Pencil size={15} />
                      </Link>
                      <button
                        type="button"
                        aria-label={t("admin.products2.delete")}
                        disabled={deletingId === p.id}
                        onClick={() => handleDelete(p.id)}
                        className="grid h-9 w-9 place-items-center rounded-full text-ink-muted transition hover:bg-rose-50 hover:text-rose-500 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deletingId === p.id ? (
                          <Loader2 size={15} className="animate-spin" />
                        ) : (
                          <Trash2 size={15} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </article>
  );
}
