"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { adminInbox } from "@/content/admin";

type SelectionContextValue = {
  selected: Set<string>;
  visibleIds: string[];
  toggle: (id: string) => void;
  setAll: (ids: string[]) => void;
  clear: () => void;
};

const SelectionContext = createContext<SelectionContextValue | null>(null);

export function useSelection(): SelectionContextValue {
  const value = useContext(SelectionContext);
  if (!value) throw new Error("useSelection outside SelectionProvider");
  return value;
}

/**
 * Client selection state over the server-rendered list. The list keys this
 * provider by filter, search and cursor so any navigation resets the
 * selection; rows, badges and dates stay server-rendered.
 */
export function SelectionProvider({
  visibleIds,
  children,
}: {
  visibleIds: string[];
  children: ReactNode;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const value = useMemo(
    () => ({
      selected,
      visibleIds,
      toggle: (id: string) =>
        setSelected((current) => {
          const next = new Set(current);
          if (next.has(id)) next.delete(id);
          else next.add(id);
          return next;
        }),
      setAll: (ids: string[]) => setSelected(new Set(ids)),
      clear: () => setSelected(new Set()),
    }),
    [selected, visibleIds],
  );
  return (
    <SelectionContext.Provider value={value}>
      {children}
    </SelectionContext.Provider>
  );
}

export function RowCheckbox({ id, name }: { id: string; name: string }) {
  const { selected, toggle } = useSelection();
  return (
    <Checkbox
      checked={selected.has(id)}
      onCheckedChange={() => toggle(id)}
      aria-label={`${adminInbox.selection.selectRow} ${name}`}
    />
  );
}

export function SelectAllCheckbox() {
  const { selected, visibleIds, setAll, clear } = useSelection();
  const all =
    visibleIds.length > 0 && visibleIds.every((id) => selected.has(id));
  const some = !all && visibleIds.some((id) => selected.has(id));
  return (
    <Checkbox
      checked={all}
      indeterminate={some}
      onCheckedChange={() => (all ? clear() : setAll(visibleIds))}
      aria-label={adminInbox.selection.selectAll}
    />
  );
}
