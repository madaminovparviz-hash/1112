"use client";

/**
 * Warm light footer. Sticky-to-bottom behaviour is provided by the root
 * layout in ChurchApp (min-h-screen flex flex-col + mt-auto on footer):
 * it sticks on short pages and is pushed down naturally on long ones.
 */

import { Church, Clock, Lock, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useDateFormatter, useLang, useLoc, useT } from "@/lib/i18n";
import { useChurchStore } from "@/lib/store/useChurchStore";
import type { View } from "@/lib/store/types";
import type { NavItem } from "./Header";

export default function Footer({
  items,
  onNavigate,
}: {
  items: NavItem[];
  onNavigate: (view: View) => void;
}) {
  const t = useT();
  const loc = useLoc();
  const { lang } = useLang();
  const formatDate = useDateFormatter();
  const settings = useChurchStore((s) => s.data.settings);
  const services = useChurchStore((s) => s.data.services);
  const year = new Date().getFullYear();

  const sabbathServices = services
    .filter((s) => s.weekday === 6 && s.published)
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <footer className="mt-auto border-t border-teal-100 bg-gradient-to-b from-teal-50/70 via-amber-50/40 to-amber-50/70 pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Identity + verse */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-600 to-emerald-500 text-white shadow-card">
                <Church className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-serif text-base font-semibold text-teal-900 sm:text-lg">
                  {loc(settings.churchName)}
                </p>
                <p className="text-xs font-medium uppercase tracking-wider text-amber-600">
                  {t("common.tagline")}
                </p>
              </div>
            </div>
            <blockquote className="mt-5 max-w-md rounded-2xl border border-amber-200/70 bg-white/70 p-4 font-serif text-sm italic leading-relaxed text-stone-600">
              {t("footer.verse")}
              <span className="mt-1 block text-xs font-bold not-italic text-amber-700">
                {t("footer.verseRef")}
              </span>
            </blockquote>
          </div>

          {/* Nav */}
          <nav aria-label="Разделы сайта">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-teal-800">
              {t("footer.navTitle")}
            </h3>
            <ul className="space-y-1.5">
              {items.map((item) => (
                <li key={item.label}>
                  <button
                    type="button"
                    onClick={() => onNavigate(item.view)}
                    className="min-h-8 rounded px-0 text-left text-sm text-stone-600 transition-colors hover:text-teal-700 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-600"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contacts + schedule */}
          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-teal-800">
              {t("footer.contactsTitle")}
            </h3>
            <ul className="space-y-2.5 text-sm text-stone-600">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" aria-hidden="true" />
                <span>{loc(settings.address)}</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" aria-hidden="true" />
                <a href={`tel:${settings.phone.replace(/[^+\d]/g, "")}`} className="rounded transition-colors hover:text-teal-700 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-600">
                  {settings.phone}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" aria-hidden="true" />
                <a href={`mailto:${settings.email}`} className="rounded transition-colors hover:text-teal-700 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-600">
                  {settings.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" aria-hidden="true" />
                <span>
                  {sabbathServices.map((s) => (
                    <span key={s.id} className="block">
                      {s.time} — {loc(s.title)}
                    </span>
                  ))}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-6 bg-teal-100" />

        {/* Bottom bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs leading-relaxed text-stone-500">
            <p>
              © {year} {t("common.appName")}. {t("footer.rights")}
            </p>
            <p className="mt-1">{t("common.privacyNote")}</p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => onNavigate({ page: "admin" })}
            className="min-h-11 shrink-0 rounded-full border-amber-300 bg-white/80 text-amber-800 hover:bg-amber-50 hover:text-amber-900"
          >
            <Lock className="mr-2 h-4 w-4" aria-hidden="true" />
            <span className="flex flex-col items-start leading-tight">
              <span className="font-semibold">{t("footer.adminTitle")}</span>
              <span className="text-[10px] font-medium text-amber-600">
                {t("footer.adminHint")}
              </span>
            </span>
          </Button>
        </div>
      </div>
    </footer>
  );
}
