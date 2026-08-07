import { cookies } from "next/headers";
import type { ReactNode } from "react";

import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { CommandPaletteProvider } from "@/components/admin/command-palette";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { countSubmissionsByStatus } from "@/lib/db/submissions";
import { requireAdmin } from "@/lib/admin-guard";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireAdmin();
  const counts = await countSubmissionsByStatus();
  const cookieStore = await cookies();
  // Written by SidebarProvider as "true"/"false" (components/ui/sidebar.tsx);
  // the literal stays duplicated here because importing a value from that
  // "use client" module into a server component is a client-reference hazard.
  // An absent cookie means expanded, matching the provider's default.
  const sidebarOpen = cookieStore.get("sidebar_state")?.value !== "false";

  return (
    <TooltipProvider>
      <CommandPaletteProvider>
        <SidebarProvider defaultOpen={sidebarOpen}>
          <AdminSidebar
            name={session.user.name}
            email={session.user.email}
            newCount={counts.new}
          />
          {/* SidebarInset renders the page's one main landmark; min-w-0 and
              the wrapper's overflow-x-clip are the horizontal-leak backstop. */}
          <SidebarInset className="min-w-0">
            <AdminHeader />
            <div className="flex-1 overflow-x-clip px-4 py-8 md:px-8">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </CommandPaletteProvider>
    </TooltipProvider>
  );
}
