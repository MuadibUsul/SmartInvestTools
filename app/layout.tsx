import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";

import { getAbsoluteUrl, siteName, siteUrl } from "@/lib/site";
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
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description:
    "Practical investing calculators for growth, income, portfolio planning, debt, retirement, and financial independence.",
  alternates: {
    canonical: getAbsoluteUrl("/"),
  },
  openGraph: {
    title: siteName,
    description:
      "Practical investing calculators for growth, income, portfolio planning, debt, retirement, and financial independence.",
    type: "website",
    url: getAbsoluteUrl("/"),
    siteName,
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description:
      "Practical investing calculators for growth, income, portfolio planning, debt, retirement, and financial independence.",
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
        {children}
      </body>
    </html>
  );
}
