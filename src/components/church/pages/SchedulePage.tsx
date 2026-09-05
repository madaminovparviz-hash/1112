"use client";

/**
 * SchedulePage — weekly services grouped by weekday (Saturday first),
 * Sabbath & guest notes, address card with a warm map placeholder and a CTA.
 */

import { useMemo } from "react";
import { ArrowRight, CalendarDays, HandHeart, MapPin, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState, PageHeader } from "@/components/church/shared";
import { useLoc, useT } from "@/lib/i18n";
import { useChurchStore } from "@/lib/store/useChurchStore";
import type { View } from "@/lib/store/types";
import { cn } from "@/lib/utils";

/** Church week order: Saturday (Sabbath) first, then the other days. */
const DAY_ORDER = [6, 0, 1, 2, 3, 4, 5];

export default function SchedulePage({ onNavigate }: { onNavigate: (view: View) => void }) {
  const t = useT();
  const loc = useLoc();

  const services = useChurchStore((s) => s.data.services);
  const settings = useChurchStore((s) => s.data.settings);

  const published = useMemo(() => services.filter((s) => s.published), [services]);

  const groups = useMemo(
    () =>
      DAY_ORDER.map((day) => ({
        day,
        items: published
          .filter((s) => s.weekday === day)
          .sort((a, b) => a.time.localeCompare(b.time)),
      })).filter((g) => g.items.length > 0),
    [published],
  );

  return (
    <div>
      <PageHeader
        title={t("schedule.title")}
        subtitle={t("schedule.subtitle")}
        icon={<CalendarDays className="h-7 w-7" aria-hidden="true" />}
      />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="mx-auto max-w-2xl text-center leading-relaxed text-stone-600">{t("schedule.intro")}</p>

        {groups.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              icon={<CalendarDays className="h-6 w-6" aria-hidden="true" />}
              title={loc({ ru: "Расписание пока пусто", tj: "Ҷадвал ҳоло холист" })}
              description={t("schedule.subtitle")}
            />
          </div>
        ) : (
          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {groups.map((group) => {
              const isSabbath = group.day === 6;
              return (
                <article
                  key={group.day}
                  className={cn(
                    "rounded-3xl border p-6 shadow-card transition-all hover:shadow-soft sm:p-7",
                    isSabbath ? "border-amber-200 bg-amber-50/70 lg:col-span-2" : "border-teal-100/70 bg-white",
                  )}
                >
                  <header className="flex items-center gap-3">
                    {isSabbath ? (
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                        <Sun className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                    <h2 className="text-xl font-semibold sm:text-2xl">{t(`schedule.day.${group.day}`)}</h2>
                  </header>

                  <ul className="mt-4 space-y-3">
                    {group.items.map((service) => (
                      <li
                        key={service.id}
                        className={cn(
                          "flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-start sm:gap-4",
                          isSabbath ? "bg-white/80" : "bg-muted/60",
                        )}
                      >
                        <span className="inline-flex w-fit items-center rounded-xl bg-teal-50 px-3 py-2 font-mono text-sm font-bold tracking-tight text-teal-700 sm:shrink-0 sm:text-base">
                          {service.time}
                        </span>
                        <div className="min-w-0">
                          <h3 className="font-semibold leading-snug">{loc(service.title)}</h3>
                          {loc(service.description) ? (
                            <p className="mt-1 text-sm leading-relaxed text-stone-600">{loc(service.description)}</p>
                          ) : null}
                        </div>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        )}

        {/* Sabbath + guests notes */}
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <article className="rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-card transition-all hover:shadow-soft sm:p-7">
            <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
              <Sun className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="text-lg font-semibold leading-snug sm:text-xl">{t("schedule.sabbathNote.title")}</h2>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">{t("schedule.sabbathNote.text")}</p>
          </article>

          <article className="rounded-3xl border border-teal-100 bg-teal-50 p-6 shadow-card transition-all hover:shadow-soft sm:p-7">
            <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-100 text-teal-600">
              <HandHeart className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="text-lg font-semibold leading-snug sm:text-xl">{t("schedule.guests.title")}</h2>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">{t("schedule.guests.text")}</p>
          </article>
        </div>
      </section>

      {/* ---------------- Address ---------------- */}
      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 sm:pb-16">
        <article className="overflow-hidden rounded-3xl border border-teal-100/70 bg-white shadow-card">
          <div className="p-6 sm:p-8">
            <h2 className="text-xl font-semibold leading-snug sm:text-2xl">{t("schedule.address.title")}</h2>
            <p className="mt-3 flex items-start gap-2 leading-relaxed text-stone-600">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-teal-600" aria-hidden="true" />
              <span>{loc(settings.address)}</span>
            </p>
          </div>
          <div className="mx-6 mb-6 sm:mx-8 sm:mb-8">
            <div className="relative flex h-48 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-100 via-teal-50 to-amber-50">
              <div className="flex flex-col items-center gap-3 px-4 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-soft">
                  <MapPin className="h-6 w-6 text-teal-600" aria-hidden="true" />
                </span>
                <p className="max-w-md text-sm leading-relaxed text-stone-500">{t("schedule.address.hint")}</p>
              </div>
            </div>
          </div>
        </article>

        <div className="mt-8 flex justify-center">
          <Button
            type="button"
            onClick={() => onNavigate({ page: "contact" })}
            className="min-h-11 rounded-full bg-teal-600 px-6 text-base font-semibold text-teal-50 shadow-soft transition-all hover:-translate-y-0.5 hover:bg-teal-700"
          >
            {t("nav.contact")}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </section>
    </div>
  );
}
