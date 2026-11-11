"use client";

import { useSearchParams } from "next/navigation";
import type { Dictionary } from "@/i18n/dictionaries";
import { homeHref } from "@/lib/links";

/** Hero search box. Submits as a normal GET form; the results section reads the query string. */
export default function SearchForm({ lang, t }: { lang: string; t: Dictionary }) {
  const sp = useSearchParams();
  const q = sp.get("q") ?? "";
  const bl = sp.get("bl") ?? "all";

  return (
    <form
      // Remount when the URL changes so defaultValue reflects the current search.
      key={`${q}|${bl}`}
      action={`${homeHref(lang)}#results`}
      className="mt-8 flex flex-col gap-2 rounded-2xl bg-white p-2 shadow-2xl shadow-black/30 sm:flex-row sm:items-center"
    >
      <div className="flex flex-1 items-center gap-2 px-3">
        <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-stone-400" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder={t.searchPlaceholder}
          className="w-full bg-transparent py-3 text-stone-900 outline-none placeholder:text-stone-400"
        />
      </div>
      <select
        name="bl"
        defaultValue={bl}
        aria-label={t.bookLanguage}
        className="rounded-xl bg-stone-100 px-3 py-3 text-sm font-medium text-stone-700 outline-none"
      >
        <option value="all">{t.allLanguages}</option>
        <option value="ar">{t.arabic}</option>
        <option value="en">{t.english}</option>
      </select>
      <button className="rounded-xl bg-gradient-to-b from-[#ecc677] to-[#c8913a] px-7 py-3 font-bold text-[#1f1b16] shadow-md transition hover:brightness-110">
        {t.search}
      </button>
    </form>
  );
}
