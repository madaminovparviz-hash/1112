"use client";

/**
 * Admin → Объявления.
 * Pinned/published announcements shown on the home page.
 */

import { useMemo, useState } from "react";
import { Eye, EyeOff, Megaphone, Pencil, Pin, Plus, Save, Trash2 } from "lucide-react";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/church/shared";
import { useCanEdit } from "@/lib/permissions";
import { useDateFormatter, useLoc, useT } from "@/lib/i18n";
import { useChurchStore } from "@/lib/store/useChurchStore";
import type { Announcement } from "@/lib/store/types";
import { cn } from "@/lib/utils";

interface AnnouncementForm {
  titleRu: string;
  titleTj: string;
  textRu: string;
  textTj: string;
  startDate: string;
  pinned: boolean;
  published: boolean;
}

const EMPTY_FORM: AnnouncementForm = {
  titleRu: "",
  titleTj: "",
  textRu: "",
  textTj: "",
  startDate: "",
  pinned: false,
  published: true,
};

export default function AnnouncementsPanel() {
  const t = useT();
  const loc = useLoc();
  const fmt = useDateFormatter();
  const canEdit = useCanEdit("announcements");

  const announcements = useChurchStore((s) => s.data.announcements);
  const saveAnnouncement = useChurchStore((s) => s.saveAnnouncement);
  const deleteAnnouncement = useChurchStore((s) => s.deleteAnnouncement);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [form, setForm] = useState<AnnouncementForm>(EMPTY_FORM);

  const sorted = useMemo(
    () =>
      [...announcements].sort(
        (a, b) =>
          Number(b.pinned) - Number(a.pinned) || b.startDate.localeCompare(a.startDate),
      ),
    [announcements],
  );

  function openAdd() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setOpen(true);
  }

  function openEdit(a: Announcement) {
    setEditing(a);
    setForm({
      titleRu: a.title.ru,
      titleTj: a.title.tj,
      textRu: a.text.ru,
      textTj: a.text.tj,
      startDate: a.startDate ? a.startDate.slice(0, 10) : "",
      pinned: a.pinned,
      published: a.published,
    });
    setOpen(true);
  }

  function handleSave() {
    if (!form.titleRu.trim()) {
      toast.error(t("admin.toast.error"));
      return;
    }
    saveAnnouncement({
      id: editing?.id ?? crypto.randomUUID(),
      title: { ru: form.titleRu.trim(), tj: form.titleTj.trim() },
      text: { ru: form.textRu.trim(), tj: form.textTj.trim() },
      startDate: form.startDate || new Date().toISOString().slice(0, 10),
      pinned: form.pinned,
      published: form.published,
    });
    toast.success(t("admin.toast.saved"));
    setOpen(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <header className="space-y-1">
          <h1 className="font-serif text-2xl font-bold text-teal-900 sm:text-3xl">
            {t("admin.announcements.title")}
          </h1>
          <p className="text-sm text-stone-600 sm:text-base">
            {t("admin.announcements.subtitle")}
          </p>
        </header>
        {canEdit ? (
          <Button type="button" onClick={openAdd} className="min-h-11">
            <Plus className="h-4 w-4" aria-hidden="true" />
            {t("admin.announcements.add")}
          </Button>
        ) : (
          <Badge variant="outline" className="border-stone-200 bg-stone-100 text-stone-500">
            {loc({ ru: "Только просмотр", tj: "Танҳо намоиш" })}
          </Badge>
        )}
      </div>

      {sorted.length === 0 ? (
        <EmptyState
          icon={<Megaphone className="h-6 w-6" />}
          title={t("admin.announcements.empty")}
        />
      ) : (
        <div className="space-y-4">
          {sorted.map((a) => (
            <article
              key={a.id}
              className={cn(
                "rounded-2xl border bg-white p-5 shadow-card",
                a.pinned ? "border-amber-300/80 bg-amber-50/40" : "border-stone-200/70",
              )}
            >
              <div className="flex flex-wrap items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                  <Megaphone className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-serif text-lg font-semibold leading-snug text-teal-900">
                    {loc(a.title)}
                  </h3>
                  <p className="mt-0.5 text-xs text-stone-500">
                    {t("admin.announcements.date")}: {fmt(a.startDate)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {a.pinned ? (
                    <Badge className="border-amber-300 bg-amber-100 text-amber-800">
                      <Pin className="h-3 w-3" aria-hidden="true" />
                      {t("admin.announcements.pinned")}
                    </Badge>
                  ) : null}
                  {a.published ? (
                    <Badge className="border-teal-200 bg-teal-50 text-teal-700">
                      <Eye className="h-3 w-3" aria-hidden="true" />
                      {t("admin.pages.published")}
                    </Badge>
                  ) : (
                    <Badge className="border-stone-200 bg-stone-100 text-stone-600">
                      <EyeOff className="h-3 w-3" aria-hidden="true" />
                      {loc({ ru: "Скрыто", tj: "Пинҳон" })}
                    </Badge>
                  )}
                </div>
              </div>

              <p className="mt-3 whitespace-pre-line leading-relaxed text-stone-700">
                {loc(a.text)}
              </p>

              {canEdit ? (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="min-h-11"
                    onClick={() => openEdit(a)}
                  >
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                    {t("common.edit")}
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        className="min-h-11 text-stone-400 hover:bg-red-50 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                        {t("common.delete")}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t("admin.confirmDelete.title")}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {t("admin.confirmDelete.text")}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="min-h-11">
                          {t("common.cancel")}
                        </AlertDialogCancel>
                        <AlertDialogAction
                          className="min-h-11 bg-destructive text-white hover:bg-destructive/90"
                          onClick={() => {
                            deleteAnnouncement(a.id);
                            toast.success(t("admin.toast.deleted"));
                          }}
                        >
                          {t("common.delete")}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editing ? t("common.edit") : t("admin.announcements.add")}
            </DialogTitle>
            <DialogDescription className="sr-only">
              {t("admin.announcements.subtitle")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="ann-title-ru">{t("admin.form.ruTitle")} *</Label>
                <Input
                  id="ann-title-ru"
                  value={form.titleRu}
                  onChange={(e) => setForm((f) => ({ ...f, titleRu: e.target.value }))}
                  className="min-h-11"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ann-title-tj">{t("admin.form.tjTitle")}</Label>
                <Input
                  id="ann-title-tj"
                  value={form.titleTj}
                  onChange={(e) => setForm((f) => ({ ...f, titleTj: e.target.value }))}
                  className="min-h-11"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="ann-text-ru">{t("admin.form.ruText")}</Label>
                <Textarea
                  id="ann-text-ru"
                  rows={4}
                  value={form.textRu}
                  onChange={(e) => setForm((f) => ({ ...f, textRu: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ann-text-tj">{t("admin.form.tjText")}</Label>
                <Textarea
                  id="ann-text-tj"
                  rows={4}
                  value={form.textTj}
                  onChange={(e) => setForm((f) => ({ ...f, textTj: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="ann-date">{t("admin.announcements.date")}</Label>
                <Input
                  id="ann-date"
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                  className="min-h-11"
                />
              </div>
              <div className="flex flex-col justify-center gap-3 py-1">
                <div className="flex items-center gap-3">
                  <Switch
                    id="ann-pinned"
                    checked={form.pinned}
                    onCheckedChange={(v) => setForm((f) => ({ ...f, pinned: v }))}
                  />
                  <Label htmlFor="ann-pinned" className="text-sm font-normal text-stone-600">
                    {t("admin.announcements.pinned")}
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    id="ann-published"
                    checked={form.published}
                    onCheckedChange={(v) => setForm((f) => ({ ...f, published: v }))}
                  />
                  <Label htmlFor="ann-published" className="text-sm font-normal text-stone-600">
                    {t("admin.form.published")}
                  </Label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              className="min-h-11"
              onClick={() => setOpen(false)}
            >
              {t("common.cancel")}
            </Button>
            <Button type="button" className="min-h-11" onClick={handleSave}>
              <Save className="h-4 w-4" aria-hidden="true" />
              {t("common.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
