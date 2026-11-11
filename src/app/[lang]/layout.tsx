import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { dirOf, isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import "../globals.css";

const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-cairo" });

type Props = { children: React.ReactNode; params: Promise<{ lang: string }> };

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Omit<Props, "children">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang);
  return { title: { default: t.siteName, template: `%s | ${t.siteName}` }, description: t.tagline };
}

export default async function LangLayout({ children, params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);

  return (
    <html lang={lang} dir={dirOf(lang)}>
      <body className={`${cairo.variable} flex min-h-screen flex-col antialiased`}>
        <header className="border-b border-stone-200 bg-white/80 backdrop-blur dark:border-stone-800 dark:bg-stone-950/80">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
            <Link href={`/${lang}`} className="flex items-center gap-2 text-xl font-extrabold">
              <span aria-hidden>📚</span>
              {t.siteName}
            </Link>
            <Suspense fallback={null}>
              <LanguageSwitcher lang={lang} label={t.switchLanguage} />
            </Suspense>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
        <footer className="border-t border-stone-200 py-6 text-center text-sm text-stone-500 dark:border-stone-800">
          {t.footer}
        </footer>
      </body>
    </html>
  );
}
