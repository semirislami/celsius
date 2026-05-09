"use client";

import { Send } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export function ContactForm() {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="rounded-3xl bg-white p-7 md:p-9 shadow-card ring-1 ring-ink/5">
      <h3 className="text-2xl font-semibold tracking-tight text-ink">
        {t("contact.form.title")}
      </h3>

      <form
        className="mt-6 space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            id="name"
            label={t("contact.form.name")}
            placeholder={t("contact.form.namePlaceholder")}
            required
          />
          <Field
            id="email"
            type="email"
            label={t("contact.form.email")}
            placeholder={t("contact.form.emailPlaceholder")}
            required
          />
        </div>

        <Field
          id="phone"
          type="tel"
          label={t("contact.form.phone")}
          placeholder={t("contact.form.phonePlaceholder")}
        />

        <div>
          <label
            htmlFor="message"
            className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted"
          >
            {t("contact.form.message")}
          </label>
          <textarea
            id="message"
            rows={5}
            placeholder={t("contact.form.messagePlaceholder")}
            required
            className="mt-2 w-full rounded-2xl bg-canvas-soft px-4 py-3 text-sm text-ink placeholder:text-ink-muted/60 ring-1 ring-transparent transition focus:bg-white focus:ring-celsius-300 focus:outline-none"
          />
        </div>

        <button type="submit" className="btn-primary w-full md:w-auto">
          {t("contact.form.submit")}
          <Send size={15} />
        </button>

        {submitted && (
          <p className="text-xs text-celsius-600">✓ {t("contact.form.submit")}</p>
        )}
      </form>
    </div>
  );
}

function Field({
  id,
  label,
  placeholder,
  type = "text",
  required
}: {
  id: string;
  label: string;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        required={required}
        className="mt-2 w-full rounded-2xl bg-canvas-soft px-4 py-3 text-sm text-ink placeholder:text-ink-muted/60 ring-1 ring-transparent transition focus:bg-white focus:ring-celsius-300 focus:outline-none"
      />
    </div>
  );
}
