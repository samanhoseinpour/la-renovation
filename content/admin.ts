/**
 * Every string the /admin area renders. Same contract as the public
 * content modules: components stay copy-free.
 */
export const adminNav = {
  badge: "Admin",
  groups: [
    {
      label: "Inbox",
      items: [{ label: "Submissions", href: "/admin/submissions" }],
    },
    {
      label: "Account",
      items: [{ label: "Settings", href: "/admin/settings" }],
    },
  ],
  signOut: "Sign out",
} as const;

export const adminLogin = {
  eyebrow: "Admin",
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
  eyebrow: "Admin",
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
  capNote: "Showing the newest 200 submissions. Older ones are still stored.",
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
