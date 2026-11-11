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
      className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-1.5 text-sm font-semibold transition hover:border-[#e2b65f] hover:text-[#e2b65f]"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" />
      </svg>
      {label}
    </Link>
  );
}
