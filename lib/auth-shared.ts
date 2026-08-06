/**
 * Shared between lib/auth.ts (server config) and the admin password forms
 * plus strength meter (client). content/admin.ts spells the same number out
 * in prose ("twelve characters") — keep the two in sync by hand.
 */
export const MIN_PASSWORD_LENGTH = 12;
