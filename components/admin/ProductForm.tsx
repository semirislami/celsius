"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ArrowLeft, ImagePlus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Locale } from "@/lib/i18n/settings";
import { BRANDS, CAPACITIES, type Product } from "@/lib/products/types";
import { uploadProductImage } from "@/lib/products/uploadClient";

type Mode = { kind: "create" } | { kind: "edit"; product: Product };

type Props = {
  locale: Locale;
  mode: Mode;
};

// energyClass is not exposed in the form anymore. We still send a default
// because the DB column is NOT NULL and the API validates it.
const DEFAULT_ENERGY_CLASS = "A+++";

export function ProductForm({ locale, mode }: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  const isEdit = mode.kind === "edit";
  const initial = isEdit ? mode.product : null;

  // ---- core fields ----
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [priceMkd, setPriceMkd] = useState<string>(
    initial ? String(initial.priceMkd) : ""
  );
  const [oldPriceMkd, setOldPriceMkd] = useState<string>(
    initial?.oldPriceMkd ? String(initial.oldPriceMkd) : ""
  );
  const [capacityBtu, setCapacityBtu] = useState<string>(
    initial ? String(initial.capacityBtu) : "12000"
  );
  const initialBrand =
    initial?.brand && (BRANDS as readonly string[]).includes(initial.brand)
      ? initial.brand
      : "vivax";
  const [brand, setBrand] = useState<string>(initialBrand);

  // Technical specs are no longer edited here. Existing values are preserved
  // untouched on edit (passthrough) so older products keep their data.
  const existingSpecs = initial?.specs;

  // ---- image ----
  const [imagePreview, setImagePreview] = useState<string | null>(initial?.imageUrl ?? null);
  const fileRef = useRef<HTMLInputElement>(null);

  // ---- submit state ----
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File | null) => {
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const fd = new FormData(e.currentTarget);
      const file = fd.get("image");
      const hasNewFile = file instanceof File && file.size > 0;

      let imageUrl = initial?.imageUrl ?? "";
      if (hasNewFile) {
        const result = await uploadProductImage(file as File);
        imageUrl = result.publicUrl;
      } else if (!isEdit) {
        throw new Error(t("admin.form.errors.image"));
      }

      const payload: Record<string, unknown> = {
        name,
        slug,
        description,
        priceMkd: Number(priceMkd),
        oldPriceMkd: oldPriceMkd ? Number(oldPriceMkd) : undefined,
        capacityBtu: Number(capacityBtu),
        brand,
        energyClass: DEFAULT_ENERGY_CLASS,
        badge: null,
        // Preserve any specs the product already had; the form no longer edits them.
        specs: existingSpecs
      };
      if (!isEdit || hasNewFile) payload.imageUrl = imageUrl;

      const productId = isEdit
        ? (mode as { kind: "edit"; product: Product }).product.id
        : null;
      const url = productId ? `/api/products/${productId}` : "/api/products";

      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || t("admin.form.errors.generic"));
      }
      router.push(`/${locale}/admin`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("admin.form.errors.generic"));
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async () => {
    if (!isEdit) return;
    if (!window.confirm(t("admin.form.deleteConfirm"))) return;
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/products/${(mode as { kind: "edit"; product: Product }).product.id}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || t("admin.form.errors.generic"));
      }
      router.push(`/${locale}/admin`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("admin.form.errors.generic"));
      setDeleting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <Link
            href={`/${locale}/admin`}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted hover:text-celsius-500"
          >
            <ArrowLeft size={14} />
            {t("admin.form.back")}
          </Link>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink">
            {isEdit ? t("admin.form.editTitle") : t("admin.form.newTitle")}
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            {isEdit ? t("admin.form.editSubtitle") : t("admin.form.newSubtitle")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isEdit && (
            <button
              type="button"
              onClick={onDelete}
              disabled={deleting || submitting}
              className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-100 disabled:opacity-60"
            >
              <Trash2 size={15} />
              {deleting ? t("admin.form.deleting") : t("admin.form.delete")}
            </button>
          )}
          <Link
            href={`/${locale}/admin`}
            className="rounded-full bg-canvas-soft px-4 py-2.5 text-sm font-semibold text-ink-soft transition hover:bg-canvas-muted"
          >
            {t("admin.form.cancel")}
          </Link>
          <button
            type="submit"
            disabled={submitting || deleting}
            className="inline-flex items-center justify-center rounded-full bg-celsius-500 px-5 py-2.5 text-sm font-semibold text-white shadow-card transition hover:bg-celsius-600 disabled:opacity-60"
          >
            {submitting
              ? t("admin.form.saving")
              : isEdit
                ? t("admin.form.submitUpdate")
                : t("admin.form.submitCreate")}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-200">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Basic info */}
        <Section title={t("admin.form.section.basic")} className="lg:col-span-2">
          <Field id="name" label={t("admin.form.fields.name")} required>
            <input id="name" name="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder={t("admin.form.fields.namePlaceholder")} className={inputCls} />
          </Field>
          <Field id="slug" label={t("admin.form.fields.slug")} hint={t("admin.form.fields.slugHint")}>
            <input id="slug" name="slug" value={slug} onChange={(e) => setSlug(e.target.value)} className={inputCls} placeholder="vivax-pro-quiet-12000" />
          </Field>
          <Field id="brand" label={t("admin.form.fields.brand")} required>
            <select id="brand" name="brand" required value={brand} onChange={(e) => setBrand(e.target.value)} className={inputCls}>
              {BRANDS.map((b) => (
                <option key={b} value={b}>
                  {t(`shop.filters.brands.${b}`)}
                </option>
              ))}
            </select>
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="priceMkd" label={t("admin.form.fields.priceMkd")} required>
              <input id="priceMkd" name="priceMkd" type="number" min={0} step={1} required value={priceMkd} onChange={(e) => setPriceMkd(e.target.value)} className={inputCls} />
            </Field>
            <Field id="oldPriceMkd" label={t("admin.form.fields.oldPriceMkd")}>
              <input id="oldPriceMkd" name="oldPriceMkd" type="number" min={0} step={1} value={oldPriceMkd} onChange={(e) => setOldPriceMkd(e.target.value)} className={inputCls} />
            </Field>
          </div>
          <Field id="description" label={t("admin.form.fields.description")}>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={7}
              placeholder={t("admin.form.fields.descriptionPlaceholder")}
              className={`${inputCls} resize-y leading-relaxed`}
            />
          </Field>
        </Section>

        {/* Image */}
        <Section title={t("admin.form.section.media")}>
          <input
            ref={fileRef}
            type="file"
            name="image"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            required={!isEdit}
            onChange={(e) => handleFile(e.currentTarget.files?.[0] ?? null)}
            className="sr-only"
            id="image"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="block w-full rounded-2xl border-2 border-dashed border-ink/15 bg-canvas-soft p-4 text-left transition hover:border-celsius-300 hover:bg-celsius-50"
          >
            {imagePreview ? (
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-white ring-1 ring-ink/5">
                <Image src={imagePreview} alt="" fill sizes="320px" className="object-cover" unoptimized />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 py-8 text-ink-muted">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-celsius-500 ring-1 ring-ink/5">
                  <ImagePlus size={20} />
                </span>
                <span className="text-sm font-medium text-ink">{t("admin.form.fields.image")}</span>
                <span className="text-xs">{t("admin.form.fields.imageHint")}</span>
              </div>
            )}
          </button>
          {imagePreview && (
            <button type="button" onClick={() => fileRef.current?.click()} className="mt-3 w-full rounded-full bg-canvas-soft px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted hover:bg-canvas-muted hover:text-ink">
              {t("admin.form.fields.imageReplace")}
            </button>
          )}
          <p className="mt-3 text-xs text-ink-muted">{t("admin.form.fields.imageHint")}</p>
        </Section>

        {/* Перформанси */}
        <Section title={t("admin.form.specPanel.performance")} className="lg:col-span-3">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Field id="capacityBtu" label={t("admin.form.specs.power")} required>
              <select id="capacityBtu" name="capacityBtu" required value={capacityBtu} onChange={(e) => setCapacityBtu(e.target.value)} className={inputCls}>
                {CAPACITIES.map((c) => (
                  <option key={c} value={c}>
                    {c.toLocaleString("mk-MK").replace(/,/g, ".")} BTU
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </Section>

      </div>
    </form>
  );
}

const inputCls =
  "w-full rounded-2xl bg-canvas-soft px-4 py-3 text-sm text-ink placeholder:text-ink-muted/60 ring-1 ring-transparent transition focus:bg-white focus:ring-celsius-300 focus:outline-none";

function Section({
  title,
  className = "",
  children
}: {
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={`rounded-3xl bg-white p-6 shadow-card ring-1 ring-ink/5 ${className}`}>
      <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink-muted">
        {title}
      </h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function Field({
  id,
  label,
  hint,
  required,
  children
}: {
  id: string;
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted"
      >
        {label}
        {required && <span className="ml-1 text-heating-500">*</span>}
      </label>
      <div className="mt-1.5">{children}</div>
      {hint && <p className="mt-1 text-xs text-ink-muted">{hint}</p>}
    </div>
  );
}
