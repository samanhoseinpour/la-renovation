/**
 * Shared between lib/auth.ts (server config) and the admin password forms
 * plus strength meter (client). content/admin.ts spells the same number out
 * in prose ("twelve characters") — keep the two in sync by hand.
 */
export const MIN_PASSWORD_LENGTH = 12;

/**
 * Display-name cap shared by the user.update.before guard in lib/auth.ts and
 * the settings name form's maxLength. content/admin.ts spells it out in prose
 * ("eighty characters") — same hand-sync contract as above.
 */
export const NAME_MAX_LENGTH = 80;
