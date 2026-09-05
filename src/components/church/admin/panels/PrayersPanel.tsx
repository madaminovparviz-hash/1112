"use client";

/**
 * Admin → Молитвенные нужды.
 * Privacy-first workspace for prayer requests: status workflow, visibility
 * control and internal (never published) team comments.
 */

import { useMemo, useState } from "react";
import {
  Eye,
  EyeOff,
  Heart,
  Lock,
  MessageSquarePlus,
  MessageSquareQuote,
  Phone,
  ShieldAlert,
  Trash2,
  User,
} from "lucide-react";
import { toast } from "sonner";

import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState, StatusBadge } from "@/components/church/shared";
import { useCanEdit } from "@/lib/permissions";
import { useDateFormatter, useLoc, useT } from "@/lib/i18n";
import { useChurchStore } from "@/lib/store/useChurchStore";
import type { PrayerStatus } from "@/lib/store/types";
import { cn } from "@/lib/utils";

const STATUSES: PrayerStatus[] = ["new", "in_prayer", "prayed", "archived"];
const FILTERS: ("all" | PrayerStatus)[] = ["all", ...STATUSES];

export default function PrayersPanel() {
  const t = useT();
  const loc = useLoc();
  const fmt = useDateFormatter();
  const canEdit = useCanEdit("prayers");

  const prayers = useChurchStore((s) => s.data.prayers);
  const setPrayerStatus = useChurchStore((s) => s.setPrayerStatus);
  const setPrayerPublic = useChurchStore((s) => s.setPrayerPublic);
  const addPrayerComment = useChurchStore((s) => s.addPrayerComment);
  const deletePrayer = useChurchStore((s) => s.deletePrayer);

  const [filter, setFilter] = useState<"all" | PrayerStatus>("all");
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: prayers.length };
    for (const s of STATUSES) c[s] = prayers.filter((p) => p.status === s).length;
    return c;
  }, [prayers]);

  const visible = useMemo(
    () =>
      [...prayers]
        .filter((p) => filter === "all" || p.status === filter)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [prayers, filter],
  );

  function changeStatus(id: string, status: PrayerStatus) {
    setPrayerStatus(id, status);
    toast.success(t("admin.toast.saved"));
  }

  function changePublic(id: string, isPublic: boolean) {
    setPrayerPublic(id, isPublic);
    toast.success(t("admin.toast.saved"));
  }

  function submitComment(id: string) {
    const text = (commentDrafts[id] ?? "").trim();
    if (!text) return;
    addPrayerComment(id, text);
    setCommentDrafts((prev) => ({ ...prev, [id]: "" }));
    toast.success(t("admin.toast.saved"));
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="font-serif text-2xl font-bold text-teal-900 sm:text-3xl">
          {t("admin.prayers.title")}
        </h1>
        <p className="text-sm text-stone-600 sm:text-base">{t("admin.prayers.subtitle")}</p>
      </header>

      <Alert className="border-amber-200 bg-amber-50 text-amber-900 [&>svg]:text-amber-500">
        <ShieldAlert className="h-4 w-4" />
        <AlertDescription className="text-amber-800">
          {t("admin.prayers.privacyWarning")}
        </AlertDescription>
      </Alert>

      <div className="flex flex-wrap gap-2" role="group" aria-label={t("admin.table.status")}>
        {FILTERS.map((f) => {
          const active = filter === f;
          return (
            <Button
              key={f}
              type="button"
              variant={active ? "default" : "outline"}
              aria-pressed={active}
              onClick={() => setFilter(f)}
              className="min-h-11 rounded-full px-4"
            >
              {f === "all" ? loc({ ru: "Все", tj: "Ҳама" }) : t(`admin.prayers.status.${f}`)}
              <span
                className={cn(
                  "ml-1.5 rounded-full px-1.5 py-0.5 text-xs font-bold",
                  active ? "bg-white/25" : "bg-stone-100 text-stone-500",
                )}
              >
                {counts[f] ?? 0}
              </span>
            </Button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <EmptyState icon={<Heart className="h-6 w-6" />} title={t("admin.prayers.empty")} />
      ) : (
        <div className="space-y-4">
          {visible.map((p) => (
            <article
              key={p.id}
              className="rounded-2xl border border-stone-200/70 bg-white p-5 shadow-card"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                    <User className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p
                      className={cn(
                        "truncate text-sm font-bold text-stone-800",
                        !p.name && "italic text-stone-500",
                      )}
                    >
                      {p.name || t("admin.prayers.anonymous")}
                    </p>
                    <p className="text-xs text-stone-500">{fmt(p.createdAt)}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={p.status} label={t(`admin.prayers.status.${p.status}`)} />
                  {p.isPublic ? (
                    <Badge className="border-teal-200 bg-teal-50 text-teal-700">
                      <Eye className="h-3 w-3" aria-hidden="true" />
                      {t("admin.prayers.public")}
                    </Badge>
                  ) : (
                    <Badge className="border-stone-200 bg-stone-100 text-stone-600">
                      <EyeOff className="h-3 w-3" aria-hidden="true" />
                      {t("admin.prayers.private")}
                    </Badge>
                  )}
                  {canEdit ? (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={t("common.delete")}
                          title={t("common.delete")}
                          className="min-h-11 min-w-11 text-stone-400 hover:bg-red-50 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t("admin.confirmDelete.title")}</AlertDialogTitle>
                          <AlertDialogDescription>{t("admin.confirmDelete.text")}</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="min-h-11">
                            {t("common.cancel")}
                          </AlertDialogCancel>
                          <AlertDialogAction
                            className="min-h-11 bg-destructive text-white hover:bg-destructive/90"
                            onClick={() => {
                              deletePrayer(p.id);
                              toast.success(t("admin.toast.deleted"));
                            }}
                          >
                            {t("common.delete")}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ) : null}
                </div>
              </div>

              <p className="mt-4 whitespace-pre-line leading-relaxed text-stone-700">{p.text}</p>

              {p.contact ? (
                <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900">
                  <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="font-semibold">{p.contact}</span>
                  <Lock className="h-3.5 w-3.5 shrink-0 text-amber-600" aria-hidden="true" />
                  <span className="text-xs text-amber-700">{t("admin.prayers.contact")}</span>
                </div>
              ) : null}

              {canEdit ? (
                <>
                  <div className="mt-4">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wide text-stone-500">
                      {t("admin.prayers.statusChange")}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {STATUSES.map((s) => {
                        const active = p.status === s;
                        return (
                          <button
                            key={s}
                            type="button"
                            aria-pressed={active}
                            onClick={() => changeStatus(p.id, s)}
                            className={cn(
                              "min-h-11 rounded-full border px-4 text-sm font-semibold transition-colors",
                              active
                                ? "border-teal-600 bg-teal-600 text-white shadow-card"
                                : "border-stone-200 bg-white text-stone-600 hover:border-teal-300 hover:text-teal-700",
                            )}
                          >
                            {t(`admin.prayers.status.${s}`)}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-3">
                    <Switch
                      id={`prayer-public-${p.id}`}
                      checked={p.isPublic}
                      onCheckedChange={(v) => changePublic(p.id, v)}
                    />
                    <Label
                      htmlFor={`prayer-public-${p.id}`}
                      className="text-sm font-normal text-stone-600"
                    >
                      {t("admin.prayers.public")}
                    </Label>
                  </div>
                </>
              ) : null}

              <div className="mt-4 border-t border-dashed border-stone-200 pt-4">
                <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-stone-500">
                  <MessageSquareQuote className="h-4 w-4 text-teal-600" aria-hidden="true" />
                  {t("admin.prayers.comments")}
                </p>
                {p.comments.length === 0 ? (
                  <p className="text-sm italic text-stone-400">{t("admin.prayers.noComments")}</p>
                ) : (
                  <ul className="space-y-2">
                    {p.comments.map((c) => (
                      <li key={c.id} className="rounded-xl bg-teal-50/60 p-3">
                        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                          <span className="text-sm font-bold text-teal-800">{c.author}</span>
                          <span className="text-xs text-stone-500">{fmt(c.createdAt)}</span>
                        </div>
                        <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-stone-700">
                          {c.text}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
                {canEdit ? (
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                    <Textarea
                      value={commentDrafts[p.id] ?? ""}
                      onChange={(e) =>
                        setCommentDrafts((prev) => ({ ...prev, [p.id]: e.target.value }))
                      }
                      placeholder={t("admin.prayers.commentPh")}
                      rows={2}
                      aria-label={t("admin.prayers.comments")}
                      className="min-h-11 flex-1"
                    />
                    <Button
                      type="button"
                      className="min-h-11 shrink-0 self-end"
                      disabled={!canEdit || !(commentDrafts[p.id] ?? "").trim()}
                      onClick={() => submitComment(p.id)}
                    >
                      <MessageSquarePlus className="h-4 w-4" aria-hidden="true" />
                      {t("admin.prayers.commentAdd")}
                    </Button>
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
