import type { Metadata } from "next";
import localFont from "next/font/local";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

import "./globals.css";
import { auth } from "@/auth";
import JsonLd from "@/components/seo/JsonLd";
import { Toaster } from "@/components/ui/toaster";
import ThemeProvider from "@/context/Theme";
import { SITE_URL, WEBSITE_SCHEMA } from "@/lib/seo";

const inter = localFont({
  src: "./fonts/InterVF.ttf",
  variable: "--font-inter",
  weight: "100 200 300 400 500 700 800 900",
});

const spaceGrotesk = localFont({
  src: "./fonts/SpaceGroteskVF.ttf",
  variable: "--font-space-grotesk",
  weight: "300 400 500 700",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "VishalDevFlow",
    template: "%s | VishalDevFlow",
  },
  description:
    "VishalDevFlow is a developer community platform for asking questions, sharing expertise, and discovering answers from other developers.",
  applicationName: "VishalDevFlow",
  keywords: [
    "developer community",
    "programming Q&A",
    "Stack Overflow clone",
    "Next.js app",
    "developer forum",
  ],
  openGraph: {
    title: "VishalDevFlow",
    description:
      "Ask questions, share knowledge, and grow with a modern developer community.",
    url: SITE_URL,
    siteName: "VishalDevFlow",
    locale: "en_US",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "VishalDevFlow",
    description:
      "Ask questions, share knowledge, and grow with a modern developer community.",
    images: ["/twitter-image"],
  },
  icons: {
    icon: "/images/site-logo.svg",
  },
};

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
        />
      </head>
      <body className={`${inter.className} ${spaceGrotesk.variable} antialiased`}>
        <JsonLd data={WEBSITE_SCHEMA} />
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
};

export default RootLayout;
