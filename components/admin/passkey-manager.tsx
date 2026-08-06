"use client";

import { KeyRound } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { adminSettings } from "@/content/admin";
import { authClient } from "@/lib/auth-client";

type PasskeyRow = { id: string; name?: string | null };

export function PasskeyManager() {
  const [passkeys, setPasskeys] = useState<PasskeyRow[] | null>(null);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [rowBusy, setRowBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      name: name.trim() || undefined,
    });
    setBusy(false);
    if (result?.error) {
      setError(adminSettings.passkeys.error);
      return;
    }
    setName("");
    await refresh();
  }

  // window.prompt is deliberate economy for a two-user tool; replace with a
  // dialog if it ever grates.
  async function handleRename(row: PasskeyRow) {
    const next = window.prompt(
      adminSettings.passkeys.namePrompt,
      row.name ?? "",
    );
    if (!next?.trim()) return;
    setError(null);
    setRowBusy(row.id);
    const { error: renameError } = await authClient.passkey.updatePasskey({
      id: row.id,
      name: next.trim(),
    });
    setRowBusy(null);
    if (renameError) {
      setError(adminSettings.passkeys.error);
      return;
    }
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
            <li
              key={row.id}
              className="flex items-center justify-between gap-4 rounded-lg border border-border px-4 py-3"
            >
              <span className="flex min-w-0 items-center gap-3">
                <KeyRound className="size-4 shrink-0 text-muted-foreground" />
                <span className="truncate">
                  {row.name || adminSettings.passkeys.unnamed}
                </span>
              </span>
              <span className="flex shrink-0 gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={rowBusy !== null}
                  onClick={() => handleRename(row)}
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
          onChange={(event) => setName(event.target.value)}
          placeholder={adminSettings.passkeys.namePrompt}
        />
        <Button type="submit" variant="brand" disabled={busy}>
          {busy ? adminSettings.passkeys.adding : adminSettings.passkeys.add}
        </Button>
        <p aria-live="polite" className="text-sm text-destructive">
          {error}
        </p>
      </form>
    </div>
  );
}
