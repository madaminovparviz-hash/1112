"use client";

/**
 * Admin → Настройки.
 * Church info, YouTube channel sync (via /api/youtube proxy), demo data
 * export/reset and the admin action log.
 */

import { useState } from "react";
import {
  Database,
  Download,
  Eye,
  EyeOff,
  RefreshCw,
  RotateCcw,
  Save,
  ShieldAlert,
  Youtube,
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCanEdit } from "@/lib/permissions";
import { useDateFormatter, useLoc, useT } from "@/lib/i18n";
import { useChurchStore } from "@/lib/store/useChurchStore";
import type { VideoItem } from "@/lib/store/types";

interface SyncResponse {
  videos?: { videoId: string; title: string; description: string; publishedAt: string }[];
  error?: string;
}

export default function SettingsPanel() {
  const t = useT();
  const loc = useLoc();
  const fmt = useDateFormatter();
  const canEdit = useCanEdit("settings");

  const settings = useChurchStore((s) => s.data.settings);
  const actionLog = useChurchStore((s) => s.data.actionLog);
  const updateSettings = useChurchStore((s) => s.updateSettings);
  const setVideos = useChurchStore((s) => s.setVideos);
  const exportJson = useChurchStore((s) => s.exportJson);
  const resetAll = useChurchStore((s) => s.resetAll);

  const [draft, setDraft] = useState({
    churchNameRu: settings.churchName.ru,
    churchNameTj: settings.churchName.tj,
    addressRu: settings.address.ru,
    addressTj: settings.address.tj,
    phone: settings.phone,
    email: settings.email,
  });
  const [yt, setYt] = useState({
    apiKey: settings.youtubeApiKey,
    channelId: settings.youtubeChannelId,
  });
  const [showKey, setShowKey] = useState(false);
  const [syncing, setSyncing] = useState(false);

  function saveGeneral() {
    if (!canEdit) return;
    updateSettings({
      churchName: { ru: draft.churchNameRu.trim(), tj: draft.churchNameTj.trim() },
      address: { ru: draft.addressRu.trim(), tj: draft.addressTj.trim() },
      phone: draft.phone.trim(),
      email: draft.email.trim(),
    });
    toast.success(t("admin.toast.saved"));
  }

  async function handleSync() {
    const apiKey = yt.apiKey.trim();
    const channelId = yt.channelId.trim();
    if (!apiKey || !channelId) {
      toast.error(t("admin.settings.youtube.noKey"));
      return;
    }
    setSyncing(true);
    try {
      const res = await fetch("/api/youtube", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey, channelId, maxResults: 12 }),
      });
      const payload: SyncResponse = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(
          `${t("admin.settings.youtube.syncError")}: ${payload.error ?? t("admin.settings.youtube.syncError")}`,
        );
        return;
      }
      const mapped: VideoItem[] = (payload.videos ?? []).map((v) => ({
        id: crypto.randomUUID(),
        title: { ru: v.title, tj: "" },
        description: { ru: (v.description ?? "").slice(0, 180), tj: "" },
        videoId: v.videoId,
        publishedAt: v.publishedAt,
        source: "youtube",
      }));
      setVideos(mapped);
      updateSettings({ youtubeApiKey: apiKey, youtubeChannelId: channelId });
      toast.success(t("admin.settings.youtube.syncOk"));
    } catch {
      toast.error(
        `${t("admin.settings.youtube.syncError")}: ${loc({
          ru: "Сеть недоступна",
          tj: "Шабака дастрас нест",
        })}`,
      );
    } finally {
      setSyncing(false);
    }
  }

  function handleExport() {
    const json = exportJson();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "church-demo-data.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast.success(t("admin.settings.exportOk"));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <header className="space-y-1">
          <h1 className="font-serif text-2xl font-bold text-teal-900 sm:text-3xl">
            {t("admin.settings.title")}
          </h1>
          <p className="text-sm text-stone-600 sm:text-base">{t("admin.settings.subtitle")}</p>
        </header>
        {!canEdit ? (
          <Badge variant="outline" className="border-stone-200 bg-stone-100 text-stone-500">
            {loc({ ru: "Только просмотр", tj: "Танҳо намоиш" })}
          </Badge>
        ) : null}
      </div>

      {/* 1 — Общие данные */}
      <section
        aria-labelledby="settings-general"
        className="rounded-2xl border border-stone-200/70 bg-white p-5 shadow-card sm:p-6"
      >
        <h2 id="settings-general" className="font-serif text-xl font-bold text-teal-900">
          {t("admin.settings.title")}
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="settings-name-ru">{t("admin.settings.churchName")} (RU)</Label>
            <Input
              id="settings-name-ru"
              value={draft.churchNameRu}
              disabled={!canEdit}
              onChange={(e) => setDraft((d) => ({ ...d, churchNameRu: e.target.value }))}
              className="min-h-11"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="settings-name-tj">{t("admin.settings.churchName")} (TJ)</Label>
            <Input
              id="settings-name-tj"
              value={draft.churchNameTj}
              disabled={!canEdit}
              onChange={(e) => setDraft((d) => ({ ...d, churchNameTj: e.target.value }))}
              className="min-h-11"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="settings-address-ru">{t("admin.settings.address")} (RU)</Label>
            <Input
              id="settings-address-ru"
              value={draft.addressRu}
              disabled={!canEdit}
              onChange={(e) => setDraft((d) => ({ ...d, addressRu: e.target.value }))}
              className="min-h-11"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="settings-address-tj">{t("admin.settings.address")} (TJ)</Label>
            <Input
              id="settings-address-tj"
              value={draft.addressTj}
              disabled={!canEdit}
              onChange={(e) => setDraft((d) => ({ ...d, addressTj: e.target.value }))}
              className="min-h-11"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="settings-phone">{t("admin.settings.phone")}</Label>
            <Input
              id="settings-phone"
              type="tel"
              value={draft.phone}
              disabled={!canEdit}
              onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))}
              className="min-h-11"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="settings-email">{t("admin.settings.email")}</Label>
            <Input
              id="settings-email"
              type="email"
              value={draft.email}
              disabled={!canEdit}
              onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
              className="min-h-11"
            />
          </div>
        </div>
        <div className="mt-4">
          <Button
            type="button"
            onClick={saveGeneral}
            disabled={!canEdit}
            className="min-h-11"
            title={canEdit ? undefined : loc({ ru: "Только просмотр", tj: "Танҳо намоиш" })}
          >
            <Save className="h-4 w-4" aria-hidden="true" />
            {t("common.save")}
          </Button>
        </div>
      </section>

      {/* 2 — YouTube */}
      <section
        aria-labelledby="settings-youtube"
        className="rounded-2xl border border-stone-200/70 bg-white p-5 shadow-card sm:p-6"
      >
        <h2
          id="settings-youtube"
          className="flex items-center gap-2 font-serif text-xl font-bold text-teal-900"
        >
          <Youtube className="h-5 w-5 text-red-500" aria-hidden="true" />
          {t("admin.settings.youtube.title")}
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-stone-600">
          {t("admin.settings.youtube.desc")}
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="yt-key">{t("admin.settings.youtube.key")}</Label>
            <div className="relative">
              <Input
                id="yt-key"
                type={showKey ? "text" : "password"}
                value={yt.apiKey}
                disabled={!canEdit}
                onChange={(e) => setYt((y) => ({ ...y, apiKey: e.target.value }))}
                autoComplete="off"
                className="min-h-11 pr-12 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowKey((v) => !v)}
                aria-label={showKey ? t("common.close") : t("admin.settings.youtube.key")}
                aria-pressed={showKey}
                className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-stone-400 hover:text-teal-700"
              >
                {showKey ? (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="yt-channel">{t("admin.settings.youtube.channel")}</Label>
            <Input
              id="yt-channel"
              value={yt.channelId}
              disabled={!canEdit}
              onChange={(e) => setYt((y) => ({ ...y, channelId: e.target.value }))}
              placeholder="UC…"
              autoComplete="off"
              className="min-h-11 font-mono"
            />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button
            type="button"
            onClick={handleSync}
            disabled={syncing || !canEdit}
            className="min-h-11"
          >
            <RefreshCw
              className={syncing ? "h-4 w-4 animate-spin" : "h-4 w-4"}
              aria-hidden="true"
            />
            {syncing ? t("admin.settings.youtube.syncing") : t("admin.settings.youtube.sync")}
          </Button>
          <p className="text-xs leading-relaxed text-stone-400">
            {t("admin.settings.youtube.fallback")}
          </p>
        </div>
      </section>

      {/* 3 — Данные */}
      <section
        aria-labelledby="settings-data"
        className="rounded-2xl border border-stone-200/70 bg-white p-5 shadow-card sm:p-6"
      >
        <h2
          id="settings-data"
          className="flex items-center gap-2 font-serif text-xl font-bold text-teal-900"
        >
          <Database className="h-5 w-5 text-teal-600" aria-hidden="true" />
          {t("admin.settings.data.title")}
        </h2>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button type="button" variant="outline" onClick={handleExport} className="min-h-11">
            <Download className="h-4 w-4" aria-hidden="true" />
            {t("admin.settings.export")}
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                disabled={!canEdit}
                className="min-h-11"
                title={canEdit ? undefined : loc({ ru: "Только просмотр", tj: "Танҳо намоиш" })}
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                {t("admin.settings.reset")}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("admin.settings.resetConfirm.title")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t("admin.settings.resetConfirm.text")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="min-h-11">{t("common.cancel")}</AlertDialogCancel>
                <AlertDialogAction
                  className="min-h-11 bg-destructive text-white hover:bg-destructive/90"
                  onClick={() => {
                    resetAll();
                    toast.success(
                      loc({
                        ru: "Демо-данные сброшены",
                        tj: "Маълумоти намунавӣ барқарор карда шуд",
                      }),
                    );
                  }}
                >
                  {t("common.delete")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </section>

      {/* 4 — Журнал действий */}
      <section
        aria-labelledby="settings-log"
        className="rounded-2xl border border-stone-200/70 bg-white p-5 shadow-card sm:p-6"
      >
        <h2
          id="settings-log"
          className="flex items-center gap-2 font-serif text-xl font-bold text-teal-900"
        >
          <ShieldAlert className="h-5 w-5 text-teal-600" aria-hidden="true" />
          {t("admin.settings.log")}
        </h2>
        {actionLog.length === 0 ? (
          <p className="mt-4 text-sm italic text-stone-400">{t("admin.settings.logEmpty")}</p>
        ) : (
          <ScrollArea className="mt-4 max-h-80 pr-3">
            <ul className="space-y-2">
              {actionLog.slice(0, 30).map((e) => (
                <li
                  key={e.id}
                  className="flex items-start gap-2.5 rounded-xl bg-stone-50 px-3 py-2"
                >
                  <span
                    aria-hidden="true"
                    className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-teal-500"
                  />
                  <div className="min-w-0">
                    <p className="break-words text-sm font-semibold text-stone-700">
                      {e.action}
                      {e.details ? (
                        <span className="font-normal text-stone-500"> — {e.details}</span>
                      ) : null}
                    </p>
                    <p className="text-xs text-stone-400">
                      {e.user} · {fmt(e.at, { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
      </section>
    </div>
  );
}
