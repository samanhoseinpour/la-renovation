"use client";

import { Monitor } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { formatRelative } from "@/components/admin/dates";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { adminSettings } from "@/content/admin";
import { authClient } from "@/lib/auth-client";

// Sessions keep no ipAddress or userAgent at rest (blanked by the
// session-create hook per /privacy), so rows identify themselves by their
// timestamps alone. Revocation is keyed by token per the API; the current
// session is matched by id so the live bearer token never has to leave this
// component's fetch.
type SessionRow = {
  id: string;
  token: string;
  createdAt: string | Date;
  updatedAt: string | Date;
};

export function SessionManager({
  currentSessionId,
}: {
  currentSessionId: string;
}) {
  const [sessions, setSessions] = useState<SessionRow[] | null>(null);
  const [rowBusy, setRowBusy] = useState<string | null>(null);
  const [othersBusy, setOthersBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const { data, error: listError } = await authClient.listSessions();
    if (listError) {
      setError(adminSettings.sessions.loadError);
      setSessions((current) => current ?? []);
      return;
    }
    const rows = [...((data ?? []) as SessionRow[])];
    rows.sort((a, b) => {
      if (a.id === currentSessionId) return -1;
      if (b.id === currentSessionId) return 1;
      return +new Date(b.createdAt) - +new Date(a.createdAt);
    });
    setSessions(rows);
  }, [currentSessionId]);

  useEffect(() => {
    // Same shape as PasskeyManager's mount-time fetch; see the note there.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
  }, [refresh]);

  async function handleRevoke(row: SessionRow) {
    setError(null);
    setRowBusy(row.id);
    const { error: revokeError } = await authClient.revokeSession({
      token: row.token,
    });
    setRowBusy(null);
    if (revokeError) {
      setError(adminSettings.sessions.error);
      return;
    }
    await refresh();
  }

  async function handleRevokeOthers() {
    setError(null);
    setOthersBusy(true);
    const { error: revokeError } = await authClient.revokeOtherSessions();
    setOthersBusy(false);
    if (revokeError) {
      setError(adminSettings.sessions.error);
      return;
    }
    await refresh();
  }

  if (sessions === null) {
    return <Skeleton className="h-24 w-full" />;
  }

  return (
    <div className="grid gap-6">
      <ul className="grid gap-2">
        {sessions.map((row) => {
          const current = row.id === currentSessionId;
          return (
            <li
              key={row.id}
              className="flex items-center justify-between gap-4 rounded-lg border border-border px-4 py-3"
            >
              <span className="flex min-w-0 items-center gap-3">
                <Monitor className="size-4 shrink-0 text-muted-foreground" />
                <span className="min-w-0">
                  <span className="block truncate text-sm">
                    {adminSettings.sessions.signedIn}{" "}
                    {formatRelative(new Date(row.createdAt))}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {adminSettings.sessions.lastActive}{" "}
                    {formatRelative(new Date(row.updatedAt))}
                  </span>
                </span>
              </span>
              {current ? (
                <Badge variant="secondary">
                  {adminSettings.sessions.current}
                </Badge>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={rowBusy !== null}
                  onClick={() => handleRevoke(row)}
                >
                  {rowBusy === row.id
                    ? adminSettings.sessions.revoking
                    : adminSettings.sessions.revoke}
                </Button>
              )}
            </li>
          );
        })}
      </ul>
      {sessions.length > 1 && (
        <Button
          type="button"
          variant="outline"
          className="justify-self-start"
          disabled={othersBusy}
          onClick={handleRevokeOthers}
        >
          {othersBusy
            ? adminSettings.sessions.revokingOthers
            : adminSettings.sessions.revokeOthers}
        </Button>
      )}
      <p aria-live="polite" className="text-sm text-destructive">
        {error}
      </p>
    </div>
  );
}
