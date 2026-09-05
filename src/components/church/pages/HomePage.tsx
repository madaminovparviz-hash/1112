"use client";

/**
 * HomePage — hero, verse of the day, announcements, quick navigation cards,
 * "who we are" teaser, upcoming Sabbath services, latest sermons and a final CTA.
 */

import Image from "next/image";
import { useMemo } from "react";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  HeartHandshake,
  Megaphone,
  PlayCircle,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState, SectionHeading, VerseCard } from "@/components/church/shared";
import { useDateFormatter, useLoc, useT } from "@/lib/i18n";
import { useChurchStore } from "@/lib/store/useChurchStore";
import type { View } from "@/lib/store/types";

interface QuickCard {
  icon: LucideIcon;
  view: View;
  keyPrefix: "home.cards.schedule" | "home.cards.lessons" | "home.cards.prayer" | "home.cards.media";
}

const QUICK_CARDS: QuickCard[] = [
  { icon: CalendarDays, view: { page: "schedule" }, keyPrefix: "home.cards.schedule" },
  { icon: BookOpen, view: { page: "lessons" }, keyPrefix: "home.cards.lessons" },
  { icon: HeartHandshake, view: { page: "prayer" }, keyPrefix: "home.cards.prayer" },
  { icon: PlayCircle, view: { page: "media" }, keyPrefix: "home.cards.media" },
];

export default function HomePage({ onNavigate }: { onNavigate: (view: View) => void }) {
  const t = useT();
  const loc = useLoc();
  const formatDate = useDateFormatter();

  const announcements = useChurchStore((s) => s.data.announcements);
  const services = useChurchStore((s) => s.data.services);
  const sermons = useChurchStore((s) => s.data.sermons);

  const publishedAnnouncements = useMemo(
    () =>
      announcements
        .filter((a) => a.published)
        .sort((a, b) => {
          if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
          return b.startDate.localeCompare(a.startDate);
        }),
    [announcements],
  );

  const sabbathServices = useMemo(
    () =>
      services
        .filter((s) => s.published && s.weekday === 6)
        .sort((a, b) => a.time.localeCompare(b.time)),
    [services],
  );

  const latestSermons = useMemo(
    () =>
      sermons
        .filter((s) => s.published)
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 3),
    [sermons],
  );

  return (
    <div>
      {/* ---------------- Hero ---------------- */}
      <section className="relative overflow-hidden rounded-b-[3rem] bg-gradient-to-br from-teal-600 via-teal-500 to-emerald-500">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-16 -top-20 h-64 w-64 rounded-full bg-amber-300/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 bottom-0 h-72 w-72 rounded-full bg-teal-300/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-1/3 top-1/3 h-40 w-40 rounded-full bg-amber-200/15 blur-2xl"
        />

        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pb-14 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:grid-cols-2 lg:gap-12">
          <div>
            <span className="inline-flex items-center rounded-full border border-white/25 bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur">
              {t("home.hero.badge")}
            </span>
            <h1 className="mt-5 text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
              {t("home.hero.title")}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-teal-50 sm:text-lg">
              {t("home.hero.subtitle")}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                type="button"
                onClick={() => onNavigate({ page: "schedule" })}
                className="min-h-11 rounded-full bg-amber-400 px-6 text-base font-bold text-amber-950 shadow-soft transition-all hover:-translate-y-0.5 hover:bg-amber-300"
              >
                {t("home.hero.btnSchedule")}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onNavigate({ page: "prayer" })}
                className="min-h-11 rounded-full border-white/60 bg-transparent px-6 text-base font-semibold text-white transition-all hover:bg-white/10 hover:text-white"
              >
                {t("home.hero.btnPrayer")}
              </Button>
            </div>
          </div>

          <div className="animate-float">
            <div className="rounded-3xl bg-white/10 p-2 shadow-soft backdrop-blur-sm">
              <Image
                src="/images/hero-church.png"
                alt=""
                width={1344}
                height={768}
                priority
                className="h-auto w-full rounded-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Verse strip ---------------- */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="mb-5 flex items-center justify-center gap-2 text-center text-xs font-bold uppercase tracking-[0.18em] text-teal-600">
          <span className="inline-block h-px w-6 bg-amber-400" aria-hidden="true" />
          {t("home.verse.title")}
          <span className="inline-block h-px w-6 bg-amber-400" aria-hidden="true" />
        </p>
        <VerseCard
          text={t("home.verse.text")}
          reference={t("home.verse.ref")}
          className="mx-auto max-w-3xl"
        />
      </section>

      {/* ---------------- Announcements ---------------- */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <SectionHeading title={t("home.announcements")} align="center" />

        {publishedAnnouncements.length === 0 ? (
          <EmptyState icon={<Megaphone className="h-6 w-6" aria-hidden="true" />} title={t("home.announcements.empty")} />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {publishedAnnouncements.map((a) => (
              <article
                key={a.id}
                className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-soft sm:p-6"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                    <Megaphone className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold leading-snug sm:text-lg">{loc(a.title)}</h3>
                      {a.pinned ? (
                        <span className="rounded-full bg-amber-200/80 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-amber-800">
                          {loc({ ru: "Закреплено", tj: "" })}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-stone-600">{loc(a.text)}</p>
                    <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-amber-700">
                      <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                      <time dateTime={a.startDate}>{formatDate(a.startDate)}</time>
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* ---------------- Quick cards ---------------- */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_CARDS.map((card) => (
            <button
              key={card.keyPrefix}
              type="button"
              onClick={() => onNavigate(card.view)}
              aria-label={t(`${card.keyPrefix}.title`)}
              className="group rounded-3xl border border-teal-100/70 bg-white p-6 text-left shadow-card transition-all hover:-translate-y-0.5 hover:shadow-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-600"
            >
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 transition-colors group-hover:bg-teal-600 group-hover:text-white">
                <card.icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="text-lg font-semibold leading-snug">{t(`${card.keyPrefix}.title`)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">{t(`${card.keyPrefix}.text`)}</p>
            </button>
          ))}
        </div>
      </section>

      {/* ---------------- Who we are teaser ---------------- */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="order-2 lg:order-1">
            <Image
              src="/images/prayer-hands.png"
              alt={loc({ ru: "Иллюстрация: руки, сложенные в молитве", tj: "Акс: дастҳо дар дуо" })}
              width={1152}
              height={864}
              className="h-auto w-full rounded-3xl border border-teal-100/70 object-cover shadow-soft"
            />
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-2xl font-semibold leading-snug sm:text-3xl">{t("home.about.title")}</h2>
            <p className="mt-4 leading-relaxed text-stone-600">{t("home.about.text")}</p>
            <Button
              type="button"
              variant="outline"
              onClick={() => onNavigate({ page: "about" })}
              className="mt-6 min-h-11 rounded-full border-teal-300 bg-white px-6 text-base font-semibold text-teal-800 transition-all hover:-translate-y-0.5 hover:bg-teal-50 hover:text-teal-900"
            >
              {t("home.about.link")}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </section>

      {/* ---------------- Upcoming (Sabbath) services ---------------- */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <SectionHeading title={t("home.upcoming.title")} align="center" />

        {sabbathServices.length === 0 ? (
          <EmptyState
            icon={<CalendarDays className="h-6 w-6" aria-hidden="true" />}
            title={loc({ ru: "Субботние службы пока не опубликованы", tj: "" })}
            description={t("home.upcoming.intro")}
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sabbathServices.map((s) => (
              <article
                key={s.id}
                className="flex flex-col rounded-3xl border border-teal-100/70 bg-white p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-soft"
              >
                <p className="font-mono text-3xl font-bold tracking-tight text-teal-700">{s.time}</p>
                <h3 className="mt-3 text-lg font-semibold leading-snug">{loc(s.title)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">{loc(s.description)}</p>
              </article>
            ))}
          </div>
        )}

        <p className="mx-auto mt-6 max-w-xl text-center text-sm leading-relaxed text-stone-600">
          {t("home.upcoming.intro")}
        </p>
        <div className="mt-4 flex justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => onNavigate({ page: "schedule" })}
            className="min-h-11 rounded-full border-teal-300 bg-white px-6 font-semibold text-teal-800 transition-all hover:-translate-y-0.5 hover:bg-teal-50 hover:text-teal-900"
          >
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            {t("nav.schedule")}
          </Button>
        </div>
      </section>

      {/* ---------------- Latest sermons ---------------- */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <SectionHeading title={t("home.sermons.title")} align="center" />

        {latestSermons.length === 0 ? (
          <EmptyState
            icon={<BookOpen className="h-6 w-6" aria-hidden="true" />}
            title={loc({ ru: "Проповеди пока не опубликованы", tj: "" })}
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {latestSermons.map((sermon) => (
              <article
                key={sermon.id}
                className="flex flex-col rounded-3xl border border-teal-100/70 bg-white p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-soft"
              >
                <span className="inline-flex w-fit items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800">
                  <BookOpen className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                  {loc(sermon.scripture)}
                </span>
                <h3 className="mt-3 text-lg font-semibold leading-snug">{loc(sermon.title)}</h3>
                <p className="mt-auto pt-4 text-sm text-stone-500">
                  <span className="font-semibold text-teal-700">{loc(sermon.speaker)}</span>
                  <span aria-hidden="true"> · </span>
                  <time dateTime={sermon.date}>{formatDate(sermon.date)}</time>
                </p>
              </article>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => onNavigate({ page: "media" })}
            className="min-h-11 rounded-full border-teal-300 bg-white px-6 font-semibold text-teal-800 transition-all hover:-translate-y-0.5 hover:bg-teal-50 hover:text-teal-900"
          >
            {t("home.sermons.all")}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </section>

      {/* ---------------- Final CTA ---------------- */}
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-4 sm:px-6 sm:pb-20">
        <div className="rounded-3xl border border-teal-100 bg-teal-50 px-6 py-10 text-center shadow-card sm:px-12 sm:py-14">
          <h2 className="text-2xl font-semibold leading-snug sm:text-3xl">{t("home.cta.title")}</h2>
          <p className="mx-auto mt-3 max-w-2xl leading-relaxed text-stone-600">{t("home.cta.text")}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              type="button"
              onClick={() => onNavigate({ page: "schedule" })}
              className="min-h-11 rounded-full bg-teal-600 px-6 text-base font-semibold text-teal-50 shadow-soft transition-all hover:-translate-y-0.5 hover:bg-teal-700"
            >
              {t("home.cta.btn")}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onNavigate({ page: "contact" })}
              className="min-h-11 rounded-full border-teal-300 bg-white px-6 text-base font-semibold text-teal-800 transition-all hover:-translate-y-0.5 hover:bg-teal-100/60 hover:text-teal-900"
            >
              {t("home.cta.btn2")}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
