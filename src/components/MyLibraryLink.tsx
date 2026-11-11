"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLibrary } from "@/lib/userLibrary";

export default function MyLibraryLink({ lang, label }: { lang: string; label: string }) {
  const { books } = useLibrary();
  const count = Object.values(books).filter((b) => b.likedAt || b.status).length;
  const active = usePathname() === `/${lang}/me`;

  return (
    <Link
      href={`/${lang}/me`}
      className={`relative flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold transition sm:px-4 ${
        active
          ? "border-[#e2b65f] bg-[#e2b65f] text-[#1f1b16]"
          : "border-white/20 hover:border-[#e2b65f] hover:text-[#e2b65f]"
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M5 4h4v16H5zM10 4h4v16h-4zM15.5 4.5l3.8-1 3.7 15.5-3.8 1z" />
      </svg>
      <span className="hidden sm:inline">{label}</span>
      {count > 0 && (
        <span className="absolute -end-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[11px] font-bold text-white ring-2 ring-[#123a31]">
          {count}
        </span>
      )}
    </Link>
  );
}
