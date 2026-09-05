"use client";

/**
 * Role-based access for the admin panel (Tier 2).
 * Sections map to admin panels; every panel hides destructive controls for
 * roles below its `min` role. The role hierarchy lives in useChurchStore.
 */

import { useChurchStore } from "@/lib/store/useChurchStore";
import { roleAtLeast } from "@/lib/store/useChurchStore";
import type { Role } from "@/lib/store/types";

export type AdminSection =
  | "dashboard"
  | "schedule"
  | "lessons"
  | "sermons"
  | "videos"
  | "prayers"
  | "messages"
  | "announcements"
  | "pages"
  | "texts"
  | "users"
  | "settings";

/** Minimum role required to OPEN a section and see its content. */
export const SECTION_MIN_ROLE: Record<AdminSection, Role> = {
  dashboard: "viewer",
  schedule: "viewer",
  lessons: "viewer",
  sermons: "viewer",
  videos: "viewer",
  prayers: "moderator",
  messages: "moderator",
  announcements: "viewer",
  pages: "viewer",
  texts: "viewer",
  users: "superadmin",
  settings: "viewer",
};

/** Minimum role required to EDIT (buttons that mutate data) inside a section. */
export const EDIT_MIN_ROLE: Record<AdminSection, Role> = {
  dashboard: "superadmin", // never editable
  schedule: "editor",
  lessons: "editor",
  sermons: "editor",
  videos: "editor",
  prayers: "moderator",
  messages: "moderator",
  announcements: "editor",
  pages: "editor",
  texts: "editor",
  users: "superadmin",
  settings: "superadmin",
};

export function useCurrentRole(): Role | null {
  return useChurchStore((s) => s.session?.role ?? null);
}

/** Can the logged-in user OPEN the section? */
export function useCanView(section: AdminSection): boolean {
  const role = useCurrentRole();
  return roleAtLeast(role, SECTION_MIN_ROLE[section]);
}

/** Can the logged-in user EDIT content inside the section? */
export function useCanEdit(section: AdminSection): boolean {
  const role = useCurrentRole();
  return roleAtLeast(role, EDIT_MIN_ROLE[section]);
}
