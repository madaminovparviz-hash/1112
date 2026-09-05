"use client";

/**
 * Zustand store with localStorage persistence — the demo data layer.
 *
 * ⚠️ PRIVACY NOTE: all data (including prayer requests and contact form
 * submissions) lives ONLY in the visitor's browser localStorage. This is fine
 * for a demo, but it is NOT secure or durable storage for real personal or
 * pastoral data. Before going to production, replace the bodies of these
 * actions with API calls to a real backend (see GUIDE.md). The component
 * code does not need to change — only this file and the api/ folder.
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  AdminUser,
  Announcement,
  ChurchData,
  ChurchSettings,
  ContactMessage,
  CustomPage,
  Lesson,
  LogEntry,
  PrayerRequest,
  PrayerStatus,
  Role,
  Sermon,
  ServiceItem,
  Session,
  VideoItem,
} from "./types";
import { createSeedData, uid } from "./seed";

interface PrayerInput {
  name: string | null;
  contact: string | null;
  anonymous: boolean;
  text: string;
  isPublic: boolean;
}

interface MessageInput {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

interface ChurchStore {
  data: ChurchData;
  session: Session | null;

  /** Auth (demo): checks against the users list kept in localStorage. */
  login: (username: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;

  /** Append an entry to the admin action log (kept last 200). */
  log: (action: string, details?: string) => void;

  // Schedule
  saveService: (item: ServiceItem) => void;
  deleteService: (id: string) => void;
  // Lessons
  saveLesson: (item: Lesson) => void;
  deleteLesson: (id: string) => void;
  // Sermons
  saveSermon: (item: Sermon) => void;
  deleteSermon: (id: string) => void;
  // Videos
  saveVideo: (item: VideoItem) => void;
  deleteVideo: (id: string) => void;
  /** Replace the whole video list (used by the YouTube sync). */
  setVideos: (items: VideoItem[]) => void;
  // Prayers (public)
  addPrayer: (input: PrayerInput) => void;
  // Prayers (admin)
  setPrayerStatus: (id: string, status: PrayerStatus) => void;
  setPrayerPublic: (id: string, isPublic: boolean) => void;
  addPrayerComment: (id: string, text: string) => void;
  deletePrayer: (id: string) => void;
  // Messages (public + admin)
  addMessage: (input: MessageInput) => void;
  markMessage: (id: string, read: boolean) => void;
  deleteMessage: (id: string) => void;
  // Announcements
  saveAnnouncement: (item: Announcement) => void;
  deleteAnnouncement: (id: string) => void;
  // Page builder
  saveCustomPage: (item: CustomPage) => void;
  deleteCustomPage: (id: string) => void;
  // Users
  saveUser: (item: AdminUser) => void;
  deleteUser: (id: string) => void;
  // Settings & texts
  updateSettings: (partial: Partial<ChurchSettings>) => void;
  setTextOverride: (key: string, lang: "ru" | "tj", value: string) => void;
  resetTextKey: (key: string) => void;
  // System
  exportJson: () => string;
  resetAll: () => void;
}

export const useChurchStore = create<ChurchStore>()(
  persist(
    (set, get) => {
      /** Helper: patch the data object and optionally append a log entry. */
      const patch = (
        fn: (d: ChurchData) => Partial<ChurchData>,
        logAction?: { action: string; details?: string },
      ) => {
        set((state) => {
          const next = fn(state.data);
          if (!logAction) return { data: { ...state.data, ...next } };
          const entry: LogEntry = {
            id: uid("log"),
            at: new Date().toISOString(),
            user: state.session?.username ?? "guest",
            action: logAction.action,
            details: logAction.details,
          };
          const actionLog = [entry, ...state.data.actionLog].slice(0, 200);
          return { data: { ...state.data, ...next, actionLog } };
        });
      };

      return {
        data: createSeedData(),
        session: null,

        login: (username, password) => {
          const user = get().data.users.find(
            (u) => u.username.trim().toLowerCase() === username.trim().toLowerCase(),
          );
          if (!user || user.password !== password) {
            return { ok: false, error: "wrong-credentials" };
          }
          const session: Session = {
            username: user.username,
            displayName: user.displayName,
            role: user.role,
            loginAt: new Date().toISOString(),
          };
          set({ session });
          get().log("Вход в панель управления", `Роль: ${user.role}`);
          return { ok: true };
        },

        logout: () => {
          set({ session: null });
        },

        log: (action, details) => patch(() => ({}), { action, details }),

        // ---------------- Schedule ----------------
        saveService: (item) => {
          const exists = get().data.services.some((s) => s.id === item.id);
          patch(
            (d) => ({
              services: exists
                ? d.services.map((s) => (s.id === item.id ? item : s))
                : [...d.services, item],
            }),
            { action: exists ? "Изменена служба расписания" : "Добавлена служба расписания", details: item.title.ru },
          );
        },
        deleteService: (id) => {
          const svc = get().data.services.find((s) => s.id === id);
          patch((d) => ({ services: d.services.filter((s) => s.id !== id) }), {
            action: "Удалена служба расписания",
            details: svc?.title.ru,
          });
        },

        // ---------------- Lessons ----------------
        saveLesson: (item) => {
          const exists = get().data.lessons.some((l) => l.id === item.id);
          patch(
            (d) => ({
              lessons: exists
                ? d.lessons.map((l) => (l.id === item.id ? item : l))
                : [...d.lessons, item],
            }),
            { action: exists ? "Изменён урок Субботней школы" : "Добавлен урок Субботней школы", details: `Урок ${item.number}` },
          );
        },
        deleteLesson: (id) => {
          patch((d) => ({ lessons: d.lessons.filter((l) => l.id !== id) }), {
            action: "Удалён урок Субботней школы",
          });
        },

        // ---------------- Sermons ----------------
        saveSermon: (item) => {
          const exists = get().data.sermons.some((s) => s.id === item.id);
          patch(
            (d) => ({
              sermons: exists
                ? d.sermons.map((s) => (s.id === item.id ? item : s))
                : [item, ...d.sermons],
            }),
            { action: exists ? "Изменена проповедь" : "Добавлена проповедь", details: item.title.ru },
          );
        },
        deleteSermon: (id) => {
          patch((d) => ({ sermons: d.sermons.filter((s) => s.id !== id) }), {
            action: "Удалена проповедь",
          });
        },

        // ---------------- Videos ----------------
        saveVideo: (item) => {
          const exists = get().data.videos.some((v) => v.id === item.id);
          patch(
            (d) => ({
              videos: exists
                ? d.videos.map((v) => (v.id === item.id ? item : v))
                : [item, ...d.videos],
            }),
            { action: exists ? "Изменено видео" : "Добавлено видео", details: item.title.ru },
          );
        },
        deleteVideo: (id) => {
          patch((d) => ({ videos: d.videos.filter((v) => v.id !== id) }), {
            action: "Удалено видео",
          });
        },
        setVideos: (items) => {
          patch(() => ({ videos: items }), {
            action: "Синхронизация видео",
            details: `Загружено: ${items.length}`,
          });
        },

        // ---------------- Prayers ----------------
        addPrayer: (input) => {
          const prayer: PrayerRequest = {
            id: uid("pr"),
            name: input.anonymous ? null : input.name || null,
            contact: input.contact || null,
            anonymous: input.anonymous,
            text: input.text,
            createdAt: new Date().toISOString(),
            status: "new",
            isPublic: input.isPublic,
            comments: [],
          };
          patch((d) => ({ prayers: [prayer, ...d.prayers] }), {
            action: "Новая молитвенная нужда",
            details: input.anonymous ? "Анонимно" : input.name || "Без имени",
          });
        },
        setPrayerStatus: (id, status) => {
          patch(
            (d) => ({
              prayers: d.prayers.map((p) => (p.id === id ? { ...p, status } : p)),
            }),
            { action: `Статус молитвенной нужды: ${status}` },
          );
        },
        setPrayerPublic: (id, isPublic) => {
          patch(
            (d) => ({
              prayers: d.prayers.map((p) =>
                p.id === id ? { ...p, isPublic } : p,
              ),
            }),
            { action: `Публикация молитвенной нужды: ${isPublic ? "включена" : "скрыта"}` },
          );
        },
        addPrayerComment: (id, text) => {
          const author = get().session?.displayName ?? "Команда молитвы";
          patch(
            (d) => ({
              prayers: d.prayers.map((p) =>
                p.id === id
                  ? {
                      ...p,
                      comments: [
                        ...p.comments,
                        { id: uid("pc"), author, text, createdAt: new Date().toISOString() },
                      ],
                    }
                  : p,
              ),
            }),
            { action: "Добавлен комментарий к молитвенной нужде" },
          );
        },
        deletePrayer: (id) => {
          patch((d) => ({ prayers: d.prayers.filter((p) => p.id !== id) }), {
            action: "Удалена молитвенная нужда",
          });
        },

        // ---------------- Messages ----------------
        addMessage: (input) => {
          const message: ContactMessage = {
            id: uid("msg"),
            name: input.name,
            email: input.email,
            phone: input.phone,
            message: input.message,
            createdAt: new Date().toISOString(),
            read: false,
          };
          patch((d) => ({ messages: [message, ...d.messages] }), {
            action: "Новое сообщение из формы контактов",
            details: input.name,
          });
        },
        markMessage: (id, read) => {
          patch((d) => ({
            messages: d.messages.map((m) => (m.id === id ? { ...m, read } : m)),
          }));
        },
        deleteMessage: (id) => {
          patch((d) => ({ messages: d.messages.filter((m) => m.id !== id) }), {
            action: "Удалено сообщение",
          });
        },

        // ---------------- Announcements ----------------
        saveAnnouncement: (item) => {
          const exists = get().data.announcements.some((a) => a.id === item.id);
          patch(
            (d) => ({
              announcements: exists
                ? d.announcements.map((a) => (a.id === item.id ? item : a))
                : [item, ...d.announcements],
            }),
            { action: exists ? "Изменено объявление" : "Добавлено объявление", details: item.title.ru },
          );
        },
        deleteAnnouncement: (id) => {
          patch((d) => ({
            announcements: d.announcements.filter((a) => a.id !== id),
          }), { action: "Удалено объявление" });
        },

        // ---------------- Page builder ----------------
        saveCustomPage: (item) => {
          const exists = get().data.customPages.some((p) => p.id === item.id);
          patch(
            (d) => ({
              customPages: exists
                ? d.customPages.map((p) => (p.id === item.id ? item : p))
                : [...d.customPages, item],
            }),
            { action: exists ? "Изменена страница" : "Создана страница", details: item.slug },
          );
        },
        deleteCustomPage: (id) => {
          patch((d) => ({ customPages: d.customPages.filter((p) => p.id !== id) }), {
            action: "Удалена страница",
          });
        },

        // ---------------- Users ----------------
        saveUser: (item) => {
          const exists = get().data.users.some((u) => u.id === item.id);
          patch(
            (d) => ({
              users: exists
                ? d.users.map((u) => (u.id === item.id ? item : u))
                : [...d.users, item],
            }),
            { action: exists ? "Изменён пользователь" : "Создан пользователь", details: item.username },
          );
        },
        deleteUser: (id) => {
          patch((d) => ({ users: d.users.filter((u) => u.id !== id) }), {
            action: "Удалён пользователь",
          });
        },

        // ---------------- Settings & texts ----------------
        updateSettings: (partial) => {
          patch((d) => ({ settings: { ...d.settings, ...partial } }), {
            action: "Обновлены настройки сайта",
            details: Object.keys(partial).join(", "),
          });
        },
        setTextOverride: (key, lang, value) => {
          patch((d) => {
            const current = d.textOverrides[key] ?? { ru: "", tj: "" };
            return {
              textOverrides: {
                ...d.textOverrides,
                [key]: { ...current, [lang]: value },
              },
            };
          }, { action: `Изменён текст сайта: ${key} (${lang})` });
        },
        resetTextKey: (key) => {
          patch((d) => {
            const next = { ...d.textOverrides };
            delete next[key];
            return { textOverrides: next };
          }, { action: `Сброшен текст сайта: ${key}` });
        },

        // ---------------- System ----------------
        exportJson: () => JSON.stringify({ exportedAt: new Date().toISOString(), data: get().data }, null, 2),

        resetAll: () => {
          const seed = createSeedData();
          set({ data: seed, session: null });
        },
      };
    },
    {
      name: "church-demo-data-v1",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    },
  ),
);

/** Role helpers (used by permissions.ts). */
const ROLE_WEIGHT: Record<Role, number> = {
  viewer: 1,
  moderator: 2,
  editor: 3,
  superadmin: 4,
};

export function roleAtLeast(role: Role | undefined | null, min: Role): boolean {
  if (!role) return false;
  return ROLE_WEIGHT[role] >= ROLE_WEIGHT[min];
}
