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

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/admin" className="px-2 py-1.5">
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
                        render={<Link href={item.href} />}
                        isActive={
                          // "/admin" would prefix-match every route.
                          item.href === "/admin"
                            ? pathname === "/admin"
                            : pathname.startsWith(item.href)
                        }
                      >
                        {Icon && <Icon />}
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                      {item.href === "/admin/submissions" && newCount > 0 && (
                        <SidebarMenuBadge className="tabular">
                          {newCount}
                        </SidebarMenuBadge>
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
        <div className="flex items-center justify-between gap-2 px-2 pb-1">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex min-w-0 items-center gap-2 rounded-md p-1 text-left hover:bg-muted">
              <AdminAvatar email={email} size={32} />
              <span className="min-w-0">
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
          <ThemeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
