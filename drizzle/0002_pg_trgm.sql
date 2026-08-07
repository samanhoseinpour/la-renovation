-- Trigram support for the inbox's ILIKE '%…%' search. Runs before 0003's
-- gin_trgm_ops indexes; db:push never applies custom migrations, so a
-- push-only scratch branch needs this once by hand.
CREATE EXTENSION IF NOT EXISTS pg_trgm;
