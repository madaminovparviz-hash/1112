/**
 * POST /api/youtube
 *
 * Tier-2 helper: proxies the YouTube Data API v3 so the API key never has to
 * live in client code. In this demo the admin panel posts the key/channel it
 * stored locally; in production this endpoint should read the key from
 * server-side environment variables instead and cache the response.
 *
 * Body: { apiKey: string, channelId: string, maxResults?: number }
 * Returns: { videos: { videoId, title, description, publishedAt }[] }
 * Errors:  { error: string } with a helpful message (bad key, quota, etc.).
 */

import { NextResponse } from "next/server";

interface YoutubeSearchItem {
  id?: { videoId?: string };
  snippet?: {
    title?: string;
    description?: string;
    publishedAt?: string;
  };
}

export async function POST(request: Request) {
  let body: { apiKey?: string; channelId?: string; maxResults?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const apiKey = (body.apiKey ?? "").trim();
  const channelId = (body.channelId ?? "").trim();
  const maxResults = Math.min(Math.max(body.maxResults ?? 12, 1), 50);

  if (!apiKey || !channelId) {
    return NextResponse.json(
      { error: "Both apiKey and channelId are required" },
      { status: 400 },
    );
  }

  const url =
    "https://www.googleapis.com/youtube/v3/search" +
    `?key=${encodeURIComponent(apiKey)}` +
    `&channelId=${encodeURIComponent(channelId)}` +
    "&part=snippet&order=date&type=video" +
    `&maxResults=${maxResults}`;

  try {
    const response = await fetch(url, { cache: "no-store" });
    const payload: {
      error?: { message?: string; reason?: string };
      items?: YoutubeSearchItem[];
    } = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message =
        payload.error?.message ?? `YouTube API responded with ${response.status}`;
      const hint =
        payload.error?.reason === "quotaExceeded"
          ? " (квота YouTube API исчерпана — попробуйте завтра)"
          : response.status === 403
            ? " (проверьте API-ключ и ограничения доступа)"
            : "";
      return NextResponse.json({ error: `${message}${hint}` }, { status: 502 });
    }

    const videos = (payload.items ?? [])
      .filter((item) => item.id?.videoId)
      .map((item) => ({
        videoId: item.id!.videoId!,
        title: item.snippet?.title ?? "",
        description: item.snippet?.description ?? "",
        publishedAt: item.snippet?.publishedAt ?? "",
      }));

    return NextResponse.json({ videos });
  } catch {
    return NextResponse.json(
      { error: "Сеть недоступна — проверьте подключение и попробуйте позже" },
      { status: 502 },
    );
  }
}
