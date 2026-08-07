import type { Metadata } from "next";

import { AdminAvatar } from "@/components/admin/admin-avatar";
import { ChangePasswordForm } from "@/components/admin/change-password-form";
import { DisplayNameForm } from "@/components/admin/display-name-form";
import { PasskeyManager } from "@/components/admin/passkey-manager";
import { SessionManager } from "@/components/admin/session-manager";
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
  const session = await requireAdmin();

  return (
    <div className="mx-auto grid max-w-3xl gap-8">
      <h1 className="text-h2">{adminSettings.title}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{adminSettings.profile.title}</CardTitle>
          <CardDescription>{adminSettings.profile.lead}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex items-center gap-3">
            <AdminAvatar email={session.user.email} size={48} />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {session.user.name}
              </p>
              <p className="truncate text-sm text-muted-foreground">
                {session.user.email}
              </p>
            </div>
          </div>
          <DisplayNameForm initialName={session.user.name} />
        </CardContent>
      </Card>
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
      <Card>
        <CardHeader>
          <CardTitle>{adminSettings.sessions.title}</CardTitle>
          <CardDescription>{adminSettings.sessions.lead}</CardDescription>
        </CardHeader>
        <CardContent>
          <SessionManager currentSessionId={session.session.id} />
        </CardContent>
      </Card>
    </div>
  );
}
