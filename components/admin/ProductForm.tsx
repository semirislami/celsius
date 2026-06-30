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

const MAX_IMAGES = 10;

// A photo in the form: once uploaded, `url` is the Supabase public URL. While
// uploading, `url` holds a local object-URL preview.
type ImageItem = { id: string; url: string; uploading: boolean; error?: boolean };

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

  // ---- images (up to MAX_IMAGES) ----
  const initialImages: ImageItem[] = (
    initial?.images?.length
      ? initial.images
      : initial?.imageUrl
        ? [initial.imageUrl]
        : []
  ).map((u) => ({ id: u, url: u, uploading: false }));
  const [images, setImages] = useState<ImageItem[]>(initialImages);
  const fileRef = useRef<HTMLInputElement>(null);
  const uploadingCount = images.filter((i) => i.uploading).length;

  // ---- submit state ----
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Each chosen file uploads immediately (in parallel) so the admin sees real
  // thumbnails right away; the submit just sends the resulting URL list.
  const addFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const room = MAX_IMAGES - images.length;
    if (room <= 0) return;
    const pending = Array.from(files)
      .slice(0, room)
      .map((file) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file,
        preview: URL.createObjectURL(file)
      }));

    setImages((prev) => [
      ...prev,
      ...pending.map((p) => ({ id: p.id, url: p.preview, uploading: true }))
    ]);

    await Promise.all(
      pending.map(async (p) => {
        try {
          const { publicUrl } = await uploadProductImage(p.file);
          setImages((prev) =>
            prev.map((it) =>
              it.id === p.id ? { ...it, url: publicUrl, uploading: false } : it
            )
          );
        } catch {
          setImages((prev) =>
            prev.map((it) =>
              it.id === p.id ? { ...it, uploading: false, error: true } : it
            )
          );
        }
      })
    );
  };

  const removeImage = (id: string) =>
    setImages((prev) => prev.filter((it) => it.id !== id));

  const moveImage = (id: string, dir: -1 | 1) =>
    setImages((prev) => {
      const idx = prev.findIndex((it) => it.id === id);
      const target = idx + dir;
      if (idx < 0 || target < 0 || target >= prev.length) return prev;
      const copy = [...prev];
      [copy[idx], copy[target]] = [copy[target], copy[idx]];
      return copy;
    });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (uploadingCount > 0) {
        throw new Error(t("admin.form.errors.imageUploading"));
      }
      const imageUrls = images
        .filter((it) => !it.uploading && !it.error && it.url)
        .map((it) => it.url);
      if (imageUrls.length === 0) {
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
        images: imageUrls,
        // Preserve any specs the product already had; the form no longer edits them.
        specs: existingSpecs
      };

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
            disabled={submitting || deleting || uploadingCount > 0}
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

        {/* Images */}
        <Section title={t("admin.form.section.media")}>
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            multiple
            onChange={(e) => {
              addFiles(e.currentTarget.files);
              e.currentTarget.value = "";
            }}
            className="sr-only"
            id="images"
          />

          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {images.map((img, i) => (
                <div
                  key={img.id}
                  className="group relative aspect-square overflow-hidden rounded-2xl bg-canvas-soft ring-1 ring-ink/5"
                >
                  <Image src={img.url} alt="" fill sizes="160px" className="object-cover" unoptimized />

                  {i === 0 && !img.uploading && !img.error && (
                    <span className="absolute left-2 top-2 rounded-full bg-celsius-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-white shadow">
                      {t("admin.form.fields.cover")}
                    </span>
                  )}

                  {img.uploading && (
                    <div className="absolute inset-0 grid place-items-center bg-white/60 backdrop-blur-sm">
                      <span className="h-6 w-6 animate-spin rounded-full border-2 border-celsius-500 border-t-transparent" />
                    </div>
                  )}
                  {img.error && (
                    <div className="absolute inset-0 grid place-items-center bg-rose-50/85 px-2 text-center text-xs font-semibold text-rose-600">
                      {t("admin.form.errors.uploadShort")}
                    </div>
                  )}

                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-gradient-to-t from-ink/70 to-transparent p-2 opacity-0 transition group-hover:opacity-100">
                    <div className="flex gap-1">
                      <IconBtn label="←" disabled={i === 0} onClick={() => moveImage(img.id, -1)} />
                      <IconBtn label="→" disabled={i === images.length - 1} onClick={() => moveImage(img.id, 1)} />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(img.id)}
                      aria-label={t("admin.form.fields.imageRemove")}
                      className="grid h-7 w-7 place-items-center rounded-full bg-white/90 text-rose-600 transition hover:bg-white"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {images.length < MAX_IMAGES && (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="mt-3 block w-full rounded-2xl border-2 border-dashed border-ink/15 bg-canvas-soft p-4 text-left transition hover:border-celsius-300 hover:bg-celsius-50"
            >
              <div className="flex flex-col items-center gap-2 py-6 text-ink-muted">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-celsius-500 ring-1 ring-ink/5">
                  <ImagePlus size={20} />
                </span>
                <span className="text-sm font-medium text-ink">{t("admin.form.fields.image")}</span>
                <span className="text-xs">{t("admin.form.fields.imageHint")}</span>
              </div>
            </button>
          )}

          <p className="mt-3 text-xs text-ink-muted">
            {t("admin.form.fields.imagesCount", { count: images.length, max: MAX_IMAGES })}
          </p>
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

function IconBtn({
  label,
  onClick,
  disabled
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="grid h-7 w-7 place-items-center rounded-full bg-white/90 text-ink transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
    >
      <span className="text-sm leading-none">{label}</span>
    </button>
  );
}
