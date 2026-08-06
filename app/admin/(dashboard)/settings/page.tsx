import type { Metadata } from "next";

import { ChangePasswordForm } from "@/components/admin/change-password-form";
import { PasskeyManager } from "@/components/admin/passkey-manager";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { adminSettings } from "@/content/admin";
import { requireAdmin } from "@/lib/admin-guard";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  await requireAdmin();

  return (
    <div className="mx-auto grid max-w-3xl gap-8">
      <h1 className="text-h2">{adminSettings.title}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{adminSettings.passkeys.title}</CardTitle>
          <CardDescription>{adminSettings.passkeys.lead}</CardDescription>
        </CardHeader>
        <CardContent>
          <PasskeyManager />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{adminSettings.password.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
