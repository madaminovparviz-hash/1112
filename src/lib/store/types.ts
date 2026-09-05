/**
 * Data types for the SDA church website demo.
 *
 * PRIVACY / SECURITY NOTE (IMPORTANT):
 * This demo intentionally stores ALL data (including prayer requests and
 * contact submissions) in the browser's localStorage only. localStorage is
 * NOT secure, NOT durable and NOT suitable for real personal or pastoral
 * data. A production deployment MUST replace this layer with a proper
 * backend (see GUIDE.md, "Connecting a real backend") with authentication,
 * access control and encrypted storage before handling real submissions.
 */

/** Supported interface languages. Russian is the default. */
export type Lang = "ru" | "tj";

/** Admin roles (Tier 2). Hierarchy: viewer < moderator < editor < superadmin. */
export type Role = "superadmin" | "editor" | "moderator" | "viewer";

export const ROLES: Role[] = ["viewer", "moderator", "editor", "superadmin"];

/** A text that exists in both site languages. Empty string = not translated yet. */
export interface LocalizedText {
  ru: string;
  tj: string;
}

/** Weekly service / meeting entry (schedule page). */
export interface ServiceItem {
  id: string;
  /** JS weekday: 0 = Sunday ... 6 = Saturday (Sabbath services use 6). */
  weekday: number;
  /** Time in "HH:MM" 24h format. */
  time: string;
  title: LocalizedText;
  description: LocalizedText;
  published: boolean;
}

/** Sabbath School lesson entry. */
export interface Lesson {
  id: string;
  /** Lesson number within the quarter. */
  number: number;
  title: LocalizedText;
  summary: LocalizedText;
  /** Memory verse text (should include an accurate reference in verseRef). */
  keyVerse: LocalizedText;
  /** Reference, e.g. "Римлянам 3:24". */
  verseRef: LocalizedText;
  /** ISO date — the Sabbath this lesson is studied. */
  startDate: string;
  /** Data-URL or external link to a PDF (demo: upload is stored as data-url). */
  pdfUrl?: string;
  published: boolean;
}

/** Sermon entry (media page). */
export interface Sermon {
  id: string;
  title: LocalizedText;
  speaker: LocalizedText;
  /** ISO date when the sermon was preached. */
  date: string;
  /** Scripture reference, e.g. "Иоанна 4:1–26". */
  scripture: LocalizedText;
  summary: LocalizedText;
  /** YouTube video id or full URL (optional). */
  videoUrl?: string;
  /** Data-URL of an audio recording (demo only — localStorage size is limited!). */
  audioUrl?: string;
  /** Data-URL or link to sermon notes PDF. */
  pdfUrl?: string;
  published: boolean;
}

export type PrayerStatus = "new" | "in_prayer" | "prayed" | "archived";

/** Internal note from pastor / prayer team (admin-only, never shown publicly). */
export interface PrayerComment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

/** Prayer request submitted from the public site. SENSITIVE DATA — demo only. */
export interface PrayerRequest {
  id: string;
  /** null when submitted anonymously. */
  name: string | null;
  /** Optional email/phone for private follow-up. NEVER shown publicly. */
  contact: string | null;
  anonymous: boolean;
  text: string;
  createdAt: string;
  status: PrayerStatus;
  /** Whether the submitter consented to show the request on the public page. */
  isPublic: boolean;
  comments: PrayerComment[];
}

/** Contact form submission. SENSITIVE DATA — demo only. */
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: string;
  read: boolean;
}

/** Announcement shown on the home page. */
export interface Announcement {
  id: string;
  title: LocalizedText;
  text: LocalizedText;
  startDate: string;
  pinned: boolean;
  published: boolean;
}

/** Page created with the Tier-2 page builder. */
export interface CustomPage {
  id: string;
  slug: string;
  title: LocalizedText;
  /** Simple markdown-ish content: blank line = paragraph, "## " = heading. */
  content: LocalizedText;
  published: boolean;
  showInNav: boolean;
  createdAt: string;
}

/** Video shown on the media page. videoId === null renders an elegant placeholder. */
export interface VideoItem {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  /** YouTube video id (the part after watch?v=). null = placeholder card. */
  videoId: string | null;
  /** Optional poster image url. */
  thumbnail?: string;
  publishedAt?: string;
  source: "seed" | "youtube" | "manual";
}

/** Admin account. DEMO ONLY: password kept in plaintext in localStorage. */
export interface AdminUser {
  id: string;
  username: string;
  password: string;
  displayName: string;
  role: Role;
  createdAt: string;
}

export interface ChurchSettings {
  churchName: LocalizedText;
  address: LocalizedText;
  phone: string;
  email: string;
  /** Tier 2: YouTube Data API v3 key. Stored client-side in this demo — move to a server in production! */
  youtubeApiKey: string;
  youtubeChannelId: string;
}

export interface LogEntry {
  id: string;
  at: string;
  user: string;
  action: string;
  details?: string;
}

export interface Session {
  username: string;
  displayName: string;
  role: Role;
  loginAt: string;
}

/** The whole persisted dataset. */
export interface ChurchData {
  services: ServiceItem[];
  lessons: Lesson[];
  sermons: Sermon[];
  prayers: PrayerRequest[];
  messages: ContactMessage[];
  announcements: Announcement[];
  customPages: CustomPage[];
  videos: VideoItem[];
  users: AdminUser[];
  settings: ChurchSettings;
  /** Overrides for i18n keys edited in admin → Site texts. */
  textOverrides: Record<string, LocalizedText>;
  actionLog: LogEntry[];
}

/** Public page ids of the SPA (hash routes). */
export type PublicPageId =
  | "home"
  | "about"
  | "schedule"
  | "lessons"
  | "media"
  | "prayer"
  | "contact";

export interface View {
  page: PublicPageId | "admin" | "custom";
  param?: string;
}
