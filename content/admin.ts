/**
 * Every string the /admin area renders. Same contract as the public
 * content modules: components stay copy-free.
 */
export const adminNav = {
  badge: "Admin",
  groups: [
    {
      label: "Inbox",
      items: [
        { label: "Overview", href: "/admin" },
        { label: "Submissions", href: "/admin/submissions" },
      ],
    },
    {
      label: "Account",
      items: [{ label: "Settings", href: "/admin/settings" }],
    },
  ],
  signOut: "Sign out",
} as const;

/** The auth shell's brand panel and phone band. */
export const adminAuthPanel = {
  eyebrow: "Admin",
} as const;

export const adminLogin = {
  title: "Sign in",
  lead: "The private area for the people who run Araz Construction Group.",
  emailLabel: "Email",
  passwordLabel: "Password",
  submit: "Sign in",
  submitting: "Signing in…",
  or: "or",
  passkey: "Sign in with a passkey",
  forgot: "Forgot your password?",
  error: "That email or password is incorrect.",
  passkeyError: "That passkey didn't work. Try again or use your password.",
} as const;

export const adminReset = {
  setTitle: "Set your password",
  setLead:
    "Choose at least twelve characters. A password manager's suggestion is ideal.",
  passwordLabel: "New password",
  submit: "Save password",
  submitting: "Saving…",
  saved: "Password saved. You can sign in now.",
  savedCta: "Go to sign in",
  invalid: "That link has expired or was already used.",
  invalidCta: "Request a fresh link",
  samePassword: "That is already the current password. Choose a new one.",
  requestTitle: "Reset your password",
  requestLead: "Enter your email and we'll send a link if the account exists.",
  emailLabel: "Email",
  requestSubmit: "Send reset link",
  requestSubmitting: "Sending…",
  requestSent: "If that account exists, an email is on its way.",
  requestError: "That didn't work. Try again.",
  backToLogin: "Back to sign in",
} as const;

export const adminInbox = {
  title: "Submissions",
  filters: { all: "All", new: "New", read: "Read", archived: "Archived" },
  empty: {
    all: {
      title: "No enquiries yet.",
      body: "New submissions from the contact form will land here.",
    },
    filtered: {
      title: "Nothing here.",
      body: "No submissions match this filter right now.",
    },
  },
  delivery: {
    pending: "Email pending",
    sent: "Emailed",
    failed: "Email failed",
  },
  search: {
    placeholder: "Search name, email, company, or message",
    submit: "Search",
    clear: "Clear search",
  },
  pagination: {
    older: "Load older",
    newest: "Back to newest",
  },
  selection: {
    selectAll: "Select all shown",
    selectRow: "Select",
    selectedSuffix: "selected",
    clear: "Clear",
    markRead: "Mark read",
    markUnread: "Mark unread",
    archive: "Archive",
    unarchive: "Move to inbox",
    del: "Delete",
    exportSelected: "Export selected",
    error: "That didn't work. Try again.",
  },
  bulkDeleteConfirm: {
    title: "Delete the selected submissions?",
    body: "This removes them outright. There is no undo.",
    confirm: "Delete",
    cancel: "Cancel",
  },
  exportCsv: {
    button: "Export CSV",
    rangeLabel: "Date range",
    ranges: {
      today: "Today",
      "7d": "Last 7 days",
      "30d": "Last 30 days",
      month: "This month",
      all: "All time",
    },
  },
} as const;

export const adminSubmission = {
  fields: {
    name: "Name",
    email: "Email",
    phone: "Phone",
    company: "Company",
    service: "Project type",
    stage: "Project stage",
    message: "Message",
    received: "Received",
    delivery: "Notification email",
  },
  actions: {
    reply: "Reply by email",
    markRead: "Mark as read",
    markUnread: "Mark as unread",
    archive: "Archive",
    unarchive: "Move to inbox",
    del: "Delete",
    resend: "Send the email again",
    resending: "Sending…",
    back: "Back to submissions",
    menu: "Actions",
    error: "That didn't work. Try again.",
  },
  deleteConfirm: {
    title: "Delete this submission?",
    body: "This removes the enquiry outright. There is no undo.",
    confirm: "Delete submission",
    cancel: "Cancel",
  },
  replySubject: "Re: your enquiry to Araz Construction Group",
} as const;

export const adminSettings = {
  title: "Settings",
  profile: {
    title: "Profile",
    lead: "How your name appears across the admin area.",
    nameLabel: "Display name",
    submit: "Save name",
    submitting: "Saving…",
    success: "Name updated.",
    error: "That didn't work. Try again.",
    errorInvalid: "Enter a name of no more than eighty characters.",
  },
  password: {
    title: "Change password",
    currentLabel: "Current password",
    newLabel: "New password",
    submit: "Update password",
    submitting: "Updating…",
    success: "Password updated. Other sessions were signed out.",
    error: "That didn't work. Try again.",
    errorCurrent: "The current password is incorrect.",
    errorSame:
      "The new password matches the current one. Choose a different password.",
  },
  passkeys: {
    title: "Passkeys",
    lead: "A passkey signs you in with your fingerprint, face, or device PIN. Add one on each device you use.",
    nudge: "No passkeys yet. Add one to skip the password next time.",
    add: "Add a passkey",
    adding: "Waiting for your device…",
    nameLabel: "Passkey name",
    namePrompt: "Something like Reza's MacBook or Dylan's iPhone.",
    rename: "Rename",
    remove: "Remove",
    unnamed: "Passkey",
    error: "That didn't work. Try again.",
    loadError: "Couldn't load passkeys. Reload the page to retry.",
  },
  sessions: {
    title: "Active sessions",
    lead: "Everywhere this account is signed in. Sessions keep no device details by design, so go by the times.",
    current: "This device",
    signedIn: "Signed in",
    lastActive: "Last active",
    revoke: "Sign out",
    revoking: "Signing out…",
    revokeOthers: "Sign out everywhere else",
    revokingOthers: "Signing out…",
    error: "That didn't work. Try again.",
    loadError: "Couldn't load sessions. Reload the page to retry.",
  },
} as const;

export const adminDates = {
  justNow: "just now",
} as const;

export const adminError = {
  title: "Something went sideways.",
  body: "The error is logged. Try again, and if it keeps happening tell whoever maintains the site.",
  retry: "Try again",
} as const;

export const adminPasswordField = {
  show: "Show password",
} as const;

export const adminStrength = {
  label: "Password strength",
  weak: "Weak",
  fair: "Fair",
  good: "Good",
  strong: "Strong",
} as const;

export type AdminAvatarEntry =
  | { kind: "photo"; src: string; alt: string }
  | { kind: "mask"; src: string; alt: string };

/**
 * Identity marks for the admin accounts. An explicit map because the seeded
 * names don't align with the team roster ("Reza" vs "G. Reza Ghasemi").
 * Lowercase keys; AdminAvatar lowercases its lookups. Mask entries are black
 * plus alpha, painted with the foreground token like the partner strip.
 */
export const adminAvatars: Record<string, AdminAvatarEntry> = {
  "reza@arazconstructiongroup.com": {
    kind: "photo",
    src: "/images/team/reza-ghasemi.avif",
    alt: "G. Reza Ghasemi",
  },
  "dylan@arazconstructiongroup.com": {
    kind: "photo",
    src: "/images/team/dylan-hughes.avif",
    alt: "Dylan Hughes",
  },
  "teamperseustudio@gmail.com": {
    kind: "mask",
    src: "/images/admin/perseus-logo.avif",
    alt: "Perseus Studio",
  },
};

export const adminNotFound = {
  title: "That page isn't here.",
  body: "The submission may have been deleted, or the link is wrong.",
  cta: "Back to submissions",
} as const;

export const adminOverview = {
  title: "Overview",
  tiles: {
    newCount: "New enquiries",
    week: "Last 7 days",
    failed: "Failed emails",
  },
  latest: {
    title: "Latest submissions",
    viewAll: "Open the inbox",
    empty: "New submissions from the contact form will land here.",
  },
  team: {
    title: "Team",
    lastSeen: "Last signed in",
    never: "No recent sign-ins",
  },
} as const;

export const adminExport = {
  // CSV column headers, mirroring adminSubmission.fields where one exists.
  columns: {
    id: "ID",
    received: "Received",
    name: "Name",
    email: "Email",
    phone: "Phone",
    company: "Company",
    service: "Project type",
    stage: "Project stage",
    message: "Message",
    status: "Status",
    delivery: "Notification email",
    deliveryError: "Delivery error",
    deliveredAt: "Delivered",
    updated: "Updated",
  },
} as const;
