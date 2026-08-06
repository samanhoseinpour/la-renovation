/**
 * Seeds the two admin accounts and emails set-password invite links.
 *
 *   npm run db:seed                     create missing admins + invite them
 *   npm run db:seed -- --invite         also re-send invites to existing admins
 *                                       (the recovery for an expired link)
 *   npm run db:seed -- --password=...   dev only: set this password directly
 *                                       on CREATE instead of emailing invites
 *                                       (works against a fresh dev-branch DB)
 *
 * Idempotent: existing users are never re-created.
 */
process.loadEnvFile(".env.local");

const { randomBytes } = await import("node:crypto");
const { eq } = await import("drizzle-orm");
const { auth } = await import("../lib/auth");
const { getDb } = await import("../lib/db");
const { user } = await import("../lib/db/auth-schema");

const ADMINS = [
  { email: "reza@arazconstructiongroup.com", name: "Reza" },
  { email: "dylan@arazconstructiongroup.com", name: "Dylan" },
  // Site administrator's sign-in; enquiry email goes only to the office inbox.
  { email: "teamperseustudio@gmail.com", name: "Saman" },
] as const;

const reinvite = process.argv.includes("--invite");
const passwordArg = process.argv
  .find((arg) => arg.startsWith("--password="))
  ?.slice("--password=".length);

const db = getDb();

for (const account of ADMINS) {
  const existing = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, account.email));

  const created = existing.length === 0;
  if (created) {
    await auth.api.createUser({
      body: {
        email: account.email,
        name: account.name,
        role: "admin",
        // Throwaway unless --password: the invite link replaces it.
        password: passwordArg ?? randomBytes(32).toString("base64url"),
      },
    });
    console.log(`created  ${account.email}`);
  } else {
    console.log(`exists   ${account.email}`);
  }

  if (passwordArg) continue;

  if (created || reinvite) {
    try {
      await auth.api.requestPasswordReset({
        body: { email: account.email, redirectTo: "/admin/reset-password" },
      });
      console.log(
        `invite requested for ${account.email} (delivery is async; verify in the Resend dashboard or watch for a [Better Auth] ERROR line above)`,
      );
    } catch (error) {
      // requestPasswordReset only throws synchronously (e.g. rate limit).
      // Email delivery itself runs as a better-auth background task whose
      // failures surface in its own logger, never here. A later --invite
      // run re-sends.
      console.error(`invite request failed for ${account.email}:`, error);
    }
  }
}
