"use client";

import { Inbox, LayoutDashboard, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { AdminAvatar } from "@/components/admin/admin-avatar";
import { ThemeToggle } from "@/components/site/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { adminNav } from "@/content/admin";
import { authClient } from "@/lib/auth-client";

const NAV_ICONS: Record<string, typeof Inbox> = {
  "/admin": LayoutDashboard,
  "/admin/submissions": Inbox,
  "/admin/settings": Settings,
};

export function AdminSidebar({
  name,
  email,
  newCount,
}: {
  name: string;
  email: string;
  newCount: number;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { setOpenMobile } = useSidebar();

  // No-op on desktop; on phones the sheet must not linger over the new page.
  const closeMobile = () => setOpenMobile(false);

  async function handleSignOut() {
    closeMobile();
    await authClient.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link
          href="/admin"
          onClick={closeMobile}
          // hidden, not faded: a faded link would stay an invisible tab stop.
          className="rounded-md px-2 py-1.5 outline-hidden ring-sidebar-ring focus-visible:ring-2 group-data-[collapsible=icon]:hidden"
        >
          <span className="text-eyebrow">ARAZ</span>{" "}
          <span className="text-sm text-muted-foreground">
            {adminNav.badge}
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {adminNav.groups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = NAV_ICONS[item.href];
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        render={<Link href={item.href} onClick={closeMobile} />}
                        isActive={
                          // "/admin" would prefix-match every route.
                          item.href === "/admin"
                            ? pathname === "/admin"
                            : pathname.startsWith(item.href)
                        }
                        // Rendered only while collapsed to an icon rail; the
                        // unread count rides along since the badge hides there.
                        tooltip={
                          item.href === "/admin/submissions" && newCount > 0
                            ? `${item.label} · ${newCount}`
                            : item.label
                        }
                      >
                        {Icon && <Icon />}
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                      {item.href === "/admin/submissions" && newCount > 0 && (
                        <>
                          <SidebarMenuBadge className="tabular">
                            {newCount}
                          </SidebarMenuBadge>
                          {/* Rail stand-in for the hidden badge. Desktop
                              icon mode only: the sheet has no collapsible
                              wrapper, so this never matches there. */}
                          <span
                            aria-hidden
                            className="pointer-events-none absolute top-1 right-1 hidden size-1.5 rounded-full bg-brand group-data-[collapsible=icon]:block"
                          />
                        </>
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center justify-between gap-2 px-2 pb-1 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex min-w-0 items-center gap-2 rounded-md p-1 text-left outline-hidden ring-sidebar-ring transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 pointer-coarse:p-1.5 group-data-[collapsible=icon]:p-0!">
              <AdminAvatar email={email} size={32} />
              <span className="min-w-0 group-data-[collapsible=icon]:hidden">
                <span className="block truncate text-sm">{name}</span>
                <span className="block truncate text-xs text-muted-foreground">
                  {email}
                </span>
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start">
              {/* Base UI group labels must sit inside a Menu.Group. */}
              <DropdownMenuGroup>
                <DropdownMenuLabel className="grid">
                  <span className="truncate text-sm font-medium">{name}</span>
                  <span className="truncate text-xs font-normal text-muted-foreground">
                    {email}
                  </span>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut />
                {adminNav.signOut}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* size-8! caps the coarse-pointer size-11 inside the 48px rail. */}
          <ThemeToggle className="group-data-[collapsible=icon]:size-8!" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
