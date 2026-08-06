import { eq, max } from "drizzle-orm";

import { session, user } from "./auth-schema";
import { getDb } from "./index";

export type TeamLastSignIn = {
  id: string;
  name: string;
  email: string;
  lastSignIn: Date | null;
};

/**
 * Last sign-in still on record per admin. better-auth prunes expired
 * sessions, so null means none survive, not that the account never signed
 * in. Sessions keep no ip or user agent at rest (blanked by the
 * session-create hook), so timestamps are all there is, by design.
 */
export async function listTeamLastSignIns(): Promise<TeamLastSignIn[]> {
  return getDb()
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      lastSignIn: max(session.createdAt),
    })
    .from(user)
    .leftJoin(session, eq(session.userId, user.id))
    .where(eq(user.role, "admin"))
    // user.id is the pk, so name and email are functionally dependent.
    .groupBy(user.id)
    .orderBy(user.name);
}
