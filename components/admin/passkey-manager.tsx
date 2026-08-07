"use client";

import { KeyRound } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

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
import { Skeleton } from "@/components/ui/skeleton";
import { adminSettings } from "@/content/admin";
import { authClient } from "@/lib/auth-client";
import { PASSKEY_NAME_MAX_LENGTH } from "@/lib/validation";

type PasskeyRow = { id: string; name?: string | null };

export function PasskeyManager() {
  const [passkeys, setPasskeys] = useState<PasskeyRow[] | null>(null);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [rowBusy, setRowBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [renaming, setRenaming] = useState<PasskeyRow | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [renameBusy, setRenameBusy] = useState(false);
  const [renameError, setRenameError] = useState(false);

  const refresh = useCallback(async () => {
    const { data, error: listError } = await authClient.passkey.listUserPasskeys();
    if (listError) {
      setError(adminSettings.passkeys.loadError);
      setPasskeys((current) => current ?? []);
      return;
    }
    setPasskeys(data ?? []);
  }, []);

  useEffect(() => {
    // The compiler's effect analysis can't see that setPasskeys in refresh()
    // sits behind an await, so it flags this as a synchronous setState; it
    // isn't one. Mount-time fetch with no other trigger, same shape as any
    // client-only data load.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
  }, [refresh]);

  async function handleAdd(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setBusy(true);
    const result = await authClient.passkey.addPasskey({
      name: name.trim().slice(0, PASSKEY_NAME_MAX_LENGTH) || undefined,
    });
    setBusy(false);
    if (result?.error) {
      setError(adminSettings.passkeys.error);
      return;
    }
    setName("");
    await refresh();
  }

  function openRename(row: PasskeyRow) {
    setRenameError(false);
    setRenameValue(row.name ?? "");
    setRenaming(row);
  }

  async function handleRenameSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!renaming) return;
    const next = renameValue.trim().slice(0, PASSKEY_NAME_MAX_LENGTH);
    // Nothing to save: closing quietly beats a no-op round trip.
    if (!next || next === (renaming.name ?? "")) {
      setRenaming(null);
      return;
    }
    setRenameError(false);
    setRenameBusy(true);
    const { error: renameFailed } = await authClient.passkey.updatePasskey({
      id: renaming.id,
      name: next,
    });
    setRenameBusy(false);
    if (renameFailed) {
      setRenameError(true);
      return;
    }
    setRenaming(null);
    await refresh();
  }

  async function handleRemove(row: PasskeyRow) {
    setError(null);
    setRowBusy(row.id);
    const { error: removeError } = await authClient.passkey.deletePasskey({
      id: row.id,
    });
    setRowBusy(null);
    if (removeError) {
      setError(adminSettings.passkeys.error);
      return;
    }
    await refresh();
  }

  if (passkeys === null) {
    return <Skeleton className="h-24 w-full" />;
  }

  return (
    <div className="grid gap-6">
      {passkeys.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {adminSettings.passkeys.nudge}
        </p>
      ) : (
        <ul className="grid gap-2">
          {passkeys.map((row) => (
            // flex-wrap: when the coarse-pointer button pair no longer fits
            // beside the name, it drops to a right-aligned second line and
            // the name keeps the full row instead of truncating away.
            <li
              key={row.id}
              className="flex min-w-0 flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-lg border border-border px-4 py-3"
            >
              <span className="flex min-w-0 flex-1 basis-40 items-center gap-3">
                <KeyRound
                  className="size-4 shrink-0 text-muted-foreground"
                  aria-hidden
                />
                <span className="truncate">
                  {row.name || adminSettings.passkeys.unnamed}
                </span>
              </span>
              <span className="ml-auto flex shrink-0 gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={rowBusy !== null}
                  onClick={() => openRename(row)}
                >
                  {adminSettings.passkeys.rename}
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  disabled={rowBusy !== null}
                  onClick={() => handleRemove(row)}
                >
                  {adminSettings.passkeys.remove}
                </Button>
              </span>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleAdd} className="grid max-w-sm gap-2">
        <Label htmlFor="passkey-name">
          {adminSettings.passkeys.nameLabel}
        </Label>
        <Input
          id="passkey-name"
          value={name}
          maxLength={PASSKEY_NAME_MAX_LENGTH}
          onChange={(event) => setName(event.target.value)}
          placeholder={adminSettings.passkeys.namePrompt}
        />
        <Button type="submit" variant="brand" disabled={busy}>
          {busy ? adminSettings.passkeys.adding : adminSettings.passkeys.add}
        </Button>
        <p aria-live="polite" className="min-h-5 text-sm text-destructive">
          {error}
        </p>
      </form>

      <Dialog
        open={renaming !== null}
        onOpenChange={(open) => {
          if (!open && !renameBusy) setRenaming(null);
        }}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{adminSettings.passkeys.renameTitle}</DialogTitle>
            <DialogDescription>
              {adminSettings.passkeys.namePrompt}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRenameSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="passkey-rename">
                {adminSettings.passkeys.nameLabel}
              </Label>
              {/* h-11 per the admin form grammar. */}
              <Input
                id="passkey-rename"
                className="h-11"
                value={renameValue}
                maxLength={PASSKEY_NAME_MAX_LENGTH}
                onChange={(event) => setRenameValue(event.target.value)}
              />
            </div>
            <p aria-live="polite" className="min-h-5 text-sm text-destructive">
              {renameError ? adminSettings.passkeys.error : null}
            </p>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={renameBusy}
                onClick={() => setRenaming(null)}
              >
                {adminSettings.passkeys.renameCancel}
              </Button>
              <Button type="submit" variant="brand" disabled={renameBusy}>
                {renameBusy
                  ? adminSettings.profile.submitting
                  : adminSettings.passkeys.renameSave}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
