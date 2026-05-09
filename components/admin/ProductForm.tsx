"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ArrowLeft, ImagePlus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Locale } from "@/lib/i18n/settings";
import {
  BADGES,
  BRANDS,
  CAPACITIES,
  ENERGY_CLASSES,
  type Product
} from "@/lib/products/types";
import { uploadProductImage } from "@/lib/products/uploadClient";

type Mode =
  | { kind: "create" }
  | { kind: "edit"; product: Product };

type Props = {
  locale: Locale;
  mode: Mode;
};

export function ProductForm({ locale, mode }: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  const isEdit = mode.kind === "edit";
  const initial = isEdit ? mode.product : null;

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
  const [brand, setBrand] = useState<string>(initial?.brand ?? "celsius-prime");
  const [energyClass, setEnergyClass] = useState<string>(
    initial?.energyClass ?? "A+++"
  );
  const [badge, setBadge] = useState<string>(initial?.badge ?? "");
  const [guaranteeYears, setGuaranteeYears] = useState<string>(
    initial?.guaranteeYears ? String(initial.guaranteeYears) : "5"
  );
  const [noiseDb, setNoiseDb] = useState<string>(
    initial?.noiseDb ? String(initial.noiseDb) : ""
  );

  const [specsCooling, setSpecsCooling] = useState(initial?.specs?.cooling ?? "");
  const [specsHeating, setSpecsHeating] = useState(initial?.specs?.heating ?? "");
  const [specsSeer, setSpecsSeer] = useState(initial?.specs?.seer ?? "");
  const [specsTemp, setSpecsTemp] = useState(initial?.specs?.temp ?? "");
  const [specsNoise, setSpecsNoise] = useState(initial?.specs?.noise ?? "");
  const [specsGas, setSpecsGas] = useState(initial?.specs?.gas ?? "");
  const [specsWifi, setSpecsWifi] = useState(initial?.specs?.wifi ?? "");

  const [imagePreview, setImagePreview] = useState<string | null>(initial?.imageUrl ?? null);
  const fileRef = useRef<HTMLInputElement>(null);

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

      // Step 1: if a new image was picked, upload it directly to Supabase
      // Storage. Server only ever sees the public URL, never the bytes.
      let imageUrl = initial?.imageUrl ?? "";
      if (hasNewFile) {
        const result = await uploadProductImage(file as File);
        imageUrl = result.publicUrl;
      } else if (!isEdit) {
        throw new Error(t("admin.form.errors.image"));
      }

      // Step 2: send the rest as JSON.
      const payload: Record<string, unknown> = {
        name: fd.get("name"),
        slug: fd.get("slug"),
        description: fd.get("description"),
        priceMkd: Number(fd.get("priceMkd")),
        oldPriceMkd: fd.get("oldPriceMkd")
          ? Number(fd.get("oldPriceMkd"))
          : undefined,
        capacityBtu: Number(fd.get("capacityBtu")),
        brand: fd.get("brand"),
        energyClass: fd.get("energyClass"),
        badge: fd.get("badge") || null,
        guaranteeYears: fd.get("guaranteeYears")
          ? Number(fd.get("guaranteeYears"))
          : undefined,
        noiseDb: fd.get("noiseDb") ? Number(fd.get("noiseDb")) : undefined,
        specs: {
          cooling: fd.get("specsCooling") || undefined,
          heating: fd.get("specsHeating") || undefined,
          seer: fd.get("specsSeer") || undefined,
          temp: fd.get("specsTemp") || undefined,
          noise: fd.get("specsNoise") || undefined,
          gas: fd.get("specsGas") || undefined,
          wifi: fd.get("specsWifi") || undefined
        }
      };
      // Only include imageUrl on edit if the user actually changed it,
      // otherwise leave the existing one untouched server-side.
      if (!isEdit) {
        payload.imageUrl = imageUrl;
      } else if (hasNewFile) {
        payload.imageUrl = imageUrl;
      }

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
        <Section title={t("admin.form.section.basic")} className="lg:col-span-2">
          <Field id="name" label={t("admin.form.fields.name")} required>
            <input
              id="name"
              name="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("admin.form.fields.namePlaceholder")}
              className={inputCls}
            />
          </Field>
          <Field id="slug" label={t("admin.form.fields.slug")} hint={t("admin.form.fields.slugHint")}>
            <input
              id="slug"
              name="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className={inputCls}
              placeholder="celsius-pro-quiet-12000"
            />
          </Field>
          <Field id="description" label={t("admin.form.fields.description")} required>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("admin.form.fields.descriptionPlaceholder")}
              className={inputCls}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="priceMkd" label={t("admin.form.fields.priceMkd")} required>
              <input
                id="priceMkd"
                name="priceMkd"
                type="number"
                min={0}
                step={1}
                required
                value={priceMkd}
                onChange={(e) => setPriceMkd(e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field id="oldPriceMkd" label={t("admin.form.fields.oldPriceMkd")}>
              <input
                id="oldPriceMkd"
                name="oldPriceMkd"
                type="number"
                min={0}
                step={1}
                value={oldPriceMkd}
                onChange={(e) => setOldPriceMkd(e.target.value)}
                className={inputCls}
              />
            </Field>
          </div>
        </Section>

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
                <Image
                  src={imagePreview}
                  alt=""
                  fill
                  sizes="320px"
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 py-8 text-ink-muted">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-celsius-500 ring-1 ring-ink/5">
                  <ImagePlus size={20} />
                </span>
                <span className="text-sm font-medium text-ink">
                  {t("admin.form.fields.image")}
                </span>
                <span className="text-xs">{t("admin.form.fields.imageHint")}</span>
              </div>
            )}
          </button>
          {imagePreview && (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="mt-3 w-full rounded-full bg-canvas-soft px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted hover:bg-canvas-muted hover:text-ink"
            >
              {t("admin.form.fields.imageReplace")}
            </button>
          )}
          <p className="mt-3 text-xs text-ink-muted">
            {t("admin.form.fields.imageHint")}
          </p>
        </Section>

        <Section title={t("admin.form.section.classification")} className="lg:col-span-3">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Field id="brand" label={t("admin.form.fields.brand")}>
              <select
                id="brand"
                name="brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className={inputCls}
              >
                {BRANDS.map((b) => (
                  <option key={b} value={b}>
                    {t(`shop.filters.brands.${b}`)}
                  </option>
                ))}
              </select>
            </Field>
            <Field id="capacityBtu" label={t("admin.form.fields.capacityBtu")} required>
              <select
                id="capacityBtu"
                name="capacityBtu"
                required
                value={capacityBtu}
                onChange={(e) => setCapacityBtu(e.target.value)}
                className={inputCls}
              >
                {CAPACITIES.map((c) => (
                  <option key={c} value={c}>
                    {c.toLocaleString("mk-MK").replace(/,/g, ".")} BTU
                  </option>
                ))}
              </select>
            </Field>
            <Field id="energyClass" label={t("admin.form.fields.energyClass")}>
              <select
                id="energyClass"
                name="energyClass"
                value={energyClass}
                onChange={(e) => setEnergyClass(e.target.value)}
                className={inputCls}
              >
                {ENERGY_CLASSES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field id="badge" label={t("admin.form.fields.badge")}>
              <select
                id="badge"
                name="badge"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className={inputCls}
              >
                <option value="">{t("admin.form.fields.badgeNone")}</option>
                {BADGES.map((b) => (
                  <option key={b} value={b}>
                    {t(`shop.badge.${b}`)}
                  </option>
                ))}
              </select>
            </Field>
            <Field id="guaranteeYears" label={t("admin.form.fields.guaranteeYears")}>
              <input
                id="guaranteeYears"
                name="guaranteeYears"
                type="number"
                min={0}
                step={1}
                value={guaranteeYears}
                onChange={(e) => setGuaranteeYears(e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field id="noiseDb" label={t("admin.form.fields.noiseDb")}>
              <input
                id="noiseDb"
                name="noiseDb"
                type="number"
                min={0}
                step={0.1}
                value={noiseDb}
                onChange={(e) => setNoiseDb(e.target.value)}
                className={inputCls}
              />
            </Field>
          </div>
        </Section>

        <Section title={t("admin.form.section.specs")} className="lg:col-span-3">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Field id="specsCooling" label={t("admin.form.fields.specsCooling")}>
              <input id="specsCooling" name="specsCooling" value={specsCooling} onChange={(e) => setSpecsCooling(e.target.value)} placeholder="12000 BTU / 3.5 kW" className={inputCls} />
            </Field>
            <Field id="specsHeating" label={t("admin.form.fields.specsHeating")}>
              <input id="specsHeating" name="specsHeating" value={specsHeating} onChange={(e) => setSpecsHeating(e.target.value)} placeholder="13000 BTU / 3.8 kW" className={inputCls} />
            </Field>
            <Field id="specsSeer" label={t("admin.form.fields.specsSeer")}>
              <input id="specsSeer" name="specsSeer" value={specsSeer} onChange={(e) => setSpecsSeer(e.target.value)} placeholder="8.5 / 5.1" className={inputCls} />
            </Field>
            <Field id="specsTemp" label={t("admin.form.fields.specsTemp")}>
              <input id="specsTemp" name="specsTemp" value={specsTemp} onChange={(e) => setSpecsTemp(e.target.value)} placeholder="−25°C — +50°C" className={inputCls} />
            </Field>
            <Field id="specsNoise" label={t("admin.form.fields.specsNoise")}>
              <input id="specsNoise" name="specsNoise" value={specsNoise} onChange={(e) => setSpecsNoise(e.target.value)} placeholder="19 / 24 / 30 / 38 dB" className={inputCls} />
            </Field>
            <Field id="specsGas" label={t("admin.form.fields.specsGas")}>
              <input id="specsGas" name="specsGas" value={specsGas} onChange={(e) => setSpecsGas(e.target.value)} placeholder="R32" className={inputCls} />
            </Field>
            <Field id="specsWifi" label={t("admin.form.fields.specsWifi")}>
              <input id="specsWifi" name="specsWifi" value={specsWifi} onChange={(e) => setSpecsWifi(e.target.value)} className={inputCls} />
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
