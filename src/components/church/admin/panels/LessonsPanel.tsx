"use client";

/**
 * Admin panel: Sabbath School lessons CRUD with optional PDF upload
 (demo: stored as a data-URL in localStorage, max ~1 MB).
 */

import { useMemo, useState, type ChangeEvent } from "react";
import {
  AlertTriangle,
  BookOpen,
  Eye,
  EyeOff,
  FileText,
  Info,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/church/shared";
import { useDateFormatter, useLang, useLoc, useT } from "@/lib/i18n";
import { useCanEdit } from "@/lib/permissions";
import { useChurchStore } from "@/lib/store/useChurchStore";
import type { Lesson } from "@/lib/store/types";

function uid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `les_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

/** Demo storage limit: keep PDFs tiny or localStorage will overflow. */
const MAX_PDF_BYTES = 1024 * 1024; // ~1 MB

/** Fallback hint: the admin.form.pdfHint key may not exist in this build. */
const PDF_HINT_FALLBACK = {
  ru: "Демо: PDF хранится в браузере. Выбирайте файл не больше ~1 МБ.",
  tj: "Демо: PDF дар браузер нигоҳ дошта мешавад. Файл то ~1 МБ.",
};

function readPdfAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("read-error"));
    reader.readAsDataURL(file);
  });
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function emptyLesson(): Lesson {
  return {
    id: "",
    number: (useChurchStore.getState().data.lessons.length ?? 0) + 1,
    title: { ru: "", tj: "" },
    summary: { ru: "", tj: "" },
    keyVerse: { ru: "", tj: "" },
    verseRef: { ru: "", tj: "" },
    startDate: todayIso(),
    pdfUrl: undefined,
    published: true,
  };
}

export default function LessonsPanel() {
  const t = useT();
  const loc = useLoc();
  const { lang } = useLang();
  const formatDate = useDateFormatter();

  const lessons = useChurchStore((s) => s.data.lessons);
  const saveLesson = useChurchStore((s) => s.saveLesson);
  const deleteLesson = useChurchStore((s) => s.deleteLesson);

  const canEdit = useCanEdit("lessons");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Lesson>(emptyLesson);
  const [pdfFile, setPdfFile] = useState<{ name: string; size?: number } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Lesson | null>(null);

  const sorted = useMemo(
    () => [...lessons].sort((a, b) => a.number - b.number),
    [lessons],
  );

  const pdfHintRaw = t("admin.form.pdfHint");
  const pdfHint =
    pdfHintRaw === "admin.form.pdfHint"
      ? lang === "tj"
        ? PDF_HINT_FALLBACK.tj
        : PDF_HINT_FALLBACK.ru
      : pdfHintRaw;

  function openAdd() {
    setEditingId(null);
    setForm(emptyLesson());
    setPdfFile(null);
    setDialogOpen(true);
  }

  function openEdit(item: Lesson) {
    setEditingId(item.id);
    setForm({
      ...item,
      title: { ...item.title },
      summary: { ...item.summary },
      keyVerse: { ...item.keyVerse },
      verseRef: { ...item.verseRef },
    });
    setPdfFile(
      item.pdfUrl
        ? {
            name: item.pdfUrl.startsWith("data:")
              ? "lesson.pdf"
              : item.pdfUrl.slice(0, 60),
          }
        : null,
    );
    setDialogOpen(true);
  }

  function handleSave() {
    if (!form.title.ru.trim() || !Number.isFinite(form.number) || form.number < 1) {
      toast.error(t("admin.toast.error"));
      return;
    }
    saveLesson({ ...form, id: editingId ?? uid() });
    toast.success(t("admin.toast.saved"));
    setDialogOpen(false);
  }

  function handleDelete() {
    if (!deleteTarget) return;
    deleteLesson(deleteTarget.id);
    toast.success(t("admin.toast.deleted"));
    setDeleteTarget(null);
  }

  async function handlePdfChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;
    if (file.size > MAX_PDF_BYTES) {
      toast.error(
        lang === "tj"
          ? "Файл аз 1 МБ зиёд аст — файли хурдтар интихоб кунед (демо)."
          : "Файл больше 1 МБ — выберите файл поменьше (демо-режим).",
      );
      return;
    }
    try {
      const dataUrl = await readPdfAsDataUrl(file);
      setForm((f) => ({ ...f, pdfUrl: dataUrl }));
      setPdfFile({ name: file.name, size: file.size });
      toast.success(t("admin.toast.saved"));
    } catch {
      toast.error(t("admin.toast.error"));
    }
  }

  function removePdf() {
    setForm((f) => ({ ...f, pdfUrl: undefined }));
    setPdfFile(null);
  }

  return (
    <div className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
      {/* Header */}
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold sm:text-3xl">
            {t("admin.lessons.title")}
          </h1>
          <p className="mt-1 text-sm text-stone-600">{t("admin.lessons.subtitle")}</p>
        </div>
        {canEdit ? (
          <Button onClick={openAdd} className="shrink-0">
            <Plus className="h-4 w-4" aria-hidden="true" />
            {t("admin.lessons.add")}
          </Button>
        ) : (
          <Badge
            variant="outline"
            className="shrink-0 border-stone-200 bg-stone-50 text-stone-500"
          >
            <Eye className="h-3 w-3" aria-hidden="true" />
            Только просмотр · Танҳо тамошо
          </Badge>
        )}
      </div>

      <Alert className="mb-6 border-teal-200 bg-teal-50/60 text-teal-900">
        <Info className="h-4 w-4" aria-hidden="true" />
        <AlertDescription className="text-sm leading-relaxed">
          {t("admin.lessons.quarterInfo")}
        </AlertDescription>
      </Alert>

      {/* List */}
      {sorted.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="h-6 w-6" aria-hidden="true" />}
          title={t("admin.lessons.empty")}
        />
      ) : (
        <ul className="space-y-2">
          {sorted.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-3 rounded-2xl border border-teal-100 bg-white p-4 sm:flex-row sm:items-center sm:gap-4"
            >
              <Badge className="w-fit shrink-0 border-teal-200 bg-teal-50 text-teal-800">
                №{item.number}
              </Badge>
              <div className="min-w-0 flex-1">
                <p className="font-semibold leading-snug text-stone-800">
                  {loc(item.title)}
                </p>
                <p className="mt-0.5 text-sm text-stone-500">
                  {formatDate(item.startDate)}
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-2">
                {item.pdfUrl ? (
                  <Badge
                    variant="outline"
                    className="border-amber-200 bg-amber-50 text-amber-700"
                  >
                    <FileText className="h-3 w-3" aria-hidden="true" />
                    PDF
                  </Badge>
                ) : null}
                <Badge
                  variant={item.published ? "default" : "outline"}
                  className={
                    item.published
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-stone-200 bg-stone-50 text-stone-500"
                  }
                >
                  {item.published ? (
                    <Eye className="h-3 w-3" aria-hidden="true" />
                  ) : (
                    <EyeOff className="h-3 w-3" aria-hidden="true" />
                  )}
                  {t("admin.form.published")}
                </Badge>
                {canEdit ? (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => openEdit(item)}
                      aria-label={t("common.edit")}
                      className="h-9 w-9 border-teal-200 text-teal-700 hover:bg-teal-50 hover:text-teal-800"
                    >
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setDeleteTarget(item)}
                      aria-label={t("common.delete")}
                      className="h-9 w-9 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Add / edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingId ? t("common.edit") : t("admin.lessons.add")}
            </DialogTitle>
            <DialogDescription>{t("admin.lessons.subtitle")}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="les-number">{t("admin.lessons.number")}</Label>
              <Input
                id="les-number"
                type="number"
                min={1}
                value={Number.isFinite(form.number) ? String(form.number) : ""}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    number: e.target.value === "" ? Number.NaN : Number(e.target.value),
                  }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="les-date">{t("admin.lessons.date")}</Label>
              <Input
                id="les-date"
                type="date"
                value={form.startDate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, startDate: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="les-title-ru">{t("admin.form.ruTitle")}</Label>
              <Input
                id="les-title-ru"
                value={form.title.ru}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: { ...f.title, ru: e.target.value } }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="les-title-tj">{t("admin.form.tjTitle")}</Label>
              <Input
                id="les-title-tj"
                value={form.title.tj}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: { ...f.title, tj: e.target.value } }))
                }
                placeholder={t("common.optional")}
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="les-summary-ru">{t("admin.form.summaryRu")}</Label>
              <Textarea
                id="les-summary-ru"
                rows={3}
                value={form.summary.ru}
                onChange={(e) =>
                  setForm((f) => ({ ...f, summary: { ...f.summary, ru: e.target.value } }))
                }
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="les-summary-tj">{t("admin.form.summaryTj")}</Label>
              <Textarea
                id="les-summary-tj"
                rows={3}
                value={form.summary.tj}
                onChange={(e) =>
                  setForm((f) => ({ ...f, summary: { ...f.summary, tj: e.target.value } }))
                }
                placeholder={t("common.optional")}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="les-verse-ru">{t("admin.form.verseRu")}</Label>
              <Textarea
                id="les-verse-ru"
                rows={2}
                value={form.keyVerse.ru}
                onChange={(e) =>
                  setForm((f) => ({ ...f, keyVerse: { ...f.keyVerse, ru: e.target.value } }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="les-verse-tj">{t("admin.form.verseTj")}</Label>
              <Textarea
                id="les-verse-tj"
                rows={2}
                value={form.keyVerse.tj}
                onChange={(e) =>
                  setForm((f) => ({ ...f, keyVerse: { ...f.keyVerse, tj: e.target.value } }))
                }
                placeholder={t("common.optional")}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="les-ref-ru">{t("admin.form.verseRef")} — RU</Label>
              <Input
                id="les-ref-ru"
                value={form.verseRef.ru}
                onChange={(e) =>
                  setForm((f) => ({ ...f, verseRef: { ...f.verseRef, ru: e.target.value } }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="les-ref-tj">{t("admin.form.verseRef")} — TJ</Label>
              <Input
                id="les-ref-tj"
                value={form.verseRef.tj}
                onChange={(e) =>
                  setForm((f) => ({ ...f, verseRef: { ...f.verseRef, tj: e.target.value } }))
                }
                placeholder={t("common.optional")}
              />
            </div>

            {/* PDF upload */}
            <div className="space-y-1.5 rounded-2xl border border-amber-200 bg-amber-50/60 p-4 sm:col-span-2">
              <Label htmlFor="les-pdf" className="flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-amber-600" aria-hidden="true" />
                PDF
              </Label>
              <Input
                id="les-pdf"
                type="file"
                accept=".pdf"
                onChange={handlePdfChange}
                disabled={!canEdit}
                className="file:mr-3 file:rounded-lg file:border-0 file:bg-teal-600 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-teal-700"
              />
              {pdfFile ? (
                <div className="flex items-center justify-between gap-2 text-xs text-stone-600">
                  <span className="flex min-w-0 items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 shrink-0 text-teal-600" aria-hidden="true" />
                    <span className="truncate font-semibold">{pdfFile.name}</span>
                    {typeof pdfFile.size === "number"
                      ? ` · ${Math.round(pdfFile.size / 1024)} KB`
                      : ""}
                  </span>
                  <button
                    type="button"
                    onClick={removePdf}
                    className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 font-semibold text-red-600 hover:bg-red-50"
                    aria-label={t("common.delete")}
                  >
                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                    {t("common.delete")}
                  </button>
                </div>
              ) : null}
              <p className="flex items-start gap-1.5 text-xs leading-relaxed text-amber-800">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {pdfHint}
              </p>
            </div>

            <div className="flex items-center gap-2.5 sm:col-span-2">
              <Checkbox
                id="les-published"
                checked={form.published}
                onCheckedChange={(v) => setForm((f) => ({ ...f, published: v === true }))}
              />
              <Label htmlFor="les-published" className="cursor-pointer">
                {t("admin.form.published")}
              </Label>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button onClick={handleSave} className="bg-teal-700 hover:bg-teal-800">
              {t("common.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("admin.confirmDelete.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("admin.confirmDelete.text")}
              {deleteTarget ? ` «№${deleteTarget.number} ${loc(deleteTarget.title)}»` : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
