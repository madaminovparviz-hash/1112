"use client";

/**
 * Admin → Видеогалерея.
 * CRUD for media-page video cards. YouTube sync lives in SettingsPanel.
 */

import { useState } from "react";
import { Film, Pencil, Plus, Save, Trash2, Youtube } from "lucide-react";
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
import { useCanEdit } from "@/lib/permissions";
import { useDateFormatter, useLoc, useT } from "@/lib/i18n";
import { useChurchStore } from "@/lib/store/useChurchStore";
import type { VideoItem } from "@/lib/store/types";

interface VideoForm {
  titleRu: string;
  titleTj: string;
  descRu: string;
  descTj: string;
  videoId: string;
  thumbnail: string;
  publishedAt: string;
}

const EMPTY_FORM: VideoForm = {
  titleRu: "",
  titleTj: "",
  descRu: "",
  descTj: "",
  videoId: "",
  thumbnail: "",
  publishedAt: "",
};

export default function VideosPanel() {
  const t = useT();
  const loc = useLoc();
  const fmt = useDateFormatter();
  const canEdit = useCanEdit("videos");

  const videos = useChurchStore((s) => s.data.videos);
  const saveVideo = useChurchStore((s) => s.saveVideo);
  const deleteVideo = useChurchStore((s) => s.deleteVideo);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<VideoItem | null>(null);
  const [form, setForm] = useState<VideoForm>(EMPTY_FORM);

  function openAdd() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setOpen(true);
  }

  function openEdit(v: VideoItem) {
    setEditing(v);
    setForm({
      titleRu: v.title.ru,
      titleTj: v.title.tj,
      descRu: v.description.ru,
      descTj: v.description.tj,
      videoId: v.videoId ?? "",
      thumbnail: v.thumbnail ?? "",
      publishedAt: v.publishedAt ? v.publishedAt.slice(0, 10) : "",
    });
    setOpen(true);
  }

  function handleSave() {
    if (!form.titleRu.trim()) {
      toast.error(t("admin.toast.error"));
      return;
    }
    saveVideo({
      id: editing?.id ?? crypto.randomUUID(),
      title: { ru: form.titleRu.trim(), tj: form.titleTj.trim() },
      description: { ru: form.descRu.trim(), tj: form.descTj.trim() },
      videoId: form.videoId.trim() || null,
      thumbnail: form.thumbnail.trim() || undefined,
      publishedAt: form.publishedAt || undefined,
      source: editing?.source ?? "manual",
    });
    toast.success(t("admin.toast.saved"));
    setOpen(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <header className="space-y-1">
          <h1 className="font-serif text-2xl font-bold text-teal-900 sm:text-3xl">
            {t("admin.videos.title")}
          </h1>
          <p className="text-sm text-stone-600 sm:text-base">{t("admin.videos.subtitle")}</p>
        </header>
        {canEdit ? (
          <Button type="button" onClick={openAdd} className="min-h-11">
            <Plus className="h-4 w-4" aria-hidden="true" />
            {t("admin.videos.add")}
          </Button>
        ) : (
          <Badge
            variant="outline"
            className="border-stone-200 bg-stone-100 text-stone-500"
          >
            {loc({ ru: "Только просмотр", tj: "Танҳо намоиш" })}
          </Badge>
        )}
      </div>

      <Alert className="border-teal-200 bg-teal-50/70 text-teal-900 [&>svg]:text-teal-500">
        <Youtube className="h-4 w-4" />
        <AlertDescription className="leading-relaxed text-teal-800">
          {t("admin.videos.syncHint")}
        </AlertDescription>
      </Alert>

      {videos.length === 0 ? (
        <EmptyState icon={<Film className="h-6 w-6" />} title={t("admin.videos.empty")} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((v) => (
            <article
              key={v.id}
              className="overflow-hidden rounded-2xl border border-stone-200/70 bg-white shadow-card"
            >
              <div className="relative aspect-video bg-stone-100">
                {v.videoId ? (
                  <img
                    src={`https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`}
                    alt={loc(v.title)}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="flex h-full w-full items-center justify-center bg-gradient-to-br from-teal-100 via-emerald-50 to-amber-100 text-teal-500"
                  >
                    <Film className="h-10 w-10" />
                  </div>
                )}
                <Badge className="absolute left-2 top-2 border-teal-200 bg-white/90 text-teal-700 backdrop-blur">
                  {t(`admin.videos.source.${v.source}`)}
                </Badge>
              </div>
              <div className="p-4">
                <h3 className="line-clamp-2 font-serif text-base font-semibold leading-snug text-teal-900">
                  {loc(v.title)}
                </h3>
                {loc(v.description) ? (
                  <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-stone-600">
                    {loc(v.description)}
                  </p>
                ) : null}
                {v.publishedAt ? (
                  <p className="mt-2 text-xs text-stone-400">{fmt(v.publishedAt)}</p>
                ) : null}
                {canEdit ? (
                  <div className="mt-3 flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="min-h-11 flex-1"
                      onClick={() => openEdit(v)}
                    >
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                      {t("common.edit")}
                    </Button>
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
                              deleteVideo(v.id);
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
              </div>
            </article>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? t("common.edit") : t("admin.videos.add")}</DialogTitle>
            <DialogDescription className="sr-only">
              {t("admin.videos.subtitle")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="video-title-ru">{t("admin.form.ruTitle")} *</Label>
                <Input
                  id="video-title-ru"
                  value={form.titleRu}
                  onChange={(e) => setForm((f) => ({ ...f, titleRu: e.target.value }))}
                  className="min-h-11"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="video-title-tj">{t("admin.form.tjTitle")}</Label>
                <Input
                  id="video-title-tj"
                  value={form.titleTj}
                  onChange={(e) => setForm((f) => ({ ...f, titleTj: e.target.value }))}
                  className="min-h-11"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="video-desc-ru">{t("admin.form.ruDescription")}</Label>
                <Textarea
                  id="video-desc-ru"
                  rows={3}
                  value={form.descRu}
                  onChange={(e) => setForm((f) => ({ ...f, descRu: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="video-desc-tj">{t("admin.form.tjDescription")}</Label>
                <Textarea
                  id="video-desc-tj"
                  rows={3}
                  value={form.descTj}
                  onChange={(e) => setForm((f) => ({ ...f, descTj: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="video-id">{t("admin.videos.videoId")}</Label>
              <Input
                id="video-id"
                value={form.videoId}
                onChange={(e) => setForm((f) => ({ ...f, videoId: e.target.value }))}
                placeholder="dQw4w9WgXcQ"
                className="min-h-11 font-mono"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="video-thumb">{t("admin.videos.thumbnail")}</Label>
                <Input
                  id="video-thumb"
                  value={form.thumbnail}
                  onChange={(e) => setForm((f) => ({ ...f, thumbnail: e.target.value }))}
                  className="min-h-11"
                  type="url"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="video-date">{t("admin.table.date")}</Label>
                <Input
                  id="video-date"
                  type="date"
                  value={form.publishedAt}
                  onChange={(e) => setForm((f) => ({ ...f, publishedAt: e.target.value }))}
                  className="min-h-11"
                />
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
