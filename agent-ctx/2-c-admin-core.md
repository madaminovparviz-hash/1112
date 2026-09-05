# Task 2-c — admin-core

Files created (all new, 'use client'):
- src/components/church/admin/AdminApp.tsx — login screen + shell (top bar, desktop sidebar w-60 bg-sidebar, mobile chip nav, section switch over 12 panels). useCanView called unconditionally for all 12 sections; unviewable current section falls back to dashboard via derived `activeSection` (no setState-in-effect, passes react-hooks/set-state-in-effect rule).
- src/components/church/admin/panels/DashboardPanel.tsx — 6 stat cards (newPrayers/unreadMessages/lessons/sermons/services/pages), pure-CSS prayers-by-status bars (new=amber-400, in_prayer=teal-500, prayed=emerald-500, archived=stone-300), recent activity (actionLog 0..8, ScrollArea max-h-64), 4 quick actions → onNavigateSection, disabled when target not viewable.
- src/components/church/admin/panels/SchedulePanel.tsx — grouped by weekday order [6,0,1,2,3,4,5], time chip + loc(title/desc) + published badge, CRUD via saveService/deleteService, Select weekday 0–6, time input, ru/tj title+description, Switch published. Validation: title.ru.
- src/components/church/admin/panels/LessonsPanel.tsx — sorted by number, quarterInfo Alert, CRUD via saveLesson/deleteLesson; dialog: number, startDate, title/summary/keyVerse/verseRef ru+tj, PDF upload (FileReader→dataURL, >1MB rejected with toast, filename+size shown, removable), Checkbox published. Validation: number ≥1 + title.ru.
- src/components/church/admin/panels/SermonsPanel.tsx — sorted date desc, scripture/video/published badges, CRUD via saveSermon/deleteSermon; dialog: title/speaker/scripture/summary ru+tj, date, videoUrl with local extractYouTubeId() helper (accepts ID, watch, youtu.be, embed/shorts/live), PDF upload as lessons, Switch published. Validation: title.ru.

Contract notes for next agents:
- AdminApp imports the 8 panels of 2-d EXACTLY as specified (default exports, optional onNavigateSection prop; only DashboardPanel receives it). Missing modules (Pages/Texts/Users/SettingsPanel at time of writing) cause the expected module-not-found until 2-d lands.
- KEYS MISSING from translations.ts (worked around locally, do not need action): admin.form.pdfHint (fallback literal used + ">1MB" toast literal), no "read-only" key (badge literal "Только просмотр · Танҳо тамошо").
- uid() = crypto.randomUUID() with random-string fallback, defined per-panel.
