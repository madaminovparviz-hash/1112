"use client";

/**
 * i18n provider for the church site.
 *
 * Resolution order for t(key) / loc(text):
 *   1. Admin override (store.data.textOverrides) for the current language
 *   2. DEFAULT_TEXTS for the current language
 *   3. Russian default (for ru) — for tj, a visible "[TJ translation needed]"
 *      marker followed by the Russian text, per project requirement:
 *      missing Tajik translations are NEVER silently replaced by Russian.
 *
 * The language is persisted in localStorage and read through a tiny external
 * store via useSyncExternalStore: the server snapshot is "ru", and React
 * re-renders to the saved language right after hydration — no mismatch.
 */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { DEFAULT_TEXTS } from "./translations";
import { useChurchStore } from "@/lib/store/useChurchStore";
import type { Lang, LocalizedText } from "@/lib/store/types";

export const TJ_PLACEHOLDER = "[TJ translation needed]";

/* ---------- tiny external store for the persisted language ---------- */

const LANG_STORAGE_KEY = "church-lang";
const langListeners = new Set<() => void>();
let cachedLang: Lang | null = null;

function readLang(): Lang {
  if (cachedLang) return cachedLang;
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    cachedLang = saved === "tj" ? "tj" : "ru";
  } catch {
    cachedLang = "ru";
  }
  return cachedLang;
}

function subscribeLang(onChange: () => void): () => void {
  langListeners.add(onChange);
  return () => langListeners.delete(onChange);
}

function writeLang(next: Lang) {
  cachedLang = next;
  try {
    localStorage.setItem(LANG_STORAGE_KEY, next);
  } catch {
    /* ignore (private mode) */
  }
  langListeners.forEach((listener) => listener());
}

/* ------------------------- React context ------------------------- */

interface LangContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

const LangContext = createContext<LangContextValue>({
  lang: "ru",
  setLang: () => {},
});

export function LangProvider({ children }: { children: ReactNode }) {
  const lang = useSyncExternalStore(
    subscribeLang,
    readLang,
    () => "ru" as Lang, // server snapshot → hydration-safe
  );

  const setLang = useCallback((next: Lang) => writeLang(next), []);

  const value = useMemo(() => ({ lang, setLang }), [lang, setLang]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): LangContextValue {
  return useContext(LangContext);
}

function clean(value: string | undefined | null): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Returns the translation function. `t` looks up flat keys like "nav.home".
 * Optional `vars` replaces {placeholders} inside the string.
 */
export function useT() {
  const { lang } = useLang();
  const overrides = useChurchStore((s) => s.data.textOverrides);

  return useCallback(
    (key: string, vars?: Record<string, string | number>): string => {
      const defaultEntry = DEFAULT_TEXTS[key];
      const override = overrides[key];
      let text: string;

      if (lang === "tj") {
        const tj = clean(override?.tj) || clean(defaultEntry?.tj);
        const ru = clean(override?.ru) || clean(defaultEntry?.ru);
        text = tj || `${TJ_PLACEHOLDER} ${ru}`;
      } else {
        const ru = clean(override?.ru) || clean(defaultEntry?.ru);
        const tj = clean(override?.tj) || clean(defaultEntry?.tj);
        text = ru || tj || key; // for ru, missing ru falls back to tj then key
      }

      if (vars) {
        for (const [name, val] of Object.entries(vars)) {
          text = text.replaceAll(`{${name}}`, String(val));
        }
      }
      return text;
    },
    [lang, overrides],
  );
}

/**
 * Returns a resolver for LocalizedText fields stored in the database
 * (lessons, sermons, services, pages…). Same missing-Tajik rule as t().
 */
export function useLoc() {
  const { lang } = useLang();
  return useCallback(
    (text: LocalizedText | undefined | null): string => {
      if (!text) return "";
      const ru = clean(text.ru);
      const tj = clean(text.tj);
      if (lang === "tj") return tj || `${TJ_PLACEHOLDER} ${ru}`;
      return ru || tj;
    },
    [lang],
  );
}

/** Locale-aware date formatting. Tajik falls back to Russian locale. */
export function useDateFormatter() {
  const { lang } = useLang();
  return useCallback(
    (iso: string | Date, options?: Intl.DateTimeFormatOptions): string => {
      const date = typeof iso === "string" ? new Date(iso) : iso;
      if (Number.isNaN(date.getTime())) return "";
      return new Intl.DateTimeFormat("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
        ...options,
      }).format(date);
    },
    [lang],
  );
}
