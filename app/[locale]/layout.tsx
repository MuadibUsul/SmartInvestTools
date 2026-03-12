import { notFound } from "next/navigation";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { LocaleDocument } from "@/components/layout/LocaleDocument";
import { isLocale, locales, type Locale } from "@/lib/i18n";

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <>
      <LocaleDocument locale={locale as Locale} />
      <div className="relative min-h-screen overflow-x-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[26rem] bg-[radial-gradient(circle_at_top,rgba(13,148,136,0.16),transparent_42%),radial-gradient(circle_at_top_right,rgba(245,158,11,0.12),transparent_28%)]" />
        <Header locale={locale as Locale} />
        <main className="relative mx-auto w-full max-w-7xl px-4 pb-10 pt-6 sm:px-6 lg:px-8">
          {children}
        </main>
        <Footer locale={locale as Locale} />
      </div>
    </>
  );
}
