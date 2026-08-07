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
 * Bulk actions over the current selection, as a sticky bottom bar: it floats
 * at the viewport edge while the 50-row list scrolls (checking a row never
 * shifts the list), and rests in place after the pagination block on short
 * pages. Feedback stays inline in the bar per the admin's toast-free
 * contract; the bar only exists while something is selected, so an
 * empty-selection action is unreachable.
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
      {/* Negative margins mirror the layout wrapper's px-4 md:px-8 so the
          border-t runs edge to edge of the content column; z-30 sits under
          the sheet, menus and dialogs at z-50. The safe-area pb keeps the
          buttons above an iPhone home indicator. */}
      <div className="sticky bottom-0 z-30 -mx-4 mt-6 border-t border-border bg-background px-4 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] md:-mx-8 md:px-8">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          {/* role=status announces the bar's appearance and each count. */}
          <span role="status" className="tabular text-sm text-muted-foreground">
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
