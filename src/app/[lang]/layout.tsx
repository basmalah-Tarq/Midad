import type { Metadata } from "next";
import { El_Messiri, IBM_Plex_Sans_Arabic } from "next/font/google";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Logo from "@/components/Logo";
import MyLibraryLink from "@/components/MyLibraryLink";
import ThemeToggle from "@/components/ThemeToggle";
import Toaster from "@/components/Toaster";
import { themeInitScript } from "@/lib/theme";
import { dirOf, isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import "../globals.css";

const display = El_Messiri({ subsets: ["arabic", "latin"], variable: "--font-display" });
const body = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

type Props = { children: React.ReactNode; params: Promise<{ lang: string }> };

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Omit<Props, "children">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang);
  return {
    title: { default: `${t.siteName} | ${t.siteSubtitle}`, template: `%s | ${t.siteName}` },
    description: t.tagline,
  };
}

export default async function LangLayout({ children, params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);

  return (
    <html lang={lang} dir={dirOf(lang)} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`${display.variable} ${body.variable} flex min-h-screen flex-col antialiased`}>
        <header className="sticky top-0 z-30 border-b border-white/10 bg-forest/85 text-[#f1ebe0] backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
            <Link href={`/${lang}`} className="group flex items-center gap-3">
              <Logo className="h-10 w-10 transition duration-500 group-hover:rotate-[-6deg] group-hover:scale-105" />
              <span className="flex flex-col leading-none">
                <span className="font-display text-2xl font-bold">{t.siteName}</span>
                <span className="mt-1 text-[11px] font-medium tracking-wide text-[#f1ebe0]/55">{t.siteSubtitle}</span>
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <MyLibraryLink lang={lang} label={t.myLibrary} />
              <ThemeToggle label={t.toggleTheme} />
              <Suspense fallback={null}>
                <LanguageSwitcher lang={lang} label={t.switchLanguage} />
              </Suspense>
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="mt-16 border-t border-line">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-10 text-center">
            <div className="flex items-center gap-2.5">
              <Logo className="h-9 w-9" />
              <span className="flex flex-col items-start leading-none">
                <span className="font-display text-xl font-bold">{t.siteName}</span>
                <span className="mt-1 text-[11px] text-muted">{t.siteSubtitle}</span>
              </span>
            </div>
            <p className="max-w-xl text-sm text-muted">{t.footer}</p>
          </div>
        </footer>
        <Toaster />
      </body>
    </html>
  );
}
