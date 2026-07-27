import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";

import { MotionProvider } from "@/components/motion/motion-provider";
import { ThemeProvider } from "@/components/site/theme-provider";
import { site } from "@/lib/site";

import "./globals.css";

// Variable font (wght 100-900): no `weight` needed, and no italic style is
// loaded on purpose — globals.css blocks font-synthesis.
const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-archivo",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} · ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    url: site.url,
    title: `${site.name} · ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} · ${site.tagline}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

// themeColor belongs on the viewport export; it has been deprecated inside
// `metadata` since Next.js 14. A single value, not a prefers-color-scheme
// pair: the site defaults to light regardless of OS setting, so OS-dark
// visitors must not get dark browser chrome over a light-first paper chrome.
export const viewport: Viewport = {
  themeColor: "#F3F3F1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // next-themes writes the class onto <html> before React hydrates.
      suppressHydrationWarning
      // Next.js 16 no longer overrides scroll-behavior on navigation; without
      // this attribute anchor links jump instead of scrolling.
      data-scroll-behavior="smooth"
      className={`${archivo.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {/* Reveal wrappers server-render hidden; without JS they must not
            stay that way. A stylesheet !important beats motion's inline
            styles. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important;translate:none!important}`}</style>
        </noscript>
        {/* defaultTheme="light" with no enableSystem: light is the default
            for everyone; the header toggle writes explicit light/dark. */}
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          <MotionProvider>{children}</MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
