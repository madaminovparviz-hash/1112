"use client";

/**
 * ChurchApp — the whole single-page application:
 *  public pages + page-builder pages + admin panel, hash-navigated.
 *
 * The mounted gate (below) prevents hydration mismatches caused by the
 * localStorage demo database rehydrating on the client. While it waits,
 * a calm branded skeleton is shown for a moment.
 */

import { useEffect, useMemo, useSyncExternalStore } from "react";
import { Loader2 } from "lucide-react";
import { LangProvider, useT } from "@/lib/i18n";
import { useHashRoute } from "@/lib/hooks/useHashRoute";
import { useChurchStore } from "@/lib/store/useChurchStore";
import Header, { type NavItem } from "./Header";
import Footer from "./Footer";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import SchedulePage from "./pages/SchedulePage";
import LessonsPage from "./pages/LessonsPage";
import MediaPage from "./pages/MediaPage";
import PrayerPage from "./pages/PrayerPage";
import ContactPage from "./pages/ContactPage";
import CustomPageView from "./pages/CustomPageView";
import AdminApp from "./admin/AdminApp";
import type { View } from "@/lib/store/types";

function BrandedSplash() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background" role="status" aria-live="polite">
      <Loader2 className="h-8 w-8 animate-spin text-teal-600" aria-hidden="true" />
      <p className="text-sm font-semibold text-stone-500">…</p>
    </div>
  );
}

const noopSubscribe = () => () => {};

function Shell() {
  const t = useT();
  const [view, navigate] = useHashRoute();
  // Client-only flag via external store: false on the server, true after
  // hydration — lets the localStorage-backed UI render without mismatches.
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
  const customPages = useChurchStore((s) => s.data.customPages);

  const items: NavItem[] = useMemo(() => {
    const base: NavItem[] = [
      { view: { page: "home" }, label: t("nav.home") },
      { view: { page: "about" }, label: t("nav.about") },
      { view: { page: "schedule" }, label: t("nav.schedule") },
      { view: { page: "lessons" }, label: t("nav.lessons") },
      { view: { page: "media" }, label: t("nav.media") },
      { view: { page: "prayer" }, label: t("nav.prayer") },
      { view: { page: "contact" }, label: t("nav.contact") },
    ];
    // Page-builder pages (published & flagged showInNav) join the menu.
    const extras = customPages
      .filter((p) => p.published && p.showInNav)
      .map<NavItem>((p) => ({
        view: { page: "custom", param: p.slug },
        label: p.title.ru || p.slug,
      }));
    return [...base, ...extras];
  }, [t, customPages]);

  // Scroll to top when the page changes (not when language/text size changes).
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [view.page, view.param]);

  if (!mounted) return <BrandedSplash />;

  const renderPage = () => {
    switch (view.page) {
      case "home":
        return <HomePage onNavigate={navigate} />;
      case "about":
        return <AboutPage />;
      case "schedule":
        return <SchedulePage onNavigate={navigate} />;
      case "lessons":
        return <LessonsPage />;
      case "media":
        return <MediaPage />;
      case "prayer":
        return <PrayerPage />;
      case "contact":
        return <ContactPage />;
      case "custom":
        return <CustomPageView slug={view.param ?? ""} />;
      case "admin":
        return <AdminApp onNavigate={navigate} />;
      default:
        return <HomePage onNavigate={navigate} />;
    }
  };

  const active: View = view;

  return (
    <div className="flex min-h-screen flex-col">
      <Header items={items} active={active} onNavigate={navigate} />
      <main className="flex-1 animate-page-in" key={`${view.page}:${view.param ?? ""}`}>
        {renderPage()}
      </main>
      <Footer items={items} onNavigate={navigate} />
    </div>
  );
}

export default function ChurchApp() {
  return (
    <LangProvider>
      <Shell />
    </LangProvider>
  );
}
