"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import {
  searchArabicBooks,
  searchGutenbergBooks,
  TOPICS,
  type BookPage,
  type LibraryBook,
  type Topic,
} from "@/lib/library";
import { homeHref } from "@/lib/links";
import BookCard from "./BookCard";

const BOOK_LANGS = ["all", "ar", "en"] as const;
type BookLang = (typeof BOOK_LANGS)[number];

const TOPIC_STYLE: Record<Topic, { icon: string; bg: string }> = {
  fiction: { icon: "📖", bg: "from-rose-500/15 to-rose-500/5" },
  history: { icon: "🏛️", bg: "from-amber-500/20 to-amber-500/5" },
  science: { icon: "🔭", bg: "from-sky-500/15 to-sky-500/5" },
  children: { icon: "🧸", bg: "from-pink-400/20 to-pink-400/5" },
  poetry: { icon: "🪶", bg: "from-violet-500/15 to-violet-500/5" },
  philosophy: { icon: "🦉", bg: "from-stone-500/20 to-stone-500/5" },
  adventure: { icon: "🧭", bg: "from-emerald-500/15 to-emerald-500/5" },
  religion: { icon: "🕊️", bg: "from-teal-500/15 to-teal-500/5" },
};

function BookGrid({ books, lang, t }: { books: LibraryBook[]; lang: Locale; t: Dictionary }) {
  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {books.map((book) => (
        <BookCard key={book.id} book={book} lang={lang} t={t} />
      ))}
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6" aria-busy="true">
      {Array.from({ length: 12 }, (_, i) => (
        <div key={i} className="flex flex-col gap-3">
          <div className="aspect-[2/3] animate-pulse rounded-md bg-line" />
          <div className="h-4 w-4/5 animate-pulse rounded bg-line" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-line" />
        </div>
      ))}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="py-16 text-center text-muted">
      <div className="mb-3 text-5xl">📭</div>
      {text}
    </div>
  );
}

function SectionHeader({ title, hint, badge, action }: { title: string; hint?: string; badge?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-line pb-4">
      <div>
        <h2 className="font-display text-2xl font-bold sm:text-3xl">{title}</h2>
        {hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
      </div>
      <div className="flex items-center gap-3">
        {badge && <span className="shrink-0 rounded-full bg-gold-soft px-3 py-1 text-sm font-semibold text-gold">{badge}</span>}
        {action}
      </div>
    </div>
  );
}

type WorldState = { key: string; data: BookPage | null } | null;

/** Categories + results. Runs in the browser and reads the search from the URL. */
export default function Browse({ lang, t }: { lang: Locale; t: Dictionary }) {
  const sp = useSearchParams();
  const q = sp.get("q")?.trim() ?? "";
  const topicParam = sp.get("topic") ?? "";
  const topic = TOPICS.includes(topicParam as Topic) ? (topicParam as Topic) : undefined;
  const blParam = sp.get("bl") ?? "";
  const bl: BookLang = BOOK_LANGS.includes(blParam as BookLang) ? (blParam as BookLang) : "all";
  const page = Math.max(1, Number(sp.get("page")) || 1);
  const isDefaultView = !q && !topic && bl === "all" && page === 1;

  const arabic = bl === "en" || page > 1 ? [] : searchArabicBooks({ search: q, topic });

  // Gutenberg results, keyed by the query so stale results never show for a new search.
  const worldKey = bl === "ar" ? "" : JSON.stringify([q, topic, page]);
  const [world, setWorld] = useState<WorldState>(null);
  useEffect(() => {
    if (!worldKey) return;
    let cancelled = false;
    searchGutenbergBooks({ search: q, topic, languages: "en", page }).then((data) => {
      if (!cancelled) setWorld({ key: worldKey, data });
    });
    return () => {
      cancelled = true;
    };
    // q/topic/page are all encoded in worldKey.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [worldKey]);
  const worldReady = world?.key === worldKey;
  const worldData = worldReady ? world.data : null;

  const fmt = new Intl.NumberFormat(lang);
  const filterLabel = q ? `«${q}»` : topic ? t.topics[topic] : "";

  const hrefWith = (o: { topic?: Topic | null; page?: number; bl?: BookLang }) => {
    const qs = new URLSearchParams();
    if (q) qs.set("q", q);
    const tp = o.topic === undefined ? topic : o.topic;
    if (tp) qs.set("topic", tp);
    const l = o.bl ?? bl;
    if (l !== "all") qs.set("bl", l);
    if (o.page && o.page > 1) qs.set("page", String(o.page));
    const s = qs.toString();
    return `${homeHref(lang)}${s ? `?${s}` : ""}#results`;
  };

  const arabicTitle = filterLabel ? `${t.arabicShelf} · ${filterLabel}` : t.arabicShelf;
  const worldTitle = q ? `${t.resultsFor} ${filterLabel}` : topic ? t.topics[topic] : t.popular;
  const arabicPreview = bl === "all" ? arabic.slice(0, 6) : arabic;

  return (
    <div className="mx-auto max-w-6xl px-4">
      {/* ───────── Categories ───────── */}
      <section className="py-12">
        <h2 className="font-display mb-5 text-2xl font-bold">{t.categories}</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {TOPICS.map((tp) => {
            const active = tp === topic;
            return (
              <Link
                key={tp}
                href={hrefWith({ topic: active ? null : tp, page: 1 })}
                className={`group flex items-center gap-3 rounded-2xl border bg-gradient-to-br p-4 transition hover:-translate-y-0.5 hover:shadow-lg ${TOPIC_STYLE[tp].bg} ${
                  active ? "border-gold ring-2 ring-gold/40" : "border-line"
                }`}
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-card text-2xl shadow-sm transition group-hover:scale-110">
                  {TOPIC_STYLE[tp].icon}
                </span>
                <span className="font-semibold">{t.topics[tp]}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <div id="results" className="flex scroll-mt-20 flex-col gap-16">
        {/* ───────── Arabic classics ───────── */}
        {bl !== "en" && page === 1 && (bl === "ar" || arabic.length > 0) && (
          <section>
            <SectionHeader
              title={arabicTitle}
              hint={t.arabicShelfHint}
              badge={`${fmt.format(arabic.length)} ${t.booksCount}`}
              action={
                bl === "all" && arabic.length > arabicPreview.length ? (
                  <Link href={hrefWith({ bl: "ar", page: 1 })} className="font-semibold text-gold hover:underline">
                    {t.seeAll} {lang === "ar" ? "←" : "→"}
                  </Link>
                ) : undefined
              }
            />
            {arabic.length ? <BookGrid books={arabicPreview} lang={lang} t={t} /> : <Empty text={t.noResults} />}
          </section>
        )}

        {/* ───────── World classics (Gutenberg) ───────── */}
        {bl !== "ar" && (
          <section>
            <SectionHeader
              title={bl === "all" && isDefaultView ? `${t.englishShelf} · ${t.popular}` : worldTitle}
              badge={worldData ? `${fmt.format(worldData.count)} ${t.booksCount}` : undefined}
            />

            {!worldReady ? (
              <GridSkeleton />
            ) : !worldData ? (
              <p className="rounded-xl border border-red-300 bg-red-50 p-4 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
                {t.loadError}
              </p>
            ) : worldData.results.length === 0 ? (
              <Empty text={t.noResults} />
            ) : (
              <>
                <BookGrid books={worldData.results} lang={lang} t={t} />
                <nav className="mt-12 flex items-center justify-center gap-3">
                  {worldData.hasPrev && (
                    <Link href={hrefWith({ page: page - 1 })} className="rounded-full border border-line bg-card px-5 py-2 font-semibold transition hover:border-gold hover:text-gold">
                      {t.prev}
                    </Link>
                  )}
                  <span className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper">
                    {t.page} {fmt.format(page)}
                  </span>
                  {worldData.hasNext && (
                    <Link href={hrefWith({ page: page + 1 })} className="rounded-full border border-line bg-card px-5 py-2 font-semibold transition hover:border-gold hover:text-gold">
                      {t.next}
                    </Link>
                  )}
                </nav>
              </>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
