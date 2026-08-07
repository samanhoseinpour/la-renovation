CREATE INDEX "submissions_name_trgm_idx" ON "submissions" USING gin ("name" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "submissions_email_trgm_idx" ON "submissions" USING gin ("email" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "submissions_company_trgm_idx" ON "submissions" USING gin ("company" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "submissions_message_trgm_idx" ON "submissions" USING gin ("message" gin_trgm_ops);