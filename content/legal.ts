export type LegalSection = {
  heading: string;
  paragraphs: string[];
  items?: string[];
};

export type LegalDoc = {
  slug: "privacy" | "terms" | "accessibility";
  title: string;
  /** ISO date, rendered as "Last updated". */
  updated: string;
  intro: string;
  sections: LegalSection[];
};

export const privacyPolicy: LegalDoc = {
  slug: "privacy",
  title: "Privacy policy",
  updated: "2026-08-06",
  intro:
    "This site is a brochure, not a platform. It collects almost nothing, and this page describes the little it does.",
  sections: [
    {
      heading: "What we collect",
      paragraphs: [
        "You can browse every page of this site without an account, and the site sets no cookies while you do. There are no advertising trackers and nothing that follows you to other sites; the only measurement running is the cookieless kind described below.",
        "The one place you can hand us information is the contact form, and it asks only for what a reply needs:",
      ],
      items: [
        "Your name and email address",
        "A phone number, company, project type, and project stage, all optional",
        "Your message",
      ],
    },
    {
      heading: "How it's used",
      paragraphs: [
        "We use what you send to answer your enquiry. That's the whole list. We don't sell it, rent it, add it to a marketing list, or share it beyond the delivery service that carries it to our inbox.",
        "To keep the form from being abused by scripts, submissions are rate-limited by network address. The address itself is never stored: what our database holds is a keyed one-way code derived from it, kept for about an hour while the limit applies and cleared when the next submission comes through. It is never attached to your enquiry.",
      ],
    },
    {
      heading: "Where it lives",
      paragraphs: [
        "A form submission is saved in a database we control and sent to our inbox by email through our delivery provider, Resend, with your address set as the reply-to. The stored copy exists so an enquiry is never lost if the email doesn't go through. It holds exactly what the form asked for, plus when it arrived and whether our notification email went out. No network address, no browser details. There is no automatic expiry: the record stays until someone here deletes it by hand, and we delete it outright if you ask.",
        "The site is hosted on Vercel, which keeps the standard server logs any host keeps. Pages, photographs, and fonts are all served through the site itself, so your browser makes no requests to third-party trackers or font services.",
      ],
    },
    {
      heading: "The admin sign-in",
      paragraphs: [
        "This site has a private admin area used by the people who run the company to read enquiries. Signing in there sets a cookie strictly for authentication, and it applies only to those sign-ins. Visiting the public site still sets no cookies.",
        "Sign-in attempts are rate-limited the same way the contact form is: what the database briefly holds is a keyed one-way code derived from the network address, never the address itself.",
      ],
    },
    {
      heading: "How traffic is measured",
      paragraphs: [
        "The site counts its visits with Vercel Web Analytics, the measurement built into the platform that hosts it. It runs without cookies: nothing is planted on your device, and no profile of you is built or carried between sites.",
        "What reaches us is aggregate. We can see which pages get viewed, what country visits come from, and what kind of device and browser they arrive on. None of it is tied to your name, your email, or anything you type into the contact form.",
      ],
    },
    {
      heading: "What stays on your device",
      paragraphs: [
        "If you switch between the light and dark theme, that preference is saved in your browser's local storage. It never leaves your device and we never see it. Clearing your browser data resets it.",
      ],
    },
    {
      heading: "Your choices",
      paragraphs: [
        "The form is a convenience, not a requirement. The phone number and email on our contact page reach the same people. If you'd like an enquiry you sent deleted, email us and we'll delete the stored record and our email copy.",
      ],
    },
    {
      heading: "Changes to this policy",
      paragraphs: [
        "If our practices change, this page changes with them, and the date at the top moves. We won't quietly start collecting more than this page says.",
      ],
    },
    {
      heading: "Contact",
      paragraphs: [
        "Questions about any of this, or about an enquiry you've already sent, can go to the email on our contact page.",
      ],
    },
  ],
};

export const termsOfUse: LegalDoc = {
  slug: "terms",
  title: "Terms of use",
  updated: "2026-07-28",
  intro:
    "The short version: browse freely, treat what you read as information rather than an offer, and get anything that matters in writing.",
  sections: [
    {
      heading: "Using the site",
      paragraphs: [
        "You're welcome to browse, read, and share links to anything here. Don't misuse the site: no attempts to break it, overload it, probe it for weaknesses, or use it to send anything unlawful.",
      ],
    },
    {
      heading: "Content is information, not an offer",
      paragraphs: [
        "Project descriptions and photographs on this site are illustrative. They show the kind of work we do, not a promise of what your project will look like or cost.",
        "Nothing on this site is an offer, a quote, or professional advice. Pricing, scope, and schedule exist in one place: a written contract signed by both sides. If it isn't in the contract, it isn't part of the deal.",
      ],
    },
    {
      heading: "Intellectual property",
      paragraphs: [
        "The text, design, and imagery on this site belong to Araz Construction Group or to the photographers and licensors who provided them. Link to the site freely; don't republish its content commercially without asking first.",
      ],
    },
    {
      heading: "External links",
      paragraphs: [
        "Where the site links elsewhere, to social profiles or the state license board, those sites are run by other people. We don't control them and aren't responsible for their content.",
      ],
    },
    {
      heading: "No warranty",
      paragraphs: [
        "The site is provided as it stands. We work to keep it accurate and available, but we don't promise it will be free of errors or interruptions.",
      ],
    },
    {
      heading: "Limitation of liability",
      paragraphs: [
        "To the fullest extent the law allows, Araz Construction Group isn't liable for damages arising from your use of this site. Nothing in these terms limits liability that can't lawfully be limited.",
      ],
    },
    {
      heading: "Changes",
      paragraphs: [
        "We may update these terms as the site changes; the date at the top says when we last did. Continuing to use the site means the current version applies.",
      ],
    },
    {
      heading: "Governing law",
      paragraphs: [
        "These terms are governed by the laws of the State of California.",
      ],
    },
    {
      heading: "Contact",
      paragraphs: [
        "Questions about these terms can go to the email on our contact page.",
      ],
    },
  ],
};

export const accessibilityStatement: LegalDoc = {
  slug: "accessibility",
  title: "Accessibility",
  updated: "2026-07-28",
  intro:
    "This site should work whether you navigate by mouse, keyboard, or screen reader, and without motion if you've asked your device for less of it. Here's where that stands.",
  sections: [
    {
      heading: "Our commitment",
      paragraphs: [
        "We treat accessibility as part of the build, not a finish applied at the end. The guidelines we work toward are the Web Content Accessibility Guidelines. The practical test is simpler: everyone should be able to use the site with whatever they browse with.",
      ],
    },
    {
      heading: "What's in place",
      paragraphs: ["Built into the site today:"],
      items: [
        "A skip link on every page, first in the tab order, that takes keyboard users straight to the content",
        "Full keyboard operability, including the navigation menus and the project photo viewer",
        "Reduced-motion support: when your device asks for less motion, animations, smooth scrolling, and page transitions are cut down or switched off",
        "Semantic structure for screen readers to navigate by: landmarks, one main region per page, headings in order",
        "Visible focus states on interactive elements",
        "A light and a dark theme, switchable from the header",
      ],
    },
    {
      heading: "Known limits",
      paragraphs: [
        "Some of the photography currently on the site is placeholder stock and carries short alt descriptions rather than fuller captions; that improves as real project photography lands. We also haven't yet commissioned a formal third-party audit. This page changes as both do.",
      ],
    },
    {
      heading: "Feedback",
      paragraphs: [
        "If part of this site doesn't work with your keyboard, screen reader, or other assistive tech, tell us through the email on our contact page. That kind of report gets fixed, not filed.",
      ],
    },
  ],
};
