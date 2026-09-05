"use client";

/**
 * MediaPage — sermons and video gallery (public view).
 * Sermons tab: published sermons with optional YouTube dialog, audio player
 * and notes link. Videos tab: video grid; a card without videoId renders an
 * elegant placeholder instead of a player.
 */

import { useState } from "react";
import {
  AudioLines,
  BookOpen,
  CalendarDays,
  ExternalLink,
  Film,
  FileText,
  Mic,
  Play,
  PlayCircle,
  User,
  Youtube,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDateFormatter, useLoc, useT } from "@/lib/i18n";
import { useChurchStore } from "@/lib/store/useChurchStore";
import type { Sermon } from "@/lib/store/types";
import { EmptyState, PageHeader } from "../shared";

/** Extracts a YouTube video id from a URL (or accepts a raw 11-char id). */
function extractYouTubeId(raw: string): string | null {
  const value = raw.trim();
  const match = value.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/);
  if (match) return match[1];
  if (/^[\w-]{11}$/.test(value)) return value;
  return null;
}

export default function MediaPage() {
  const t = useT();
  const loc = useLoc();
  const formatDate = useDateFormatter();
  const sermons = useChurchStore((s) => s.data.sermons);
  const videos = useChurchStore((s) => s.data.videos);

  const [watchSermon, setWatchSermon] = useState<Sermon | null>(null);
  const [watchVideo, setWatchVideo] = useState<{ title: string; id: string } | null>(null);

  const publishedSermons = [...sermons]
    .filter((s) => s.published)
    .sort((a, b) => b.date.localeCompare(a.date));

  const sermonEmbedId = watchSermon?.videoUrl ? extractYouTubeId(watchSermon.videoUrl) : null;
  const sermonDialogTitle = watchSermon ? loc(watchSermon.title) : "";

  return (
    <div>
      <PageHeader
        title={t("media.title")}
        subtitle={t("media.subtitle")}
        icon={<PlayCircle className="h-7 w-7" aria-hidden="true" />}
      />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16" aria-label={t("media.title")}>
        <Tabs defaultValue="sermons" className="gap-8">
          <TabsList className="h-auto w-full rounded-full border border-teal-100 bg-white p-1.5 shadow-card sm:w-auto sm:self-center">
            <TabsTrigger
              value="sermons"
              className="min-h-11 flex-1 rounded-full px-5 text-sm font-semibold data-[state=active]:bg-teal-600 data-[state=active]:text-teal-50 sm:flex-none"
            >
              <Mic className="h-4 w-4" aria-hidden="true" />
              {t("media.tab.sermons")}
            </TabsTrigger>
            <TabsTrigger
              value="videos"
              className="min-h-11 flex-1 rounded-full px-5 text-sm font-semibold data-[state=active]:bg-teal-600 data-[state=active]:text-teal-50 sm:flex-none"
            >
              <Youtube className="h-4 w-4" aria-hidden="true" />
              {t("media.tab.videos")}
            </TabsTrigger>
          </TabsList>

          {/* ---------------- Sermons ---------------- */}
          <TabsContent value="sermons">
            {publishedSermons.length === 0 ? (
              <EmptyState
                icon={<Mic className="h-7 w-7" aria-hidden="true" />}
                title={t("media.sermons.empty")}
              />
            ) : (
              <div className="mx-auto max-w-3xl space-y-5">
                {publishedSermons.map((sermon) => (
                  <article
                    key={sermon.id}
                    className="rounded-3xl border border-teal-100/70 bg-white p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-soft"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant="outline"
                        className="inline-flex items-center gap-1 rounded-full border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800"
                      >
                        <BookOpen className="h-3 w-3" aria-hidden="true" />
                        {loc(sermon.scripture)}
                      </Badge>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                        <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                        {formatDate(sermon.date)}
                      </span>
                    </div>

                    <h3 className="mt-3.5 font-serif text-xl font-semibold leading-snug">
                      {loc(sermon.title)}
                    </h3>
                    <p className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700">
                      <User className="h-4 w-4" aria-hidden="true" />
                      <span>
                        {t("media.sermon.speaker")}: {loc(sermon.speaker)}
                      </span>
                    </p>

                    <p className="mt-3 leading-relaxed text-stone-600">{loc(sermon.summary)}</p>

                    {sermon.videoUrl || sermon.audioUrl || sermon.pdfUrl ? (
                      <div className="mt-4 space-y-3.5 border-t border-teal-100/70 pt-4">
                        {sermon.videoUrl ? (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setWatchSermon(sermon)}
                            className="min-h-11 rounded-full border-teal-200 bg-white text-teal-700 hover:bg-teal-50 hover:text-teal-800"
                          >
                            <Play className="h-4 w-4" aria-hidden="true" />
                            {t("media.sermon.watch")}
                          </Button>
                        ) : null}

                        {sermon.audioUrl ? (
                          <div>
                            <p className="mb-1.5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-teal-700">
                              <AudioLines className="h-4 w-4" aria-hidden="true" />
                              {t("media.sermon.listen")}
                            </p>
                            <audio controls src={sermon.audioUrl} className="w-full" preload="none" />
                          </div>
                        ) : null}

                        {sermon.pdfUrl ? (
                          <Button
                            asChild
                            variant="ghost"
                            className="min-h-11 rounded-full text-amber-800 hover:bg-amber-50 hover:text-amber-900"
                          >
                            <a
                              href={sermon.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={t("media.sermon.notes")}
                            >
                              <FileText className="h-4 w-4" aria-hidden="true" />
                              {t("media.sermon.notes")}
                            </a>
                          </Button>
                        ) : null}
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ---------------- Videos ---------------- */}
          <TabsContent value="videos">
            {videos.length === 0 ? (
              <EmptyState
                icon={<Youtube className="h-7 w-7" aria-hidden="true" />}
                title={t("media.videos.empty")}
              />
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {videos.map((video) => {
                  const title = loc(video.title);
                  if (video.videoId) {
                    return (
                      <article
                        key={video.id}
                        className="group overflow-hidden rounded-3xl border border-teal-100/70 bg-white shadow-card transition-all hover:-translate-y-0.5 hover:shadow-soft"
                      >
                        <div className="relative aspect-video overflow-hidden">
                          <img
                            src={`https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`}
                            alt={title}
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setWatchVideo({ title, id: video.videoId as string })}
                            aria-label={`${t("media.sermon.watch")}: ${title}`}
                            className="absolute inset-0 flex min-h-11 items-center justify-center bg-teal-900/30 transition-colors hover:bg-teal-900/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-100"
                          >
                            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-teal-700 shadow-soft transition-transform group-hover:scale-105">
                              <Play className="ml-0.5 h-6 w-6" aria-hidden="true" />
                            </span>
                          </button>
                        </div>
                        <div className="p-5">
                          <h3 className="font-serif text-base font-semibold leading-snug">{title}</h3>
                          <p className="mt-1.5 text-sm leading-relaxed text-stone-600">
                            {loc(video.description)}
                          </p>
                        </div>
                      </article>
                    );
                  }

                  return (
                    <article
                      key={video.id}
                      className="overflow-hidden rounded-3xl border border-teal-100/70 bg-white shadow-card"
                    >
                      <div
                        role="img"
                        aria-label={t("media.video.placeholder")}
                        className="flex aspect-video flex-col items-center justify-center gap-3 border-b border-teal-100 bg-gradient-to-br from-teal-100 via-teal-50 to-amber-50 p-5 text-center"
                      >
                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-teal-600 shadow-soft">
                          <Film className="h-6 w-6" aria-hidden="true" />
                        </span>
                        <p className="font-serif text-sm font-semibold text-teal-800">
                          {t("media.video.placeholder")}
                        </p>
                      </div>
                      <div className="p-5">
                        <h3 className="font-serif text-base font-semibold leading-snug">{title}</h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-stone-600">
                          {t("media.video.placeholderText")}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </section>

      {/* Sermon video dialog */}
      <Dialog open={watchSermon !== null} onOpenChange={(open) => !open && setWatchSermon(null)}>
        <DialogContent className="max-w-3xl rounded-3xl border-teal-100 bg-white p-5 sm:p-6">
          <DialogHeader>
            <DialogTitle className="pr-8 font-serif text-lg leading-snug sm:text-xl">
              {sermonDialogTitle}
            </DialogTitle>
            <DialogDescription className="text-left leading-relaxed">
              {watchSermon
                ? `${loc(watchSermon.speaker)} · ${loc(watchSermon.scripture)}`
                : null}
            </DialogDescription>
          </DialogHeader>
          {watchSermon ? (
            sermonEmbedId ? (
              <div className="aspect-video w-full overflow-hidden rounded-2xl bg-stone-100 shadow-card">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${sermonEmbedId}`}
                  title={sermonDialogTitle}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  className="h-full w-full"
                />
              </div>
            ) : (
              <Button
                asChild
                className="min-h-11 rounded-full bg-teal-600 text-teal-50 hover:bg-teal-700"
              >
                <a
                  href={watchSermon.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t("media.video.watchOn")}
                >
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  {t("media.video.watchOn")}
                </a>
              </Button>
            )
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Gallery video dialog */}
      <Dialog open={watchVideo !== null} onOpenChange={(open) => !open && setWatchVideo(null)}>
        <DialogContent className="max-w-3xl rounded-3xl border-teal-100 bg-white p-5 sm:p-6">
          <DialogHeader>
            <DialogTitle className="pr-8 font-serif text-lg leading-snug sm:text-xl">
              {watchVideo?.title}
            </DialogTitle>
            <DialogDescription className="sr-only">{watchVideo?.title}</DialogDescription>
          </DialogHeader>
          {watchVideo ? (
            <div className="aspect-video w-full overflow-hidden rounded-2xl bg-stone-100 shadow-card">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${watchVideo.id}`}
                title={watchVideo.title}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                className="h-full w-full"
              />
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
