"use client";

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
import { Button, buttonVariants } from "@/components/ui/button";
import { useSelection } from "@/components/admin/selection";
import { adminInbox } from "@/content/admin";
import { cn } from "@/lib/utils";
import {
  bulkDelete,
  bulkSetStatus,
} from "@/app/admin/(dashboard)/submissions/actions";

/**
 * Bulk actions over the current selection. Feedback stays inline in the bar
 * per the admin's toast-free contract; the bar itself only exists while
 * something is selected, so an empty-selection action is unreachable.
 */
export function SelectionBar() {
  const router = useRouter();
  const { selected, clear } = useSelection();
  const [confirming, setConfirming] = useState(false);
  const [failed, setFailed] = useState(false);
  const [pending, startTransition] = useTransition();

  const ids = [...selected];
  if (ids.length === 0) return null;

  function run(action: (ids: string[]) => Promise<void>) {
    setFailed(false);
    startTransition(async () => {
      try {
        await action(ids);
        setConfirming(false);
        clear();
        router.refresh();
      } catch {
        setConfirming(false);
        setFailed(true);
      }
    });
  }

  return (
    <>
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <span className="tabular text-sm text-muted-foreground">
          {ids.length} {adminInbox.selection.selectedSuffix}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={pending}
          onClick={clear}
        >
          {adminInbox.selection.clear}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={pending}
          onClick={() => run((list) => bulkSetStatus(list, "read"))}
        >
          {adminInbox.selection.markRead}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={pending}
          onClick={() => run((list) => bulkSetStatus(list, "new"))}
        >
          {adminInbox.selection.markUnread}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={pending}
          onClick={() => run((list) => bulkSetStatus(list, "archived"))}
        >
          {adminInbox.selection.archive}
        </Button>
        <a
          href={`/admin/submissions/export?ids=${ids.join(",")}`}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          {adminInbox.selection.exportSelected}{" "}
          <span className="tabular">({ids.length})</span>
        </a>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          disabled={pending}
          onClick={() => setConfirming(true)}
        >
          {adminInbox.selection.del}
        </Button>
        {failed && (
          <span role="status" className="text-sm text-destructive">
            {adminInbox.selection.error}
          </span>
        )}
      </div>

      <AlertDialog open={confirming} onOpenChange={setConfirming}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {adminInbox.bulkDeleteConfirm.title}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {adminInbox.bulkDeleteConfirm.body}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {adminInbox.bulkDeleteConfirm.cancel}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => run(bulkDelete)}
              disabled={pending}
            >
              {adminInbox.bulkDeleteConfirm.confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
