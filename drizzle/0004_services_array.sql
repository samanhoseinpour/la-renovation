-- Hand-edited: drizzle-kit expresses neither the USING conversion nor (as of
-- 0.31) the varchar -> varchar[] type change at all, and db:push would try a
-- destructive bare cast — this file is the only correct path to the array
-- column. Statement 1 can only fail on a name collision (clean re-run);
-- statement 2 is one atomic ALTER, and its CASE is total over the domain, so
-- a partial failure leaves nothing half-converted.
ALTER TABLE "submissions" RENAME COLUMN "service" TO "services";--> statement-breakpoint
ALTER TABLE "submissions"
  ALTER COLUMN "services" TYPE varchar(80)[]
    USING CASE WHEN "services" IS NULL THEN NULL ELSE ARRAY["services"] END,
  ALTER COLUMN "message" DROP NOT NULL;
