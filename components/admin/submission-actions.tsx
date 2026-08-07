"use client";

import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { adminSubmission } from "@/content/admin";
import type { SubmissionStatus } from "@/lib/db/submissions";
import {
  deleteSubmission,
  retryDelivery,
  setSubmissionStatus,
} from "@/app/admin/(dashboard)/submissions/actions";

export function SubmissionActions({
  id,
  status,
  delivery,
  afterDelete,
}: {
  id: string;
  status: SubmissionStatus;
  /** Shows the resend item when the notification email failed. */
  delivery?: "pending" | "sent" | "failed";
  /** The detail page returns to the inbox after a delete. */
  afterDelete?: "back";
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [failed, setFailed] = useState(false);
  const [pending, startTransition] = useTransition();

  function update(next: SubmissionStatus) {
    setFailed(false);
    startTransition(async () => {
      try {
        await setSubmissionStatus(id, next);
        router.refresh();
      } catch {
        setFailed(true);
      }
    });
  }

  function retry() {
    setFailed(false);
    startTransition(async () => {
      try {
        await retryDelivery(id);
        router.refresh();
      } catch {
        setFailed(true);
        // The recorded failure reason changed even so; refresh shows it.
        router.refresh();
      }
    });
  }

  function handleDelete() {
    setFailed(false);
    startTransition(async () => {
      try {
        await deleteSubmission(id);
        setConfirming(false);
        if (afterDelete === "back") router.push("/admin/submissions");
        else router.refresh();
      } catch {
        setConfirming(false);
        setFailed(true);
      }
    });
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={adminSubmission.actions.menu}
          className="flex size-8 pointer-coarse:size-11 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <MoreHorizontal className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {status === "new" ? (
            <DropdownMenuItem onClick={() => update("read")}>
              {adminSubmission.actions.markRead}
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => update("new")}>
              {adminSubmission.actions.markUnread}
            </DropdownMenuItem>
          )}
          {status === "archived" ? (
            <DropdownMenuItem onClick={() => update("read")}>
              {adminSubmission.actions.unarchive}
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => update("archived")}>
              {adminSubmission.actions.archive}
            </DropdownMenuItem>
          )}
          {delivery === "failed" && (
            <DropdownMenuItem disabled={pending} onClick={retry}>
              {pending
                ? adminSubmission.actions.resending
                : adminSubmission.actions.resend}
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setConfirming(true)}
          >
            {adminSubmission.actions.del}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {failed && (
        // basis-full drops the message onto its own full-width line in both
        // flex-wrap hosts (list row, detail header) instead of crushing them.
        <span
          role="status"
          className="order-last basis-full pb-3 text-sm text-destructive"
        >
          {adminSubmission.actions.error}
        </span>
      )}

      <AlertDialog open={confirming} onOpenChange={setConfirming}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {adminSubmission.deleteConfirm.title}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {adminSubmission.deleteConfirm.body}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {adminSubmission.deleteConfirm.cancel}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={pending}>
              {adminSubmission.deleteConfirm.confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
