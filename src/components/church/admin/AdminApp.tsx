"use client";

/**
 * Admin panel shell: login screen + full-height layout with sidebar / mobile
 * chip navigation and a switch over all admin section panels.
 * Owned by agent 2-c (admin-core). Panels of agent 2-d are imported by contract.
 */

import { useState, type FormEvent } from "react";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Church,
  CircleUser,
  FilePlus2,
  HeartHandshake,
  KeyRound,
  LayoutDashboard,
  LogIn,
  LogOut,
  Mail,
  Megaphone,
  Mic,
  PanelLeft,
  Settings,
  ShieldCheck,
  Type,
  Users,
  Youtube,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useT } from "@/lib/i18n";
import { useCanView, type AdminSection } from "@/lib/permissions";
import { useChurchStore } from "@/lib/store/useChurchStore";
import type { View } from "@/lib/store/types";

import DashboardPanel from "./panels/DashboardPanel";
import LessonsPanel from "./panels/LessonsPanel";
import SchedulePanel from "./panels/SchedulePanel";
import SermonsPanel from "./panels/SermonsPanel";
// ── Contract: panels implemented by agent 2-d (do NOT create here) ──────────
import VideosPanel from "./panels/VideosPanel";
import PrayersPanel from "./panels/PrayersPanel";
import MessagesPanel from "./panels/MessagesPanel";
import AnnouncementsPanel from "./panels/AnnouncementsPanel";
import PagesPanel from "./panels/PagesPanel";
import TextsPanel from "./panels/TextsPanel";
import UsersPanel from "./panels/UsersPanel";
import SettingsPanel from "./panels/SettingsPanel";

interface SectionConfig {
  key: AdminSection;
  icon: LucideIcon;
  labelKey: string;
}

const SECTIONS: SectionConfig[] = [
  { key: "dashboard", icon: LayoutDashboard, labelKey: "admin.nav.dashboard" },
  { key: "schedule", icon: CalendarDays, labelKey: "admin.nav.schedule" },
  { key: "lessons", icon: BookOpen, labelKey: "admin.nav.lessons" },
  { key: "sermons", icon: Mic, labelKey: "admin.nav.sermons" },
  { key: "videos", icon: Youtube, labelKey: "admin.nav.videos" },
  { key: "prayers", icon: HeartHandshake, labelKey: "admin.nav.prayers" },
  { key: "messages", icon: Mail, labelKey: "admin.nav.messages" },
  { key: "announcements", icon: Megaphone, labelKey: "admin.nav.announcements" },
  { key: "pages", icon: FilePlus2, labelKey: "admin.nav.pages" },
  { key: "texts", icon: Type, labelKey: "admin.nav.texts" },
  { key: "users", icon: Users, labelKey: "admin.nav.users" },
  { key: "settings", icon: Settings, labelKey: "admin.nav.settings" },
];

/** Login screen — centered warm card on a soft gradient. */
function LoginScreen() {
  const t = useT();
  const login = useChurchStore((s) => s.login);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = login(username, password);
    if (!result.ok) {
      setError(true);
      toast.error(t("admin.login.error"));
      return;
    }
    setError(false);
    const session = useChurchStore.getState().session;
    toast.success(`${t("admin.welcome")}, ${session?.displayName ?? ""}`);
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-gradient-to-br from-teal-50 via-background to-amber-50 px-4 py-12">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-soft sm:p-8">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-500 text-white shadow-soft">
          <Church className="h-8 w-8" aria-hidden="true" />
        </div>
        <h1 className="text-center font-serif text-2xl font-semibold sm:text-3xl">
          {t("admin.login.title")}
        </h1>
        <p className="mt-2 text-center text-sm text-stone-600">
          {t("admin.login.subtitle")}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="admin-login-username">{t("admin.login.username")}</Label>
            <Input
              id="admin-login-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="admin-login-password">{t("admin.login.password")}</Label>
            <Input
              id="admin-login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {error ? (
            <p role="alert" className="text-sm font-medium text-red-600">
              {t("admin.login.error")}
            </p>
          ) : null}

          <Button type="submit" className="h-11 w-full text-base">
            <LogIn className="h-4 w-4" aria-hidden="true" />
            {t("admin.login.submit")}
          </Button>
        </form>

        <div className="mt-6 flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">
          <KeyRound className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
          <span>{t("admin.login.demo")}</span>
        </div>

        <p className="mt-4 flex items-start gap-1.5 text-[11px] leading-relaxed text-stone-400">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {t("admin.login.privacy")}
        </p>
      </div>
    </div>
  );
}

export default function AdminApp({ onNavigate }: { onNavigate?: (view: View) => void }) {
  const t = useT();
  const session = useChurchStore((s) => s.session);
  const logout = useChurchStore((s) => s.logout);

  const [section, setSection] = useState<AdminSection>("dashboard");

  // Hooks must be unconditional: call useCanView for ALL 12 sections.
  const canView: Record<AdminSection, boolean> = {
    dashboard: useCanView("dashboard"),
    schedule: useCanView("schedule"),
    lessons: useCanView("lessons"),
    sermons: useCanView("sermons"),
    videos: useCanView("videos"),
    prayers: useCanView("prayers"),
    messages: useCanView("messages"),
    announcements: useCanView("announcements"),
    pages: useCanView("pages"),
    texts: useCanView("texts"),
    users: useCanView("users"),
    settings: useCanView("settings"),
  };

  const visibleSections = SECTIONS.filter((s) => canView[s.key]);

  if (!session) {
    return <LoginScreen />;
  }

  // Derived fallback: if the current section became unviewable (role change),
  // render the dashboard instead — no effect / cascading render needed.
  const activeSection: AdminSection = canView[section] ? section : "dashboard";

  const currentConfig =
    SECTIONS.find((s) => s.key === activeSection) ?? SECTIONS[0];
  const currentLabel = t(currentConfig.labelKey);

  function handleLogout() {
    logout();
    toast.success(t("admin.logout"));
  }

  const navButtonClass = (active: boolean) =>
    `flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
      active
        ? "bg-teal-600 text-teal-50 shadow-card"
        : "text-stone-600 hover:bg-teal-50 hover:text-teal-800"
    }`;

  const chipClass = (active: boolean) =>
    `whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
      active
        ? "border-teal-600 bg-teal-600 text-white"
        : "border-teal-100 bg-white text-stone-600 hover:border-teal-300 hover:text-teal-800"
    }`;

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-teal-100 bg-white/80 backdrop-blur">
        <div className="flex items-center gap-2 px-3 py-2.5 sm:px-5">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-600 to-emerald-500 text-white shadow-card">
              <PanelLeft className="h-4.5 w-4.5" aria-hidden="true" />
            </span>
            <span className="truncate font-serif text-base font-semibold sm:text-lg">
              {t("common.appName")}
            </span>
            <span className="hidden truncate text-sm text-stone-500 md:inline">
              · {currentLabel}
            </span>
          </div>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            <Badge className="hidden border-teal-200 bg-teal-100 text-teal-800 sm:inline-flex">
              {t("admin.role")}: {session.role}
            </Badge>
            <span className="hidden max-w-40 items-center gap-1.5 truncate rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800 md:inline-flex">
              <CircleUser className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">{session.displayName}</span>
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate?.({ page: "home" })}
              aria-label={t("common.backToSite")}
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span className="hidden lg:inline">{t("common.backToSite")}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
              aria-label={t("admin.logout")}
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              <span className="hidden lg:inline">{t("admin.logout")}</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Desktop sidebar */}
        <nav
          aria-label={t("admin.login.title")}
          className="hidden w-60 shrink-0 flex-col gap-1 border-r border-teal-100 bg-sidebar p-3 lg:flex"
        >
          {visibleSections.map(({ key, icon: Icon, labelKey }) => (
            <button
              key={key}
              type="button"
              onClick={() => setSection(key)}
              className={navButtonClass(activeSection === key)}
              aria-current={activeSection === key ? "page" : undefined}
            >
              <Icon className="h-4.5 w-4.5 shrink-0" aria-hidden="true" />
              {t(labelKey)}
            </button>
          ))}
        </nav>

        {/* Content */}
        <main className="min-w-0 flex-1">
          {/* Mobile chip navigation */}
          <div className="overflow-x-auto border-b border-teal-100 bg-white/60 px-3 pt-3 lg:hidden">
            <div className="flex gap-1 pb-2" role="tablist" aria-label={currentLabel}>
              {visibleSections.map(({ key, icon: Icon, labelKey }) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={activeSection === key}
                  onClick={() => setSection(key)}
                  className={chipClass(activeSection === key)}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    {t(labelKey)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
            {activeSection === "dashboard" ? (
              <DashboardPanel onNavigateSection={setSection} />
            ) : null}
            {activeSection === "schedule" ? <SchedulePanel /> : null}
            {activeSection === "lessons" ? <LessonsPanel /> : null}
            {activeSection === "sermons" ? <SermonsPanel /> : null}
            {activeSection === "videos" ? <VideosPanel /> : null}
            {activeSection === "prayers" ? <PrayersPanel /> : null}
            {activeSection === "messages" ? <MessagesPanel /> : null}
            {activeSection === "announcements" ? <AnnouncementsPanel /> : null}
            {activeSection === "pages" ? <PagesPanel /> : null}
            {activeSection === "texts" ? <TextsPanel /> : null}
            {activeSection === "users" ? <UsersPanel /> : null}
            {activeSection === "settings" ? <SettingsPanel /> : null}
          </div>
        </main>
      </div>
    </div>
  );
}
