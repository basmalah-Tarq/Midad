"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { Locale } from "@/i18n/config";

export default function LanguageSwitcher({ lang, label }: { lang: Locale; label: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const other: Locale = lang === "ar" ? "en" : "ar";
  const rest = pathname.replace(/^\/(ar|en)(?=\/|$)/, "");
  const query = searchParams.toString();
  const href = `/${other}${rest}${query ? `?${query}` : ""}`;

  return (
    <Link
      href={href}
      hrefLang={other}
      className="rounded-full border border-stone-300 px-4 py-1.5 text-sm font-semibold hover:bg-stone-100 dark:border-stone-600 dark:hover:bg-stone-800"
    >
      {label}
    </Link>
  );
}
