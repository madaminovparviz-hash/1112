"use client";

/**
 * Admin panel: weekly schedule CRUD, grouped by weekday (Sabbath first).
 */

import { useMemo, useState, type ChangeEvent } from "react";
import { CalendarDays, Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/church/shared";
import { useLoc, useT } from "@/lib/i18n";
import { useCanEdit } from "@/lib/permissions";
import { useChurchStore } from "@/lib/store/useChurchStore";
import type { ServiceItem } from "@/lib/store/types";

/** Robust demo id generator (crypto.randomUUID with a fallback). */
function uid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `svc_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

const WEEKDAY_ORDER = [6, 0, 1, 2, 3, 4, 5];

function emptyService(): ServiceItem {
  return {
    id: "",
    weekday: 6,
    time: "10:00",
    title: { ru: "", tj: "" },
    description: { ru: "", tj: "" },
    published: true,
  };
}

export default function SchedulePanel() {
  const t = useT();
  const loc = useLoc();

  const services = useChurchStore((s) => s.data.services);
  const saveService = useChurchStore((s) => s.saveService);
  const deleteService = useChurchStore((s) => s.deleteService);

  const canEdit = useCanEdit("schedule");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ServiceItem>(emptyService);
  const [deleteTarget, setDeleteTarget] = useState<ServiceItem | null>(null);

  const groups = useMemo(
    () =>
      WEEKDAY_ORDER.map((weekday) => ({
        weekday,
        items: services
          .filter((s) => s.weekday === weekday)
          .sort((a, b) => a.time.localeCompare(b.time)),
      })).filter((g) => g.items.length > 0),
    [services],
  );

  function openAdd() {
    setEditingId(null);
    setForm(emptyService());
    setDialogOpen(true);
  }

  function openEdit(item: ServiceItem) {
    setEditingId(item.id);
    setForm({ ...item, title: { ...item.title }, description: { ...item.description } });
    setDialogOpen(true);
  }

  function handleSave() {
    if (!form.title.ru.trim()) {
      toast.error(t("admin.toast.error"));
      return;
    }
    saveService({ ...form, id: editingId ?? uid() });
    toast.success(t("admin.toast.saved"));
    setDialogOpen(false);
  }

  function handleDelete() {
    if (!deleteTarget) return;
    deleteService(deleteTarget.id);
    toast.success(t("admin.toast.deleted"));
    setDeleteTarget(null);
  }

  function handleWeekdayChange(value: string) {
    setForm((f) => ({ ...f, weekday: Number(value) }));
  }

  function handleTimeChange(e: ChangeEvent<HTMLInputElement>) {
    setForm((f) => ({ ...f, time: e.target.value }));
  }

  function handleTitleChange(lang: "ru" | "tj", value: string) {
    setForm((f) => ({ ...f, title: { ...f.title, [lang]: value } }));
  }

  function handleDescriptionChange(lang: "ru" | "tj", value: string) {
    setForm((f) => ({ ...f, description: { ...f.description, [lang]: value } }));
  }

  return (
    <div className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold sm:text-3xl">
            {t("admin.schedule.title")}
          </h1>
          <p className="mt-1 text-sm text-stone-600">{t("admin.schedule.subtitle")}</p>
        </div>
        {canEdit ? (
          <Button onClick={openAdd} className="shrink-0">
            <Plus className="h-4 w-4" aria-hidden="true" />
            {t("admin.schedule.add")}
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

      {/* Grouped list */}
      {groups.length === 0 ? (
        <EmptyState
          icon={<CalendarDays className="h-6 w-6" aria-hidden="true" />}
          title={t("admin.schedule.empty")}
        />
      ) : (
        <div className="space-y-6">
          {groups.map(({ weekday, items }) => (
            <section key={weekday} aria-label={t(`schedule.day.${weekday}`)}>
              <h2 className="mb-2 flex items-center gap-2 font-serif text-base font-semibold text-teal-800">
                <CalendarDays className="h-4 w-4 text-teal-600" aria-hidden="true" />
                {t(`schedule.day.${weekday}`)}
              </h2>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="flex flex-col gap-3 rounded-2xl border border-teal-100 bg-white p-4 sm:flex-row sm:items-center sm:gap-4"
                  >
                    <span className="inline-flex w-fit items-center rounded-xl bg-teal-50 px-3 py-1.5 text-sm font-bold text-teal-800">
                      {item.time}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold leading-snug text-stone-800">
                        {loc(item.title)}
                      </p>
                      {loc(item.description) ? (
                        <p className="mt-0.5 line-clamp-2 text-sm leading-snug text-stone-500">
                          {loc(item.description)}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
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
            </section>
          ))}
        </div>
      )}

      {/* Add / edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingId ? t("common.edit") : t("admin.schedule.add")}
            </DialogTitle>
            <DialogDescription>{t("admin.schedule.subtitle")}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="svc-weekday">{t("admin.schedule.weekday")}</Label>
              <Select
                value={String(form.weekday)}
                onValueChange={handleWeekdayChange}
              >
                <SelectTrigger id="svc-weekday" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {WEEKDAY_ORDER.map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {t(`schedule.day.${n}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="svc-time">{t("admin.schedule.time")}</Label>
              <Input
                id="svc-time"
                type="time"
                value={form.time}
                onChange={handleTimeChange}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="svc-title-ru">{t("admin.form.ruTitle")}</Label>
              <Input
                id="svc-title-ru"
                value={form.title.ru}
                onChange={(e) => handleTitleChange("ru", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="svc-title-tj">{t("admin.form.tjTitle")}</Label>
              <Input
                id="svc-title-tj"
                value={form.title.tj}
                onChange={(e) => handleTitleChange("tj", e.target.value)}
                placeholder={t("common.optional")}
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="svc-desc-ru">{t("admin.form.ruDescription")}</Label>
              <Textarea
                id="svc-desc-ru"
                rows={3}
                value={form.description.ru}
                onChange={(e) => handleDescriptionChange("ru", e.target.value)}
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="svc-desc-tj">{t("admin.form.tjDescription")}</Label>
              <Textarea
                id="svc-desc-tj"
                rows={3}
                value={form.description.tj}
                onChange={(e) => handleDescriptionChange("tj", e.target.value)}
                placeholder={t("common.optional")}
              />
            </div>
            <div className="flex items-center justify-between gap-4 rounded-2xl border border-teal-100 bg-teal-50/50 px-4 py-3 sm:col-span-2">
              <Label htmlFor="svc-published" className="cursor-pointer">
                {t("admin.form.published")}
              </Label>
              <Switch
                id="svc-published"
                checked={form.published}
                onCheckedChange={(v) => setForm((f) => ({ ...f, published: v }))}
              />
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
              {deleteTarget ? ` «${loc(deleteTarget.title)}»` : ""}
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
