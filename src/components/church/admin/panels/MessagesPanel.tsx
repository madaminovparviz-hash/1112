"use client";

/**
 * Admin → Сообщения (contact form submissions).
 * Unread first; each card shows contacts and a private reply hint.
 * Demo privacy: everything lives in localStorage only.
 */

import { useMemo } from "react";
import {
  Inbox,
  Info,
  Mail,
  MailOpen,
  Phone,
  ShieldAlert,
  Trash2,
} from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/church/shared";
import { useCanEdit } from "@/lib/permissions";
import { useDateFormatter, useT } from "@/lib/i18n";
import { useChurchStore } from "@/lib/store/useChurchStore";
import { cn } from "@/lib/utils";

export default function MessagesPanel() {
  const t = useT();
  const fmt = useDateFormatter();
  const canEdit = useCanEdit("messages");

  const messages = useChurchStore((s) => s.data.messages);
  const markMessage = useChurchStore((s) => s.markMessage);
  const deleteMessage = useChurchStore((s) => s.deleteMessage);

  const sorted = useMemo(
    () =>
      [...messages].sort(
        (a, b) =>
          Number(a.read) - Number(b.read) || b.createdAt.localeCompare(a.createdAt),
      ),
    [messages],
  );

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="font-serif text-2xl font-bold text-teal-900 sm:text-3xl">
          {t("admin.messages.title")}
        </h1>
        <p className="text-sm text-stone-600 sm:text-base">{t("admin.messages.subtitle")}</p>
      </header>

      <Alert className="border-amber-200 bg-amber-50 text-amber-900 [&>svg]:text-amber-500">
        <ShieldAlert className="h-4 w-4" />
        <AlertDescription className="text-amber-800">
          {t("admin.messages.privacyWarning")}
        </AlertDescription>
      </Alert>

      {sorted.length === 0 ? (
        <EmptyState icon={<Inbox className="h-6 w-6" />} title={t("admin.messages.empty")} />
      ) : (
        <div className="space-y-4">
          {sorted.map((m) => (
            <article
              key={m.id}
              className={cn(
                "rounded-2xl border bg-white p-5 shadow-card",
                m.read ? "border-stone-200/70" : "border-amber-300/80",
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                      m.read ? "bg-stone-100 text-stone-400" : "bg-amber-100 text-amber-600",
                    )}
                  >
                    <Inbox className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 text-sm font-bold text-stone-800">
                      <span className="truncate">{m.name}</span>
                      {!m.read ? (
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full bg-amber-500"
                          aria-label={t("admin.messages.markUnread")}
                          title={t("admin.messages.markUnread")}
                        />
                      ) : null}
                    </p>
                    <p className="text-xs text-stone-500">{fmt(m.createdAt)}</p>
                  </div>
                </div>
                {canEdit ? (
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="min-h-11"
                      onClick={() => {
                        markMessage(m.id, !m.read);
                        toast.success(t("admin.toast.saved"));
                      }}
                    >
                      {m.read ? (
                        <Mail className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <MailOpen className="h-4 w-4" aria-hidden="true" />
                      )}
                      {m.read ? t("admin.messages.markUnread") : t("admin.messages.markRead")}
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
                              deleteMessage(m.id);
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

              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
                <span className="flex items-center gap-1.5 text-stone-600">
                  <Mail className="h-4 w-4 shrink-0 text-teal-600" aria-hidden="true" />
                  <a
                    href={`mailto:${m.email}`}
                    className="font-medium text-teal-700 underline decoration-teal-300 underline-offset-2 hover:text-teal-800"
                  >
                    {m.email}
                  </a>
                </span>
                {m.phone ? (
                  <span className="flex items-center gap-1.5 text-stone-600">
                    <Phone className="h-4 w-4 shrink-0 text-teal-600" aria-hidden="true" />
                    <span className="font-medium">{m.phone}</span>
                  </span>
                ) : null}
              </div>

              <p className="mt-3 whitespace-pre-line leading-relaxed text-stone-700">{m.message}</p>

              <Alert className="mt-3 border-teal-200 bg-teal-50/70 py-2 text-teal-900 [&>svg]:text-teal-500">
                <Info className="h-4 w-4" />
                <AlertDescription className="text-xs leading-relaxed text-teal-800">
                  {t("admin.messages.replyHint")}
                </AlertDescription>
              </Alert>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
