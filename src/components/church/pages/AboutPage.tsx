"use client";

/**
 * AboutPage — who we are, our history, beliefs, values, mission and verse.
 */

import {
  BookMarked,
  BookOpen,
  Church,
  ExternalLink,
  Gift,
  HandHeart,
  Heart,
  Landmark,
  MoonStar,
  Sparkles,
  Star,
  Sunrise,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PageHeader, SectionHeading, VerseCard } from "@/components/church/shared";
import { useT } from "@/lib/i18n";

const BELIEFS: { icon: LucideIcon }[] = [
  { icon: BookOpen },
  { icon: Sparkles },
  { icon: Gift },
  { icon: Sunrise },
  { icon: Star },
  { icon: HandHeart },
];

const VALUES: { icon: LucideIcon }[] = [
  { icon: Heart },
  { icon: BookMarked },
  { icon: Users },
  { icon: MoonStar },
];

export default function AboutPage() {
  const t = useT();

  return (
    <div>
      <PageHeader
        title={t("about.title")}
        subtitle={t("about.subtitle")}
        icon={<Church className="h-7 w-7" aria-hidden="true" />}
      />

      {/* ---------------- Intro ---------------- */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="rounded-3xl border border-teal-100/70 bg-white p-6 shadow-card sm:p-10">
          <h2 className="text-2xl font-semibold leading-snug sm:text-3xl">{t("about.intro.title")}</h2>
          <p className="mt-4 font-serif text-lg italic leading-relaxed text-stone-600 sm:text-xl">
            {t("about.intro.text")}
          </p>
        </div>
      </section>

      {/* ---------------- History ---------------- */}
      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 sm:pb-16">
        <article className="relative overflow-hidden rounded-3xl border border-amber-200/70 border-l-4 border-l-amber-400 bg-amber-50/60 p-6 shadow-card sm:p-8">
          <Landmark
            aria-hidden="true"
            className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 text-amber-200/50"
          />
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
            <Landmark className="h-6 w-6" aria-hidden="true" />
          </span>
          <h2 className="mt-4 text-2xl font-semibold leading-snug">{t("about.history.title")}</h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-stone-600">{t("about.history.text")}</p>
        </article>
      </section>

      {/* ---------------- Beliefs ---------------- */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <SectionHeading
          title={t("about.beliefs.title")}
          description={t("about.beliefs.intro")}
          align="center"
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BELIEFS.map((belief, i) => (
            <article
              key={`belief-${i + 1}`}
              className="rounded-3xl border border-teal-100/70 bg-white p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-soft"
            >
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
                <belief.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="text-lg font-semibold leading-snug">{t(`about.beliefs.${i + 1}.title`)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">{t(`about.beliefs.${i + 1}.text`)}</p>
            </article>
          ))}
        </div>

        <Alert className="mt-6 rounded-2xl border-amber-200 bg-amber-50/80">
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
          <AlertTitle>{t("about.beliefs.title")}</AlertTitle>
          <AlertDescription>
            {t("about.beliefs.note")}{" "}
            <a
              href="https://www.adventist.org"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded font-semibold text-teal-700 underline underline-offset-2 transition-colors hover:text-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-600"
            >
              adventist.org
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </AlertDescription>
        </Alert>
      </section>

      {/* ---------------- Values ---------------- */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <SectionHeading title={t("about.values.title")} align="center" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((value, i) => (
            <article
              key={`value-${i + 1}`}
              className="rounded-3xl border border-amber-100 bg-white p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-soft"
            >
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                <value.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="text-lg font-semibold leading-snug">{t(`about.values.${i + 1}.title`)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">{t(`about.values.${i + 1}.text`)}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ---------------- Mission ---------------- */}
      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 sm:pb-16">
        <div className="rounded-3xl border border-teal-100/70 bg-gradient-to-br from-teal-50 to-amber-50 p-6 text-center shadow-card sm:p-10">
          <h2 className="text-2xl font-semibold leading-snug sm:text-3xl">{t("about.mission.title")}</h2>
          <p className="mx-auto mt-4 max-w-3xl leading-relaxed text-stone-600">{t("about.mission.text")}</p>
        </div>
      </section>

      {/* ---------------- Verse ---------------- */}
      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 sm:pb-16">
        <VerseCard
          text={t("about.verse.text")}
          reference={t("about.verse.ref")}
          className="mx-auto max-w-3xl"
        />
      </section>
    </div>
  );
}
