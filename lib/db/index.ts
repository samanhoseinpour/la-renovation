import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

// Mirrors DeliveryNotConfiguredError in lib/delivery.ts: the contact action
// catches this and degrades to the email-only path.
export class DatabaseNotConfiguredError extends Error {
  constructor() {
    super("No database is configured.");
    this.name = "DatabaseNotConfiguredError";
  }
}

let cached: ReturnType<typeof create> | null = null;

function create(url: string) {
  return drizzle({ client: neon(url), schema });
}

/**
 * Lazy on purpose: a missing DATABASE_URL must surface as a catchable error
 * inside the caller, never as an import-time crash. No `server-only` guard:
 * scripts/seed-admins.ts loads this under plain node via tsx.
 */
export function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new DatabaseNotConfiguredError();
  return (cached ??= create(url));
}
