"use client";

/**
 * Site header: sticky, airy, with language switcher (RU/TJ) and the
 * accessibility text-size control (A− / A / A+) for older congregation members.
 */

import { useState } from "react";
import { CalendarDays, Church, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useLang, useT } from "@/lib/i18n";
import { useTextSize } from "@/lib/hooks/useTextSize";
import type { View } from "@/lib/store/types";
import { cn } from "@/lib/utils";

export interface NavItem {
  view: View;
  label: string;
}

export default function Header({
  items,
  active,
  onNavigate,
}: {
  items: NavItem[];
  active: View;
  onNavigate: (view: View) => void;
}) {
  const t = useT();
  const { lang, setLang } = useLang();
  const textSize = useTextSize();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (item: NavItem) => {
    if (item.view.page === "custom") {
      return active.page === "custom" && active.param === item.view.param;
    }
    return active.page === item.view.page;
  };

  const go = (item: NavItem) => {
    setMenuOpen(false);
    onNavigate(item.view);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-teal-100/70 bg-[#fdfaf4]/85 shadow-[0_1px_0_0_rgb(20_184_166/0.06)] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:h-[4.5rem] sm:px-6">
        {/* Logo */}
        <button
          type="button"
          onClick={() => onNavigate({ page: "home" })}
          className="flex min-w-0 items-center gap-2.5 rounded-xl px-1 py-1 text-left outline-ring/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-600"
          aria-label={t("common.appNameFull")}
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-600 to-emerald-500 text-white shadow-card">
            <Church className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block truncate font-serif text-base font-semibold leading-tight text-teal-900 sm:text-lg">
              {t("common.appName")}
            </span>
            <span className="hidden truncate text-[11px] font-medium uppercase tracking-wider text-amber-600 sm:block">
              {t("common.tagline")}
            </span>
          </span>
        </button>

        <div className="flex-1" aria-hidden="true" />

        {/* Desktop nav */}
        <nav aria-label="Основная навигация" className="hidden items-center gap-0.5 lg:flex">
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => go(item)}
              aria-current={isActive(item) ? "page" : undefined}
              className={cn(
                "rounded-full px-3.5 py-2 text-sm font-semibold transition-colors outline-ring/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-600",
                isActive(item)
                  ? "bg-teal-600 text-teal-50 shadow-card"
                  : "text-stone-700 hover:bg-teal-50 hover:text-teal-800",
              )}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Controls: text size + language */}
        <div className="flex items-center gap-1.5">
          <div
            className="hidden items-center rounded-full border border-teal-200 bg-white p-0.5 sm:flex"
            role="group"
            aria-label={t("common.textSize")}
          >
            <TextSizeButton label="A−" title={t("common.decreaseText")} onClick={textSize.decrease} disabled={textSize.size === "normal"} />
            <TextSizeButton label="A" title={t("common.increaseText")} onClick={textSize.increase} disabled={textSize.size === "xlarge"} large />
          </div>

          <div
            className="flex items-center rounded-full border border-teal-200 bg-white p-0.5"
            role="group"
            aria-label={t("common.language")}
          >
            <LangButton label="RU" active={lang === "ru"} onClick={() => setLang("ru")} />
            <LangButton label="ТҶ" active={lang === "tj"} onClick={() => setLang("tj")} />
          </div>

          {/* Mobile menu */}
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="outline" size="icon" aria-label={t("nav.openMenu")} className="rounded-full border-teal-200">
                <Menu className="h-5 w-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 border-teal-100 bg-[#fdfaf4]">
              <SheetHeader className="text-left">
                <SheetTitle className="flex items-center gap-2 font-serif text-teal-900">
                  <Church className="h-5 w-5 text-teal-600" aria-hidden="true" />
                  {t("common.appName")}
                </SheetTitle>
              </SheetHeader>
              <nav aria-label="Мобильная навигация" className="mt-2 flex flex-col gap-1 px-3">
                {items.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => go(item)}
                    aria-current={isActive(item) ? "page" : undefined}
                    className={cn(
                      "flex min-h-11 items-center rounded-xl px-4 py-2.5 text-left text-[15px] font-semibold transition-colors",
                      isActive(item)
                        ? "bg-teal-600 text-teal-50 shadow-card"
                        : "text-stone-700 hover:bg-teal-50",
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
              <div className="mt-4 space-y-3 border-t border-teal-100 px-4 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-stone-600">{t("common.language")}</span>
                  <div className="flex rounded-full border border-teal-200 bg-white p-0.5">
                    <LangButton label="RU" active={lang === "ru"} onClick={() => setLang("ru")} />
                    <LangButton label="ТҶ" active={lang === "tj"} onClick={() => setLang("tj")} />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-stone-600">{t("common.textSize")}</span>
                  <div className="flex rounded-full border border-teal-200 bg-white p-0.5">
                    <TextSizeButton label="A−" title={t("common.decreaseText")} onClick={textSize.decrease} disabled={textSize.size === "normal"} />
                    <TextSizeButton label="A" title={t("common.increaseText")} onClick={textSize.increase} disabled={textSize.size === "xlarge"} large />
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-2xl bg-amber-50 p-3 text-xs leading-relaxed text-amber-800">
                  <CalendarDays className="h-8 w-8 shrink-0 text-amber-500" aria-hidden="true" />
                  {t("footer.timesText")}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function LangButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "min-h-8 min-w-10 rounded-full px-2.5 text-xs font-extrabold tracking-wide transition-colors outline-ring/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-600",
        active ? "bg-teal-600 text-teal-50 shadow-card" : "text-stone-600 hover:text-teal-700",
      )}
    >
      {label}
    </button>
  );
}

function TextSizeButton({
  label,
  title,
  onClick,
  disabled,
  large = false,
}: {
  label: string;
  title: string;
  onClick: () => void;
  disabled: boolean;
  large?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      disabled={disabled}
      className={cn(
        "flex h-8 items-center justify-center rounded-full px-2 font-serif font-bold text-stone-600 transition-colors outline-ring/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-600 disabled:opacity-40",
        large ? "text-base" : "text-sm",
        !disabled && "hover:bg-teal-50 hover:text-teal-700",
      )}
    >
      {label}
    </button>
  );
}
