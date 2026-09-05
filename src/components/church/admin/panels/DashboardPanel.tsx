"use client";

/**
 * Admin dashboard: stat cards, prayers-by-status mini bar chart (pure CSS),
 * recent activity feed and quick-action shortcuts to other sections.
 */

import { useMemo } from "react";
import {
  BookOpen,
  CalendarDays,
  FilePlus2,
  HeartHandshake,
  Mail,
  Megaphone,
  Mic,
  type LucideIcon,
} from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useDateFormatter, useT } from "@/lib/i18n";
import { useCanView, type AdminSection } from "@/lib/permissions";
import { useChurchStore } from "@/lib/store/useChurchStore";
import type { PrayerStatus } from "@/lib/store/types";

interface StatCard {
  key: string;
  count: number;
  icon: LucideIcon;
  labelKey: string;
  bg: string;
  text: string;
}

const PRAYER_STATUSES: PrayerStatus[] = ["new", "in_prayer", "prayed", "archived"];

const PRAYER_BAR_COLORS: Record<PrayerStatus, string> = {
  new: "bg-amber-400",
  in_prayer: "bg-teal-500",
  prayed: "bg-emerald-500",
  archived: "bg-stone-300",
};

const QUICK_ACTIONS: { section: AdminSection; labelKey: string; icon: LucideIcon }[] = [
  { section: "lessons", labelKey: "admin.quick.addLesson", icon: BookOpen },
  { section: "sermons", labelKey: "admin.quick.addSermon", icon: Mic },
  { section: "announcements", labelKey: "admin.quick.addAnnouncement", icon: Megaphone },
  { section: "prayers", labelKey: "admin.quick.openPrayers", icon: HeartHandshake },
];

export default function DashboardPanel({
  onNavigateSection,
}: {
  onNavigateSection?: (section: AdminSection) => void;
}) {
  const t = useT();
  const formatDate = useDateFormatter();

  const services = useChurchStore((s) => s.data.services);
  const lessons = useChurchStore((s) => s.data.lessons);
  const sermons = useChurchStore((s) => s.data.sermons);
  const prayers = useChurchStore((s) => s.data.prayers);
  const messages = useChurchStore((s) => s.data.messages);
  const customPages = useChurchStore((s) => s.data.customPages);
  const actionLog = useChurchStore((s) => s.data.actionLog);

  // Unconditional hooks for quick-action availability (viewer cannot open prayers).
  const canViewLessons = useCanView("lessons");
  const canViewSermons = useCanView("sermons");
  const canViewAnnouncements = useCanView("announcements");
  const canViewPrayers = useCanView("prayers");
  const quickCanView: Record<string, boolean> = {
    lessons: canViewLessons,
    sermons: canViewSermons,
    announcements: canViewAnnouncements,
    prayers: canViewPrayers,
  };

  const stats: StatCard[] = useMemo(
    () => [
      {
        key: "newPrayers",
        count: prayers.filter((p) => p.status === "new").length,
        icon: HeartHandshake,
        labelKey: "admin.stat.newPrayers",
        bg: "bg-amber-50",
        text: "text-amber-600",
      },
      {
        key: "unreadMessages",
        count: messages.filter((m) => !m.read).length,
        icon: Mail,
        labelKey: "admin.stat.unreadMessages",
        bg: "bg-teal-50",
        text: "text-teal-600",
      },
      {
        key: "lessons",
        count: lessons.filter((l) => l.published).length,
        icon: BookOpen,
        labelKey: "admin.stat.lessons",
        bg: "bg-emerald-50",
        text: "text-emerald-600",
      },
      {
        key: "sermons",
        count: sermons.filter((s) => s.published).length,
        icon: Mic,
        labelKey: "admin.stat.sermons",
        bg: "bg-orange-50",
        text: "text-orange-600",
      },
      {
        key: "services",
        count: services.filter((s) => s.published).length,
        icon: CalendarDays,
        labelKey: "admin.stat.services",
        bg: "bg-teal-50",
        text: "text-teal-700",
      },
      {
        key: "pages",
        count: customPages.filter((p) => p.published).length,
        icon: FilePlus2,
        labelKey: "admin.stat.pages",
        bg: "bg-violet-50",
        text: "text-violet-600",
      },
    ],
    [services, lessons, sermons, prayers, messages, customPages],
  );

  const statusCounts = useMemo(
    () =>
      PRAYER_STATUSES.map((status) => ({
        status,
        count: prayers.filter((p) => p.status === status).length,
      })),
    [prayers],
  );
  const maxStatusCount = Math.max(1, ...statusCounts.map((s) => s.count));

  const recent = useMemo(() => actionLog.slice(0, 8), [actionLog]);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
        <h1 className="font-serif text-2xl font-semibold sm:text-3xl">
          {t("admin.dashboard.title")}
        </h1>
        <p className="mt-1 text-sm text-stone-600">{t("admin.dashboard.subtitle")}</p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map(({ key, count, icon: Icon, labelKey, bg, text }) => (
          <div
            key={key}
            className="flex items-center gap-4 rounded-3xl bg-white p-5 shadow-card sm:p-6"
          >
            <span
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${bg} ${text}`}
              aria-hidden="true"
            >
              <Icon className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <p className="font-serif text-3xl font-semibold leading-none">{count}</p>
              <p className="mt-1.5 text-sm leading-snug text-stone-600">{t(labelKey)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Prayers by status — pure CSS bar chart */}
        <section
          aria-label={t("admin.dashboard.prayersByStatus")}
          className="rounded-3xl bg-white p-6 shadow-card"
        >
          <h2 className="mb-4 font-serif text-lg font-semibold">
            {t("admin.dashboard.prayersByStatus")}
          </h2>
          <div className="space-y-3">
            {statusCounts.map(({ status, count }) => (
              <div key={status} className="flex items-center gap-3">
                <span className="w-28 shrink-0 text-xs font-semibold text-stone-600 sm:w-32">
                  {t(`admin.prayers.status.${status}`)}
                </span>
                <span
                  className="h-3 flex-1 overflow-hidden rounded-full bg-stone-100"
                  role="img"
                  aria-label={`${t(`admin.prayers.status.${status}`)}: ${count}`}
                >
                  <span
                    className={`block h-full rounded-full ${PRAYER_BAR_COLORS[status]}`}
                    style={{ width: `${Math.round((count / maxStatusCount) * 100)}%` }}
                  />
                </span>
                <span className="w-6 shrink-0 text-right text-sm font-bold text-stone-700">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Recent activity */}
        <section
          aria-label={t("admin.dashboard.recentActivity")}
          className="rounded-3xl bg-white p-6 shadow-card"
        >
          <h2 className="mb-4 font-serif text-lg font-semibold">
            {t("admin.dashboard.recentActivity")}
          </h2>
          {recent.length === 0 ? (
            <p className="text-sm text-stone-500">—</p>
          ) : (
            <ScrollArea className="max-h-64 pr-3">
              <ul className="space-y-3">
                {recent.map((entry) => (
                  <li key={entry.id} className="flex items-start gap-2.5">
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-teal-500"
                    />
                    <div className="min-w-0">
                      <p className="text-sm leading-snug text-stone-700">{entry.action}</p>
                      <p className="mt-0.5 text-xs text-stone-400">
                        {entry.user} · {formatDate(entry.at)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          )}
        </section>
      </div>

      {/* Quick actions */}
      <section
        aria-label={t("admin.dashboard.quickLinks")}
        className="rounded-3xl bg-white p-6 shadow-card"
      >
        <h2 className="mb-4 font-serif text-lg font-semibold">
          {t("admin.dashboard.quickLinks")}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {QUICK_ACTIONS.map(({ section, labelKey, icon: Icon }) => (
            <button
              key={section}
              type="button"
              disabled={!quickCanView[section]}
              onClick={() => onNavigateSection?.(section)}
              className="flex min-h-11 items-center gap-3 rounded-2xl border border-teal-100 bg-teal-50/50 px-4 py-3 text-sm font-semibold text-teal-800 transition-colors hover:border-teal-300 hover:bg-teal-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Icon className="h-4.5 w-4.5 shrink-0 text-teal-600" aria-hidden="true" />
              {t(labelKey)}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
