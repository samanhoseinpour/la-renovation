"use client";

import {
  CircleAlert,
  Inbox,
  LayoutDashboard,
  LogOut,
  Mail,
  Search,
  Settings,
  SunMoon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { searchSubmissionsForPalette } from "@/app/admin/(dashboard)/submissions/actions";
import { inboxHref } from "@/components/admin/inbox-params";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { adminInbox, adminNav, adminPalette } from "@/content/admin";
import { authClient } from "@/lib/auth-client";

type PaletteResult = {
  id: string;
  name: string;
  company: string | null;
  when: string;
};

const PaletteContext = createContext<{ setOpen: (open: boolean) => void }>({
  setOpen: () => {},
});

const NAV_ICONS: Record<string, typeof Inbox> = {
  "/admin": LayoutDashboard,
  "/admin/submissions": Inbox,
  "/admin/settings": Settings,
};

/** The header's entry point; the ⌘K listener lives in the provider. */
export function CommandPaletteButton({ shortcut }: { shortcut: string }) {
  const { setOpen } = useContext(PaletteContext);
  return (
    <Button
      variant="ghost"
      size="sm"
      aria-label={adminPalette.buttonLabel}
      onClick={() => setOpen(true)}
      className="ml-auto -mr-2 text-muted-foreground hover:text-foreground"
    >
      <Search />
      <kbd className="hidden font-sans text-xs text-muted-foreground md:inline">
        {shortcut}
      </kbd>
    </Button>
  );
}

export function CommandPaletteProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PaletteResult[]>([]);
  const [searching, setSearching] = useState(false);
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();

  // Resets ride the event handlers, not effects (compiler rule): opening
  // always starts from a fresh palette rather than last time's query.
  const openPalette = useCallback((next: boolean) => {
    setOpen(next);
    if (next) {
      setQuery("");
      setResults([]);
      setSearching(false);
    }
  }, []);

  function handleQueryChange(next: string) {
    setQuery(next);
    const trimmed = next.trim();
    setSearching(Boolean(trimmed));
    if (!trimmed) setResults([]);
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "k" || !(event.metaKey || event.ctrlKey)) return;
      // Same typing guard as the sidebar's ⌘B: Ctrl+K is kill-to-end-of-line
      // in macOS text fields, so never steal it from a focused field.
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable || target.matches("input, textarea, select"))
      ) {
        return;
      }
      event.preventDefault();
      openPalette(!open);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, openPalette]);

  // Debounced server search; every setState here happens inside the timer
  // or promise callbacks, and the cancelled flag drops late responses from
  // a superseded query so results never regress.
  useEffect(() => {
    if (!open) return;
    const q = query.trim();
    if (!q) return;
    let cancelled = false;
    const timer = setTimeout(() => {
      searchSubmissionsForPalette(q)
        .then((rows) => {
          if (!cancelled) setResults(rows);
        })
        .catch(() => {
          if (!cancelled) setResults([]);
        })
        .finally(() => {
          if (!cancelled) setSearching(false);
        });
    }, 200);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, open]);

  const go = useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router],
  );

  async function handleSignOut() {
    setOpen(false);
    await authClient.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  const context = useMemo(() => ({ setOpen: openPalette }), [openPalette]);
  const q = query.trim();
  // Annotation widens the as-const tuple union so flatMap unifies groups.
  const pages: { label: string; href: string }[] = adminNav.groups.flatMap(
    (group) => [...group.items],
  );

  return (
    <PaletteContext.Provider value={context}>
      {children}
      <CommandDialog
        open={open}
        onOpenChange={openPalette}
        title={adminPalette.buttonLabel}
        description={adminPalette.placeholder}
      >
        <CommandInput
          value={query}
          onValueChange={handleQueryChange}
          placeholder={adminPalette.placeholder}
        />
        <CommandList>
          <CommandEmpty>
            {searching ? adminPalette.searching : adminPalette.empty}
          </CommandEmpty>
          <CommandGroup heading={adminPalette.groups.pages}>
            {pages.map((item) => {
              const Icon = NAV_ICONS[item.href];
              return (
                <CommandItem key={item.href} onSelect={() => go(item.href)}>
                  {Icon && <Icon />}
                  {item.label}
                </CommandItem>
              );
            })}
          </CommandGroup>
          <CommandGroup heading={adminPalette.groups.views}>
            <CommandItem onSelect={() => go(inboxHref({ status: "new" }))}>
              <Mail />
              {adminInbox.filters.new}
            </CommandItem>
            <CommandItem onSelect={() => go(inboxHref({ status: "failed" }))}>
              <CircleAlert />
              {adminInbox.filters.failed}
            </CommandItem>
          </CommandGroup>
          {q && (
            <CommandGroup heading={adminPalette.groups.results}>
              {results.map((row) => (
                <CommandItem
                  key={row.id}
                  // The server matched on fields the label may not show
                  // (email, message), so keep cmdk from re-filtering it out.
                  value={`submission-${row.id}`}
                  keywords={[q]}
                  onSelect={() => go(`/admin/submissions/${row.id}`)}
                >
                  <Inbox />
                  <span className="min-w-0 flex-1 truncate">
                    {row.name}
                    {row.company ? ` · ${row.company}` : ""}
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {row.when}
                  </span>
                </CommandItem>
              ))}
              <CommandItem
                value={`search-inbox-${q}`}
                keywords={[q]}
                onSelect={() => go(inboxHref({ status: "all", q }))}
              >
                <Search />
                <span className="min-w-0 flex-1 truncate">
                  {`${adminPalette.searchInbox} "${q}"`}
                </span>
              </CommandItem>
            </CommandGroup>
          )}
          <CommandSeparator />
          <CommandGroup heading={adminPalette.groups.actions}>
            <CommandItem
              onSelect={() => {
                setOpen(false);
                setTheme(resolvedTheme === "dark" ? "light" : "dark");
              }}
            >
              <SunMoon />
              {adminPalette.toggleTheme}
            </CommandItem>
            <CommandItem onSelect={handleSignOut}>
              <LogOut />
              {adminNav.signOut}
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </PaletteContext.Provider>
  );
}
