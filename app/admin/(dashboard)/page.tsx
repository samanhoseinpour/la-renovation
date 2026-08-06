import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/admin-guard";

// The inbox is the admin's home.
export default async function AdminIndexPage() {
  await requireAdmin();
  redirect("/admin/submissions");
}
