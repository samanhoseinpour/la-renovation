import {
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const submissionStatus = pgEnum("submission_status", [
  "new",
  "read",
  "archived",
]);

export const deliveryStatus = pgEnum("delivery_status", [
  "pending",
  "sent",
  "failed",
]);

// Column caps mirror the zod maxes in app/(site)/contact/schema.ts one for
// one; the action validates before anything reaches an INSERT. No IP and no
// user agent on purpose: /privacy promises the enquiry row holds only what
// the form asked for.
export const submissions = pgTable(
  "submissions",
  {
    // uuid rather than serial: the id rides in notification emails and admin
    // URLs, and a sequential int would leak enquiry volume.
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 200 }).notNull(),
    email: varchar("email", { length: 254 }).notNull(),
    phone: varchar("phone", { length: 40 }),
    company: varchar("company", { length: 200 }),
    // varchar(80)[] keeps the per-title cap at the DB level; the cap of 8
    // entries is zod-only, since Postgres arrays carry no length constraint.
    services: varchar("services", { length: 80 }).array(),
    stage: varchar("stage", { length: 40 }),
    message: text("message"),
    status: submissionStatus("status").notNull().default("new"),
    delivery: deliveryStatus("delivery").notNull().default("pending"),
    deliveryError: text("delivery_error"),
    deliveredAt: timestamp("delivered_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    index("submissions_status_created_idx").on(t.status, t.createdAt.desc()),
    index("submissions_delivery_idx").on(t.delivery),
    // Trigram GIN indexes carry the inbox's per-keystroke ILIKE '%…%'
    // search; they need pg_trgm, created by drizzle/0002_pg_trgm.sql.
    index("submissions_name_trgm_idx").using("gin", t.name.op("gin_trgm_ops")),
    index("submissions_email_trgm_idx").using(
      "gin",
      t.email.op("gin_trgm_ops"),
    ),
    index("submissions_company_trgm_idx").using(
      "gin",
      t.company.op("gin_trgm_ops"),
    ),
    index("submissions_message_trgm_idx").using(
      "gin",
      t.message.op("gin_trgm_ops"),
    ),
  ],
);

export type Submission = typeof submissions.$inferSelect;

export const rateLimitHits = pgTable(
  "rate_limit_hits",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    // Hex HMAC-SHA256 of the client IP. The raw address is never stored.
    ipHash: varchar("ip_hash", { length: 64 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("rate_limit_hits_hash_created_idx").on(t.ipHash, t.createdAt),
  ],
);
