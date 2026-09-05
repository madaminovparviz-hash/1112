"use client";

/**
 * Admin → Дополнительные страницы (Tier-2 page builder).
 * Simple markdown-ish pages with a slug, nav visibility and publish state.
 */

import { useMemo, useState } from "react";
import {
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  ListTree,
  Pencil,
  Plus,
  Save,
  Trash2,
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
import { useLoc, useT } from "@/lib/i18n";
import { useChurchStore } from "@/lib/store/useChurchStore";
import type { CustomPage } from "@/lib/store/types";

interface PageForm {
  slug: string;
  titleRu: string;
  titleTj: string;
  contentRu: string;
  contentTj: string;
  showInNav: boolean;
  published: boolean;
}

const EMPTY_FORM: PageForm = {
  slug: "",
  titleRu: "",
  titleTj: "",
  contentRu: "",
  contentTj: "",
  showInNav: false,
  published: true,
};

const SLUG_RE = /^[a-z0-9-]+$/;

export default function PagesPanel() {
  const t = useT();
  const loc = useLoc();
  const canEdit = useCanEdit("pages");

  const pages = useChurchStore((s) => s.data.customPages);
  const saveCustomPage = useChurchStore((s) => s.saveCustomPage);
  const deleteCustomPage = useChurchStore((s) => s.deleteCustomPage);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CustomPage | null>(null);
  const [form, setForm] = useState<PageForm>(EMPTY_FORM);

  const sorted = useMemo(
    () => [...pages].sort((a, b) => a.title.ru.localeCompare(b.title.ru, "ru")),
    [pages],
  );

  function openAdd() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setOpen(true);
  }

  function openEdit(p: CustomPage) {
    setEditing(p);
    setForm({
      slug: p.slug,
      titleRu: p.title.ru,
      titleTj: p.title.tj,
      contentRu: p.content.ru,
      contentTj: p.content.tj,
      showInNav: p.showInNav,
      published: p.published,
    });
    setOpen(true);
  }

  function handleSave() {
    if (!form.titleRu.trim()) {
      toast.error(t("admin.toast.error"));
      return;
    }
    const slug = form.slug.trim().toLowerCase();
    if (!SLUG_RE.test(slug)) {
      toast.error(t("admin.pages.slugInvalid"));
      return;
    }
    if (pages.some((p) => p.slug === slug && p.id !== editing?.id)) {
      toast.error(t("admin.pages.slugExists"));
      return;
    }
    saveCustomPage({
      id: editing?.id ?? crypto.randomUUID(),
      slug,
      title: { ru: form.titleRu.trim(), tj: form.titleTj.trim() },
      content: { ru: form.contentRu.trim(), tj: form.contentTj.trim() },
      published: form.published,
      showInNav: form.showInNav,
      createdAt: editing?.createdAt ?? new Date().toISOString(),
    });
    toast.success(t("admin.toast.saved"));
    setOpen(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <header className="space-y-1">
          <h1 className="font-serif text-2xl font-bold text-teal-900 sm:text-3xl">
            {t("admin.pages.title")}
          </h1>
          <p className="text-sm text-stone-600 sm:text-base">{t("admin.pages.subtitle")}</p>
        </header>
        {canEdit ? (
          <Button type="button" onClick={openAdd} className="min-h-11">
            <Plus className="h-4 w-4" aria-hidden="true" />
            {t("admin.pages.add")}
          </Button>
        ) : (
          <Badge variant="outline" className="border-stone-200 bg-stone-100 text-stone-500">
            {loc({ ru: "Только просмотр", tj: "Танҳо намоиш" })}
          </Badge>
        )}
      </div>

      {sorted.length === 0 ? (
        <EmptyState icon={<FileText className="h-6 w-6" />} title={t("admin.pages.empty")} />
      ) : (
        <div className="space-y-4">
          {sorted.map((p) => (
            <article
              key={p.id}
              className="rounded-2xl border border-stone-200/70 bg-white p-5 shadow-card"
            >
              <div className="flex flex-wrap items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                  <FileText className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-serif text-lg font-semibold leading-snug text-teal-900">
                    {loc(p.title)}
                  </h3>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    <Badge
                      variant="outline"
                      className="border-stone-200 bg-stone-100 font-mono text-xs font-normal text-stone-600"
                    >
                      /page/{p.slug}
                    </Badge>
                    {p.showInNav ? (
                      <Badge className="border-teal-200 bg-teal-50 text-teal-700">
                        <ListTree className="h-3 w-3" aria-hidden="true" />
                        {t("admin.pages.showInNav")}
                      </Badge>
                    ) : null}
                    {p.published ? (
                      <Badge className="border-teal-200 bg-teal-50 text-teal-700">
                        <Eye className="h-3 w-3" aria-hidden="true" />
                        {t("admin.pages.published")}
                      </Badge>
                    ) : (
                      <Badge className="border-stone-200 bg-stone-100 text-stone-600">
                        <EyeOff className="h-3 w-3" aria-hidden="true" />
                        {loc({ ru: "Черновик", tj: "Лоиҳа" })}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {loc(p.content) ? (
                <p className="mt-3 line-clamp-2 whitespace-pre-line text-sm leading-relaxed text-stone-600">
                  {loc(p.content)}
                </p>
              ) : null}

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="min-h-11"
                  onClick={() => {
                    window.location.hash = `#/page/${p.slug}`;
                  }}
                >
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  {t("admin.pages.view")}
                </Button>
                {canEdit ? (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      className="min-h-11"
                      onClick={() => openEdit(p)}
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
                              deleteCustomPage(p.id);
                              toast.success(t("admin.toast.deleted"));
                            }}
                          >
                            {t("common.delete")}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? t("common.edit") : t("admin.pages.add")}</DialogTitle>
            <DialogDescription className="sr-only">{t("admin.pages.subtitle")}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="page-slug">{t("admin.pages.slug")} *</Label>
                <Input
                  id="page-slug"
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  placeholder="my-page"
                  className="min-h-11 font-mono"
                  autoComplete="off"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="page-title-ru">{t("admin.form.ruTitle")} *</Label>
                <Input
                  id="page-title-ru"
                  value={form.titleRu}
                  onChange={(e) => setForm((f) => ({ ...f, titleRu: e.target.value }))}
                  className="min-h-11"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="page-title-tj">{t("admin.form.tjTitle")}</Label>
              <Input
                id="page-title-tj"
                value={form.titleTj}
                onChange={(e) => setForm((f) => ({ ...f, titleTj: e.target.value }))}
                className="min-h-11"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="page-content-ru">
                  {loc({ ru: "Содержание (русский)", tj: "Мазмун (русӣ)" })}
                </Label>
                <Textarea
                  id="page-content-ru"
                  rows={8}
                  value={form.contentRu}
                  onChange={(e) => setForm((f) => ({ ...f, contentRu: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="page-content-tj">
                  {loc({ ru: "Содержание (таджикский)", tj: "Мазмун (тоҷикӣ)" })}
                </Label>
                <Textarea
                  id="page-content-tj"
                  rows={8}
                  value={form.contentTj}
                  onChange={(e) => setForm((f) => ({ ...f, contentTj: e.target.value }))}
                />
              </div>
            </div>
            <p className="text-xs leading-relaxed text-stone-400">{t("admin.pages.content")}</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-8">
              <div className="flex items-center gap-3">
                <Switch
                  id="page-nav"
                  checked={form.showInNav}
                  onCheckedChange={(v) => setForm((f) => ({ ...f, showInNav: v }))}
                />
                <Label htmlFor="page-nav" className="text-sm font-normal text-stone-600">
                  {t("admin.pages.showInNav")}
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  id="page-published"
                  checked={form.published}
                  onCheckedChange={(v) => setForm((f) => ({ ...f, published: v }))}
                />
                <Label htmlFor="page-published" className="text-sm font-normal text-stone-600">
                  {t("admin.pages.published")}
                </Label>
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
