"use client";

/**
 * Admin → Тексты сайта.
 * Inline RU/TJ editor for every interface string (DEFAULT_TEXTS) with
 * per-row save/reset. Overrides live in the store (textOverrides).
 */

import { useCallback, useMemo, useState } from "react";
import { Languages, RotateCcw, Save, Search } from "lucide-react";
import { toast } from "sonner";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/church/shared";
import { useCanEdit } from "@/lib/permissions";
import { useT } from "@/lib/i18n";
import { useChurchStore } from "@/lib/store/useChurchStore";
import { DEFAULT_TEXTS, TEXT_GROUP_LABELS } from "@/lib/i18n/translations";

export default function TextsPanel() {
  const t = useT();
  const canEdit = useCanEdit("texts");

  const textOverrides = useChurchStore((s) => s.data.textOverrides);
  const setTextOverride = useChurchStore((s) => s.setTextOverride);
  const resetTextKey = useChurchStore((s) => s.resetTextKey);

  const [query, setQuery] = useState("");
  // Local draft per key; falls back to the effective value when absent.
  const [drafts, setDrafts] = useState<Record<string, { ru: string; tj: string }>>({});

  const effectiveFor = useCallback(
    (key: string) => ({
      ru: textOverrides[key]?.ru || DEFAULT_TEXTS[key]?.ru || "",
      tj: textOverrides[key]?.tj || DEFAULT_TEXTS[key]?.tj || "",
    }),
    [textOverrides],
  );

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const keys = Object.keys(DEFAULT_TEXTS).concat(
      Object.keys(textOverrides).filter((k) => !(k in DEFAULT_TEXTS)),
    );
    const filtered = keys.filter((k) => {
      if (!q) return true;
      const eff = effectiveFor(k);
      return (
        k.toLowerCase().includes(q) ||
        eff.ru.toLowerCase().includes(q) ||
        eff.tj.toLowerCase().includes(q)
      );
    });
    const prefixOrder = TEXT_GROUP_LABELS.map((g) => g.prefix);
    const byPrefix = new Map<string, string[]>();
    for (const k of filtered) {
      const prefix = k.split(".")[0] ?? k;
      const list = byPrefix.get(prefix) ?? [];
      list.push(k);
      byPrefix.set(prefix, list);
    }
    const prefixes = [...byPrefix.keys()].sort((a, b) => {
      const ia = prefixOrder.indexOf(a);
      const ib = prefixOrder.indexOf(b);
      if (ia !== -1 && ib !== -1) return ia - ib;
      if (ia !== -1) return -1;
      if (ib !== -1) return 1;
      return a.localeCompare(b);
    });
    return prefixes.map((prefix) => ({ prefix, keys: byPrefix.get(prefix) ?? [] }));
  }, [query, textOverrides, effectiveFor]);

  function saveKey(key: string) {
    const eff = effectiveFor(key);
    const draft = drafts[key] ?? eff;
    setTextOverride(key, "ru", draft.ru);
    setTextOverride(key, "tj", draft.tj);
    toast.success(t("admin.toast.saved"));
  }

  function resetKey(key: string) {
    resetTextKey(key);
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="font-serif text-2xl font-bold text-teal-900 sm:text-3xl">
          {t("admin.texts.title")}
        </h1>
        <p className="text-sm text-stone-600 sm:text-base">{t("admin.texts.subtitle")}</p>
      </header>

      <Alert className="border-teal-200 bg-teal-50/70 text-teal-900 [&>svg]:text-teal-500">
        <Languages className="h-4 w-4" />
        <AlertDescription className="leading-relaxed text-teal-800">
          <p>{t("admin.texts.info")}</p>
          <p className="mt-1 text-xs text-teal-700">{t("admin.texts.groupNames")}</p>
        </AlertDescription>
      </Alert>

      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
          aria-hidden="true"
        />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("admin.texts.searchPh")}
          aria-label={t("common.search")}
          className="min-h-11 pl-10"
        />
      </div>

      {!canEdit ? (
        <Badge variant="outline" className="border-stone-200 bg-stone-100 text-stone-500">
          {t("admin.users.role.viewer")}
        </Badge>
      ) : null}

      {groups.length === 0 ? (
        <EmptyState
          icon={<Languages className="h-6 w-6" />}
          title={t("admin.texts.empty")}
        />
      ) : (
        groups.map((group) => (
          <section key={group.prefix} aria-label={group.prefix} className="space-y-3">
            <h2 className="sticky top-0 z-10 rounded-xl bg-teal-50/95 px-4 py-2.5 text-sm font-bold text-teal-800 shadow-card backdrop-blur">
              {TEXT_GROUP_LABELS.find((g) => g.prefix === group.prefix)?.label ?? group.prefix}
            </h2>
            {group.keys.map((key) => {
              const eff = effectiveFor(key);
              const draft = drafts[key] ?? eff;
              const hasOverride = Boolean(textOverrides[key]);
              const dirty = draft.ru !== eff.ru || draft.tj !== eff.tj;
              return (
                <article
                  key={key}
                  className="rounded-2xl border border-stone-200/70 bg-white p-4 shadow-card"
                >
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-xs text-stone-500">{key}</span>
                    <div className="flex items-center gap-2">
                      {hasOverride ? (
                        <Badge className="border-amber-300 bg-amber-100 text-amber-800">
                          {t("admin.texts.changed")}
                        </Badge>
                      ) : null}
                      {canEdit ? (
                        <>
                          <Button
                            type="button"
                            size="sm"
                            className="min-h-11"
                            disabled={!dirty}
                            onClick={() => saveKey(key)}
                          >
                            <Save className="h-4 w-4" aria-hidden="true" />
                            {t("common.save")}
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="min-h-11"
                            title={t("admin.texts.reset")}
                            disabled={!hasOverride}
                            onClick={() => resetKey(key)}
                          >
                            <RotateCcw className="h-4 w-4" aria-hidden="true" />
                            <span className="sr-only">{t("admin.texts.reset")}</span>
                          </Button>
                        </>
                      ) : null}
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <Label htmlFor={`text-ru-${key}`} className="text-xs text-stone-500">
                        {t("admin.texts.ruValue")}
                      </Label>
                      <Textarea
                        id={`text-ru-${key}`}
                        rows={2}
                        disabled={!canEdit}
                        value={draft.ru}
                        onChange={(e) =>
                          setDrafts((prev) => ({
                            ...prev,
                            [key]: { ru: e.target.value, tj: draft.tj },
                          }))
                        }
                        className="min-h-11"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={`text-tj-${key}`} className="text-xs text-stone-500">
                        {t("admin.texts.tjValue")}
                      </Label>
                      <Textarea
                        id={`text-tj-${key}`}
                        rows={2}
                        disabled={!canEdit}
                        value={draft.tj}
                        onChange={(e) =>
                          setDrafts((prev) => ({
                            ...prev,
                            [key]: { ru: draft.ru, tj: e.target.value },
                          }))
                        }
                        className="min-h-11"
                      />
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        ))
      )}
    </div>
  );
}
