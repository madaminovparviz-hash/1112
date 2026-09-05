"use client";

/**
 * Admin → Пользователи панели (superadmin only).
 * Demo user management with roles: superadmin / editor / moderator / viewer.
 * DEMO ONLY: passwords are stored in plaintext in localStorage.
 */

import { useMemo, useState } from "react";
import { Pencil, Plus, Save, ShieldAlert, Trash2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCanEdit } from "@/lib/permissions";
import { useDateFormatter, useT } from "@/lib/i18n";
import { useChurchStore } from "@/lib/store/useChurchStore";
import { ROLES, type AdminUser, type Role } from "@/lib/store/types";

const ROLE_BADGE: Record<Role, string> = {
  superadmin: "border-teal-300 bg-teal-100 text-teal-800",
  editor: "border-emerald-300 bg-emerald-100 text-emerald-700",
  moderator: "border-amber-300 bg-amber-100 text-amber-700",
  viewer: "border-stone-300 bg-stone-100 text-stone-600",
};

interface UserForm {
  username: string;
  displayName: string;
  password: string;
  role: Role;
}

const EMPTY_FORM: UserForm = {
  username: "",
  displayName: "",
  password: "",
  role: "viewer",
};

export default function UsersPanel() {
  const t = useT();
  const fmt = useDateFormatter();
  const canEdit = useCanEdit("users");

  const users = useChurchStore((s) => s.data.users);
  const session = useChurchStore((s) => s.session);
  const saveUser = useChurchStore((s) => s.saveUser);
  const deleteUser = useChurchStore((s) => s.deleteUser);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [form, setForm] = useState<UserForm>(EMPTY_FORM);

  const sorted = useMemo(
    () =>
      [...users].sort(
        (a, b) =>
          a.displayName.localeCompare(b.displayName, "ru") || a.username.localeCompare(b.username),
      ),
    [users],
  );

  function openAdd() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setOpen(true);
  }

  function openEdit(u: AdminUser) {
    setEditing(u);
    setForm({
      username: u.username,
      displayName: u.displayName,
      password: u.password,
      role: u.role,
    });
    setOpen(true);
  }

  function handleSave() {
    const username = form.username.trim().toLowerCase();
    const displayName = form.displayName.trim();
    if (!username || !displayName || !form.password.trim()) {
      toast.error(t("admin.toast.error"));
      return;
    }
    if (users.some((u) => u.username.toLowerCase() === username && u.id !== editing?.id)) {
      toast.error(t("admin.users.usernameExists"));
      return;
    }
    saveUser({
      id: editing?.id ?? crypto.randomUUID(),
      username,
      displayName,
      password: form.password,
      role: form.role,
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
            {t("admin.users.title")}
          </h1>
          <p className="text-sm text-stone-600 sm:text-base">{t("admin.users.subtitle")}</p>
        </header>
        {canEdit ? (
          <Button type="button" onClick={openAdd} className="min-h-11">
            <Plus className="h-4 w-4" aria-hidden="true" />
            {t("admin.users.add")}
          </Button>
        ) : null}
      </div>

      <Alert className="border-amber-200 bg-amber-50 text-amber-900 [&>svg]:text-amber-500">
        <ShieldAlert className="h-4 w-4" />
        <AlertDescription className="text-amber-800">
          {t("admin.users.demoWarning")}
        </AlertDescription>
      </Alert>

      <div className="overflow-x-auto rounded-2xl border border-stone-200/70 bg-white shadow-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-stone-50/70 hover:bg-stone-50/70">
              <TableHead>{t("admin.users.displayName")}</TableHead>
              <TableHead>{t("admin.users.username")}</TableHead>
              <TableHead>{t("admin.users.role")}</TableHead>
              <TableHead>{t("admin.table.date")}</TableHead>
              <TableHead className="text-right">{t("admin.table.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((u) => {
              const isSelf = session?.username === u.username;
              return (
                <TableRow key={u.id}>
                  <TableCell className="font-semibold text-stone-800">{u.displayName}</TableCell>
                  <TableCell>
                    <span className="font-mono text-xs text-stone-600">{u.username}</span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={ROLE_BADGE[u.role]}
                      title={t(`admin.users.role.${u.role}`)}
                    >
                      {u.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm text-stone-500">
                    {fmt(u.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    {canEdit ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label={t("common.edit")}
                          title={t("common.edit")}
                          className="min-h-11 min-w-11 text-stone-400 hover:text-teal-700"
                          onClick={() => openEdit(u)}
                        >
                          <Pencil className="h-4 w-4" aria-hidden="true" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={isSelf}
                              aria-label={
                                isSelf ? t("admin.users.selfDelete") : t("common.delete")
                              }
                              title={isSelf ? t("admin.users.selfDelete") : t("common.delete")}
                              className="min-h-11 min-w-11 text-stone-400 hover:bg-red-50 hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" aria-hidden="true" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                {t("admin.confirmDelete.title")}
                              </AlertDialogTitle>
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
                                  deleteUser(u.id);
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
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? t("common.edit") : t("admin.users.add")}</DialogTitle>
            <DialogDescription className="sr-only">
              {t("admin.users.subtitle")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="user-username">{t("admin.users.username")} *</Label>
                <Input
                  id="user-username"
                  value={form.username}
                  onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                  autoComplete="off"
                  className="min-h-11 font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="user-display">{t("admin.users.displayName")} *</Label>
                <Input
                  id="user-display"
                  value={form.displayName}
                  onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
                  autoComplete="off"
                  className="min-h-11"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="user-password">{t("admin.users.password")} *</Label>
              <Input
                id="user-password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                autoComplete="new-password"
                className="min-h-11 font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="user-role">{t("admin.users.role")}</Label>
              <Select
                value={form.role}
                onValueChange={(v) => setForm((f) => ({ ...f, role: v as Role }))}
              >
                <SelectTrigger id="user-role" className="min-h-11 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r} value={r}>
                      {t(`admin.users.role.${r}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
