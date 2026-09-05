"use client";

/**
 * ContactPage — contact form (demo: saved to the local store) + info cards
 * with address, phone, e-mail, service hours, socials note and a map placeholder.
 */

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  CheckCircle2,
  Clock,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Send,
  Share2,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/church/shared";
import { useLoc, useT } from "@/lib/i18n";
import { useChurchStore } from "@/lib/store/useChurchStore";

interface FormState {
  name: string;
  email: string;
  phone: string;
  message: string;
}

type FieldName = "name" | "email" | "message";

const EMPTY_FORM: FormState = { name: "", email: "", phone: "", message: "" };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactPage() {
  const t = useT();
  const loc = useLoc();

  const settings = useChurchStore((s) => s.data.settings);
  const addMessage = useChurchStore((s) => s.addMessage);

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const timerRef = useRef<number | null>(null);
  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    },
    [],
  );

  const requiredText = loc({ ru: "Заполните это поле", tj: "" });

  const setField = (field: keyof FormState) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => (prev[field as FieldName] ? { ...prev, [field]: undefined } : prev));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nextErrors: Partial<Record<FieldName, string>> = {};
    if (!form.name.trim()) nextErrors.name = requiredText;
    if (!form.email.trim()) {
      nextErrors.email = requiredText;
    } else if (!EMAIL_RE.test(form.email.trim())) {
      nextErrors.email = t("contact.form.emailInvalid");
    }
    if (!form.message.trim()) nextErrors.message = requiredText;

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSending(true);
    timerRef.current = window.setTimeout(() => {
      addMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        message: form.message.trim(),
      });
      toast.success(t("contact.form.success.title"));
      setSending(false);
      setSent(true);
    }, 400);
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setSent(false);
  };

  const phoneHref = `tel:${settings.phone.replace(/[^+\d]/g, "")}`;

  return (
    <div>
      <PageHeader
        title={t("contact.title")}
        subtitle={t("contact.subtitle")}
        icon={<Mail className="h-7 w-7" aria-hidden="true" />}
      />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-6 lg:grid-cols-5 lg:gap-8">
          {/* ---------------- Form ---------------- */}
          <div className="rounded-3xl border border-teal-100/70 bg-white p-6 shadow-card sm:p-8 lg:col-span-3">
            <h2 className="text-2xl font-semibold leading-snug">{t("contact.form.title")}</h2>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">{t("contact.form.intro")}</p>

            {sent ? (
              <div
                role="status"
                className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center sm:p-8"
              >
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" aria-hidden="true" />
                <h3 className="mt-3 text-xl font-semibold">{t("contact.form.success.title")}</h3>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-stone-600">
                  {t("contact.form.success.text")}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="mt-6 min-h-11 rounded-full border-teal-300 bg-white px-6 font-semibold text-teal-800 transition-all hover:-translate-y-0.5 hover:bg-teal-50 hover:text-teal-900"
                >
                  {loc({ ru: "Отправить ещё одно сообщение", tj: "" })}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="contact-name">
                    {t("contact.form.name")}{" "}
                    <span className="text-amber-600" aria-hidden="true">
                      *
                    </span>
                  </Label>
                  <Input
                    id="contact-name"
                    name="name"
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => setField("name")(e.target.value)}
                    disabled={sending}
                    aria-required="true"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "contact-name-error" : undefined}
                    className="min-h-11 rounded-xl"
                  />
                  {errors.name ? (
                    <p id="contact-name-error" className="text-sm font-medium text-red-600">
                      {errors.name}
                    </p>
                  ) : null}
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="contact-email">
                      {t("contact.form.email")}{" "}
                      <span className="text-amber-600" aria-hidden="true">
                        *
                      </span>
                    </Label>
                    <Input
                      id="contact-email"
                      name="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={(e) => setField("email")(e.target.value)}
                      disabled={sending}
                      aria-required="true"
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? "contact-email-error" : undefined}
                      className="min-h-11 rounded-xl"
                    />
                    {errors.email ? (
                      <p id="contact-email-error" className="text-sm font-medium text-red-600">
                        {errors.email}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="contact-phone">
                      {t("contact.form.phone")}{" "}
                      <span className="text-xs font-normal text-stone-500">({t("common.optional")})</span>
                    </Label>
                    <Input
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={(e) => setField("phone")(e.target.value)}
                      disabled={sending}
                      className="min-h-11 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="contact-message">
                    {t("contact.form.message")}{" "}
                    <span className="text-amber-600" aria-hidden="true">
                      *
                    </span>
                  </Label>
                  <Textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    placeholder={t("contact.form.messagePh")}
                    value={form.message}
                    onChange={(e) => setField("message")(e.target.value)}
                    disabled={sending}
                    aria-required="true"
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? "contact-message-error" : undefined}
                    className="min-h-32 rounded-xl"
                  />
                  {errors.message ? (
                    <p id="contact-message-error" className="text-sm font-medium text-red-600">
                      {errors.message}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-3 pt-1">
                  <Button
                    type="submit"
                    disabled={sending}
                    className="min-h-11 w-full rounded-full bg-teal-600 px-6 text-base font-semibold text-teal-50 shadow-soft transition-all hover:-translate-y-0.5 hover:bg-teal-700 sm:w-auto"
                  >
                    {sending ? (
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    ) : (
                      <Send className="h-4 w-4" aria-hidden="true" />
                    )}
                    {t("contact.form.submit")}
                  </Button>
                  <p className="text-xs leading-relaxed text-stone-500">{t("common.privacyNote")}</p>
                </div>
              </form>
            )}
          </div>

          {/* ---------------- Info column ---------------- */}
          <div className="space-y-4 lg:col-span-2">
            {loc(settings.address) ? (
              <InfoCard icon={MapPin} label={t("contact.address")}>
                <span>{loc(settings.address)}</span>
              </InfoCard>
            ) : null}

            {settings.phone ? (
              <InfoCard icon={Phone} label={t("contact.phone")}>
                <a
                  href={phoneHref}
                  className="break-words rounded font-semibold text-teal-700 underline-offset-2 transition-colors hover:text-teal-800 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-600"
                >
                  {settings.phone}
                </a>
              </InfoCard>
            ) : null}

            {settings.email ? (
              <InfoCard icon={Mail} label={t("contact.email")}>
                <a
                  href={`mailto:${settings.email}`}
                  className="break-words rounded font-semibold text-teal-700 underline-offset-2 transition-colors hover:text-teal-800 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-600"
                >
                  {settings.email}
                </a>
              </InfoCard>
            ) : null}

            <InfoCard icon={Clock} label={t("contact.hours")}>
              <span>{t("contact.hours.text")}</span>
            </InfoCard>

            <InfoCard icon={Share2} label={t("contact.socials")}>
              <span>{t("contact.socials.note")}</span>
            </InfoCard>

            <div className="relative flex h-48 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-100 via-teal-50 to-amber-50 shadow-card">
              <div className="flex flex-col items-center gap-2 px-4 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-soft">
                  <MapPin className="h-5 w-5 text-teal-600" aria-hidden="true" />
                </span>
                <p className="max-w-xs text-xs leading-relaxed text-stone-500">{t("contact.map.note")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start gap-4 rounded-3xl border border-teal-100/70 bg-white p-5 shadow-card transition-all hover:shadow-soft sm:p-6">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-wider text-stone-500">{label}</p>
        <div className="mt-1 text-sm leading-relaxed text-stone-700">{children}</div>
      </div>
    </div>
  );
}
