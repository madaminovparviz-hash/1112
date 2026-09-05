"use client";

/**
 * PrayerPage — prayer requests (public view).
 * Left: submission form (anonymous option, public-listing consent, calm
 * success state). Right: requests the prayer team approved for the public
 * list. Privacy note reminds that this demo stores data in the browser only.
 */

import { useState, type FormEvent } from "react";
import {
  CalendarDays,
  CheckCircle2,
  HeartHandshake,
  MessageCircleHeart,
  Send,
  ShieldCheck,
  User,
  UserRound,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useDateFormatter, useLoc, useT } from "@/lib/i18n";
import { useChurchStore } from "@/lib/store/useChurchStore";
import { EmptyState, PageHeader, StatusBadge, VerseCard } from "../shared";
import { toast } from "sonner";

export default function PrayerPage() {
  const t = useT();
  const loc = useLoc();
  const formatDate = useDateFormatter();
  const prayers = useChurchStore((s) => s.data.prayers);
  const addPrayer = useChurchStore((s) => s.addPrayer);

  // Form state
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [text, setText] = useState("");
  const [error, setError] = useState(false);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const publicPrayers = prayers
    .filter((p) => p.isPublic && p.status !== "archived")
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim()) {
      setError(true);
      return;
    }
    setError(false);
    setSending(true);
    // Small delay for a calm, deliberate UX in this demo (no network call).
    window.setTimeout(() => {
      addPrayer({
        name: anonymous ? null : name.trim() || null,
        contact: contact.trim() || null,
        anonymous,
        text: text.trim(),
        isPublic,
      });
      setSending(false);
      setSuccess(true);
      toast.success(t("prayer.form.success.title"), {
        description: t("prayer.form.success.text"),
      });
    }, 400);
  };

  const resetForm = () => {
    setName("");
    setContact("");
    setAnonymous(false);
    setIsPublic(true);
    setText("");
    setError(false);
    setSuccess(false);
  };

  return (
    <div>
      <PageHeader
        title={t("prayer.title")}
        subtitle={t("prayer.subtitle")}
        icon={<HeartHandshake className="h-7 w-7" aria-hidden="true" />}
      />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16" aria-label={t("prayer.title")}>
        <div className="grid items-start gap-8 lg:grid-cols-5 lg:gap-10">
          {/* ---------- Form ---------- */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-teal-100/70 bg-white p-6 shadow-card sm:p-8">
              <h2 className="font-serif text-xl font-semibold sm:text-2xl">
                {t("prayer.form.title")}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">
                {t("prayer.form.intro")}
              </p>

              {success ? (
                <div
                  className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-6 text-center"
                  role="status"
                >
                  <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" aria-hidden="true" />
                  <h3 className="mt-3 font-serif text-lg font-semibold">
                    {t("prayer.form.success.title")}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">
                    {t("prayer.form.success.text")}
                  </p>
                  <Button
                    type="button"
                    onClick={resetForm}
                    className="mt-5 min-h-11 rounded-full bg-teal-600 text-teal-50 hover:bg-teal-700"
                  >
                    <Send className="h-4 w-4" aria-hidden="true" />
                    {loc({ ru: "Отправить ещё одну просьбу", tj: "" })}
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
                  {/* Anonymous */}
                  <div className="flex items-start gap-3 rounded-2xl bg-amber-50/80 p-3.5">
                    <Checkbox
                      id="prayer-anonymous"
                      checked={anonymous}
                      onCheckedChange={(checked) => {
                        const next = checked === true;
                        setAnonymous(next);
                        if (next) setName("");
                      }}
                      className="mt-0.5"
                    />
                    <div className="min-w-0">
                      <Label
                        htmlFor="prayer-anonymous"
                        className="cursor-pointer text-sm font-semibold text-stone-700"
                      >
                        {t("prayer.form.anonymous")}
                      </Label>
                    </div>
                  </div>

                  {/* Name */}
                  <div className="space-y-1.5">
                    <Label htmlFor="prayer-name" className="text-sm font-semibold text-stone-700">
                      {t("prayer.form.name")}{" "}
                      <span className="font-normal text-stone-400">· {t("prayer.form.nameHint")}</span>
                    </Label>
                    <Input
                      id="prayer-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={anonymous}
                      autoComplete="name"
                      className="min-h-11 rounded-xl border-stone-200 bg-stone-50/60 focus-visible:border-teal-500 focus-visible:ring-teal-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>

                  {/* Contact */}
                  <div className="space-y-1.5">
                    <Label htmlFor="prayer-contact" className="text-sm font-semibold text-stone-700">
                      {t("prayer.form.contact")}{" "}
                      <span className="font-normal text-stone-400">({t("common.optional")})</span>
                    </Label>
                    <Input
                      id="prayer-contact"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      autoComplete="email"
                      className="min-h-11 rounded-xl border-stone-200 bg-stone-50/60 focus-visible:border-teal-500 focus-visible:ring-teal-500/30"
                    />
                    <p className="text-xs leading-relaxed text-stone-500">
                      {t("prayer.form.contactHint")}
                    </p>
                  </div>

                  {/* Public listing consent */}
                  <div className="space-y-2 rounded-2xl bg-teal-50/70 p-3.5">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="prayer-public"
                        checked={isPublic}
                        onCheckedChange={(checked) => setIsPublic(checked === true)}
                        className="mt-0.5"
                      />
                      <Label
                        htmlFor="prayer-public"
                        className="cursor-pointer text-sm font-semibold leading-snug text-stone-700"
                      >
                        {t("prayer.form.public")}
                      </Label>
                    </div>
                    <p className="pl-7 text-xs leading-relaxed text-stone-500">
                      {t("prayer.form.publicHint")}
                    </p>
                  </div>

                  {/* Text */}
                  <div className="space-y-1.5">
                    <Label htmlFor="prayer-text" className="text-sm font-semibold text-stone-700">
                      {t("prayer.form.text")} <span className="text-amber-600">*</span>
                    </Label>
                    <Textarea
                      id="prayer-text"
                      value={text}
                      onChange={(e) => {
                        setText(e.target.value);
                        if (e.target.value.trim()) setError(false);
                      }}
                      placeholder={t("prayer.form.textPh")}
                      rows={5}
                      required
                      aria-invalid={error}
                      aria-describedby={error ? "prayer-text-error" : undefined}
                      className="rounded-xl border-stone-200 bg-stone-50/60 focus-visible:border-teal-500 focus-visible:ring-teal-500/30"
                    />
                    {error ? (
                      <p id="prayer-text-error" role="alert" className="text-xs font-semibold text-destructive">
                        {t("prayer.form.required")}
                      </p>
                    ) : null}
                  </div>

                  <Button
                    type="submit"
                    disabled={sending}
                    className="min-h-11 w-full rounded-full bg-teal-600 text-teal-50 shadow-card hover:bg-teal-700"
                  >
                    <Send className="h-4 w-4" aria-hidden="true" />
                    {sending ? t("common.loading") : t("prayer.form.submit")}
                  </Button>
                </form>
              )}

              {/* Privacy note */}
              <Alert className="mt-6 rounded-2xl border-teal-200/80 bg-teal-50/50">
                <ShieldCheck className="text-teal-600" aria-hidden="true" />
                <AlertTitle className="text-xs font-bold uppercase tracking-[0.14em] text-teal-700">
                  {t("prayer.privacy.title")}
                </AlertTitle>
                <AlertDescription className="text-xs leading-relaxed text-stone-500">
                  {t("prayer.privacy.text")}
                </AlertDescription>
              </Alert>
            </div>
          </div>

          {/* ---------- Public list ---------- */}
          <div className="lg:col-span-3">
            <h2 className="font-serif text-xl font-semibold sm:text-2xl">{t("prayer.list.title")}</h2>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">{t("prayer.list.intro")}</p>

            {publicPrayers.length === 0 ? (
              <div className="mt-6">
                <EmptyState
                  icon={<MessageCircleHeart className="h-7 w-7" aria-hidden="true" />}
                  title={t("prayer.list.empty")}
                />
              </div>
            ) : (
              <ul className="mt-6 space-y-4">
                {publicPrayers.map((prayer) => {
                  const showAnonymous = prayer.anonymous || !prayer.name;
                  return (
                    <li key={prayer.id}>
                      <article className="rounded-3xl border border-teal-100/70 bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-soft sm:p-6">
                        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                          <span className="inline-flex items-center gap-2 text-sm font-semibold text-teal-800">
                            {showAnonymous ? (
                              <UserRound className="h-4 w-4 text-teal-600" aria-hidden="true" />
                            ) : (
                              <User className="h-4 w-4 text-teal-600" aria-hidden="true" />
                            )}
                            {showAnonymous ? t("prayer.list.anonymous") : prayer.name}
                          </span>
                          <StatusBadge
                            status={prayer.status}
                            label={t(`prayer.status.${prayer.status}`)}
                          />
                        </div>
                        <p className="mt-3 leading-relaxed text-stone-700">{prayer.text}</p>
                        <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-stone-500">
                          <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                          {formatDate(prayer.createdAt)}
                        </p>
                      </article>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Verse */}
        <VerseCard
          text={t("prayer.verse.text")}
          reference={t("prayer.verse.ref")}
          className="mx-auto mt-12 max-w-3xl"
        />
      </section>
    </div>
  );
}
