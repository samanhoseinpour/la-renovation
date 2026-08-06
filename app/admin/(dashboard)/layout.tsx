import type { ReactNode } from "react";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { countSubmissionsByStatus } from "@/lib/db/submissions";
import { requireAdmin } from "@/lib/admin-guard";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireAdmin();
  const counts = await countSubmissionsByStatus();

  return (
    <SidebarProvider>
      <AdminSidebar
        name={session.user.name}
        email={session.user.email}
        newCount={counts.new}
      />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4" />
        </header>
        <main className="flex-1 px-4 py-8 md:px-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
