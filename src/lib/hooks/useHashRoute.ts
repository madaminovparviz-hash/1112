"use client";

/**
 * Minimal hash-based router for the single-page church app.
 * Routes: #/ #/about #/schedule #/lessons #/media #/prayer #/contact
 *         #/page/<slug> (page builder) #/admin
 * Hash routing keeps the browser back button working and never reloads,
 * so switching language or text size preserves scroll position.
 */

import { useCallback, useEffect, useState } from "react";
import type { View } from "@/lib/store/types";

const PAGES = ["home", "about", "schedule", "lessons", "media", "prayer", "contact"] as const;

export function parseHash(hash: string): View {
  const clean = hash.replace(/^#\/?/, "").split("?")[0];
  if (clean === "" || clean === "/") return { page: "home" };
  const [head, param] = clean.split("/");
  if (head === "admin") return { page: "admin" };
  if (head === "page" && param) return { page: "custom", param: decodeURIComponent(param) };
  if ((PAGES as readonly string[]).includes(head)) {
    return { page: head as (typeof PAGES)[number] };
  }
  return { page: "home" };
}

export function viewToHash(view: View): string {
  if (view.page === "home") return "#/";
  if (view.page === "admin") return "#/admin";
  if (view.page === "custom") return `#/page/${encodeURIComponent(view.param ?? "")}`;
  return `#/${view.page}`;
}

export function useHashRoute(): [View, (view: View) => void] {
  const [view, setView] = useState<View>(() =>
    typeof window === "undefined" ? { page: "home" } : parseHash(window.location.hash),
  );

  useEffect(() => {
    const onChange = () => setView(parseHash(window.location.hash));
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  const navigate = useCallback((next: View) => {
    const target = viewToHash(next);
    if (window.location.hash === target) {
      // Same route: still refresh the state (e.g. clicking active nav item).
      setView(next);
    } else {
      window.location.hash = target; // triggers hashchange → setView
    }
  }, []);

  return [view, navigate];
}
