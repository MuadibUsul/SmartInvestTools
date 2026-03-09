import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const bodyFont = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const displayFont = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Smart Invest Tools | Free Investing Calculators and Portfolio Tools",
    template: "%s | Smart Invest Tools",
  },
  description:
    "Smart Invest Tools offers modern calculators for compound growth, dividends, ETF overlap, portfolio allocation, and retirement planning.",
  openGraph: {
    title: "Smart Invest Tools",
    description:
      "Free investing calculators and portfolio tools with a scalable architecture.",
    type: "website",
    url: siteUrl,
    siteName: "Smart Invest Tools",
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart Invest Tools",
    description:
      "Free investing calculators and portfolio tools with a scalable architecture.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {
              const stored = localStorage.getItem("smart-invest-tools-theme");
              const theme = stored || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
              document.documentElement.dataset.theme = theme;
            })();`,
          }}
        />
      </head>
      <body
        className={`${bodyFont.variable} ${displayFont.variable} min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] antialiased`}
      >
        <div className="relative min-h-screen overflow-x-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[26rem] bg-[radial-gradient(circle_at_top,rgba(13,148,136,0.16),transparent_42%),radial-gradient(circle_at_top_right,rgba(245,158,11,0.12),transparent_28%)]" />
          <Header />
          <main className="relative mx-auto w-full max-w-7xl px-4 pb-10 pt-6 sm:px-6 lg:px-8">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
