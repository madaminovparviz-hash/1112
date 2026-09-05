"use client";

/**
 * LessonsPage — Sabbath School lessons (public view).
 * Self-sufficient lesson cards: number, title, Sabbath date, summary,
 * key verse block and a PDF download (or a friendly "no PDF" note).
 */

import { BookMarked, BookOpen, CalendarDays, Download, FileX, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useDateFormatter, useLoc, useT } from "@/lib/i18n";
import { useChurchStore } from "@/lib/store/useChurchStore";
import { EmptyState, PageHeader } from "../shared";

export default function LessonsPage() {
  const t = useT();
  const loc = useLoc();
  const formatDate = useDateFormatter();
  const lessons = useChurchStore((s) => s.data.lessons);

  const published = lessons
    .filter((l) => l.published)
    .sort((a, b) => a.startDate.localeCompare(b.startDate) || a.number - b.number);

  return (
    <div>
      <PageHeader
        title={t("lessons.title")}
        subtitle={t("lessons.subtitle")}
        icon={<BookOpen className="h-7 w-7" aria-hidden="true" />}
      />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16" aria-label={t("lessons.title")}>
        {/* Quarter banner */}
        <div className="rounded-3xl border border-teal-100/70 bg-gradient-to-br from-teal-50 to-amber-50 p-6 shadow-card sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/80 text-teal-600 shadow-soft">
              <BookMarked className="h-7 w-7" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-600">
                {t("lessons.quarter.label")}
              </p>
              <h2 className="mt-1.5 font-serif text-2xl font-semibold leading-snug sm:text-3xl">
                {t("lessons.quarter.title")}
              </h2>
            </div>
          </div>
          <Alert className="mt-6 rounded-2xl border-amber-200/80 bg-white/70">
            <Info className="text-amber-600" aria-hidden="true" />
            <AlertDescription className="text-stone-600">{t("lessons.materialsNote")}</AlertDescription>
          </Alert>
        </div>

        {/* Lessons list */}
        {published.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              icon={<BookOpen className="h-7 w-7" aria-hidden="true" />}
              title={t("lessons.empty")}
            />
          </div>
        ) : (
          <ol className="mt-10 space-y-5">
            {published.map((lesson) => (
              <li key={lesson.id}>
                <article className="rounded-3xl border border-teal-100/70 bg-white p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-soft">
                  <div className="flex flex-col gap-5 sm:flex-row">
                    {/* Number badge */}
                    <div
                      aria-hidden="true"
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal-600 shadow-card"
                    >
                      <span className="font-serif text-sm font-semibold text-teal-50">
                        №{lesson.number}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                        <h3 className="font-serif text-lg font-semibold leading-snug sm:text-xl">
                          {loc(lesson.title)}
                        </h3>
                        <p className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                          <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>
                            {t("lessons.date")}:{" "}
                            {formatDate(lesson.startDate, { weekday: "long" })}
                          </span>
                        </p>
                      </div>

                      <p className="mt-2.5 leading-relaxed text-stone-600">{loc(lesson.summary)}</p>

                      {/* Key verse */}
                      <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-700">
                          {t("lessons.keyVerse")}
                        </p>
                        <p className="mt-1.5 font-serif text-base italic leading-relaxed text-stone-700">
                          «{loc(lesson.keyVerse)}»
                        </p>
                        <p className="mt-1.5 text-sm font-bold text-amber-700">
                          {loc(lesson.verseRef)}
                        </p>
                      </div>

                      {/* Download / no-pdf note */}
                      <div className="mt-4">
                        {lesson.pdfUrl ? (
                          <Button
                            asChild
                            variant="outline"
                            className="min-h-11 rounded-full border-teal-200 bg-white text-teal-700 hover:bg-teal-50 hover:text-teal-800"
                          >
                            <a href={lesson.pdfUrl} download aria-label={t("lessons.download")}>
                              <Download className="h-4 w-4" aria-hidden="true" />
                              {t("lessons.download")}
                            </a>
                          </Button>
                        ) : (
                          <p className="inline-flex items-center gap-2 text-sm text-stone-500">
                            <FileX className="h-4 w-4 text-stone-400" aria-hidden="true" />
                            {t("lessons.noPdf")}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
