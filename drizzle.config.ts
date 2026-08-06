import { defineConfig } from "drizzle-kit";

// drizzle-kit runs outside Next and never sees Next's env loading. On
// CI/Vercel there is no .env.local and the platform provides the vars.
try {
  process.loadEnvFile(".env.local");
} catch {
  // intentionally empty
}

export default defineConfig({
  dialect: "postgresql",
  // Task 5 widens this to ["./lib/db/schema.ts", "./lib/db/auth-schema.ts"].
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dbCredentials: { url: process.env.DATABASE_URL! },
});
