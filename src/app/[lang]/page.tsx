import Link from "next/link";
import { notFound } from "next/navigation";
import BookCard from "@/components/BookCard";
import BookCover from "@/components/BookCover";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary, type Dictionary } from "@/i18n/dictionaries";
import {
  ARABIC_COUNT,
  searchArabicBooks,
  searchGutenbergBooks,
  TOPICS,
  type LibraryBook,
  type Topic,
} from "@/lib/library";

// Search, filters and paging come from the query string, so render per request.
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ q?: string; topic?: string; bl?: string; page?: string }>;
};

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

// Positions for the fanned stack of covers in the hero.
const FAN = [
  { pos: "start-[6%] top-[18%] w-[30%]", r: "-12deg", z: "z-10", delay: "0s" },
  { pos: "end-[6%] top-[18%] w-[30%]", r: "12deg", z: "z-10", delay: "1.2s" },
  { pos: "start-[19%] top-[8%] w-[34%]", r: "-5deg", z: "z-20", delay: "0.6s" },
  { pos: "end-[19%] top-[8%] w-[34%]", r: "5deg", z: "z-20", delay: "1.8s" },
  { pos: "start-1/2 -translate-x-1/2 rtl:translate-x-1/2 top-0 w-[40%]", r: "0deg", z: "z-30", delay: "0.3s" },
];

function BookGrid({ books, lang, t }: { books: LibraryBook[]; lang: Locale; t: Dictionary }) {
  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {books.map((book) => (
        <BookCard key={book.id} book={book} lang={lang} t={t} />
      ))}
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
        {badge && (
          <span className="shrink-0 rounded-full bg-gold-soft px-3 py-1 text-sm font-semibold text-gold">{badge}</span>
        )}
        {action}
      </div>
    </div>
  );
}

export default async function HomePage({ params, searchParams }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);

  const sp = await searchParams;
  const q = sp.q?.trim() ?? "";
  const topic = TOPICS.includes(sp.topic as Topic) ? (sp.topic as Topic) : undefined;
  const bl: BookLang = BOOK_LANGS.includes(sp.bl as BookLang) ? (sp.bl as BookLang) : "all";
  const page = Math.max(1, Number(sp.page) || 1);
  const isDefaultView = !q && !topic && bl === "all" && page === 1;

  const arabic = bl === "en" || page > 1 ? [] : searchArabicBooks({ search: q, topic });
  const [world, popular] = await Promise.all([
    bl === "ar" ? null : searchGutenbergBooks({ search: q, topic, languages: "en", page }),
    isDefaultView ? null : searchGutenbergBooks({ languages: "en" }),
  ]);
  const heroSource = isDefaultView ? world : popular;
  const heroBooks = heroSource?.results.filter((b) => b.cover).slice(0, 5) ?? [];
  const totalBooks = (heroSource?.count ?? 0) + ARABIC_COUNT;

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
    return `/${lang}${s ? `?${s}` : ""}#results`;
  };

  const arabicTitle = filterLabel ? `${t.arabicShelf} · ${filterLabel}` : t.arabicShelf;
  const worldTitle = q ? `${t.resultsFor} ${filterLabel}` : topic ? t.topics[topic] : t.popular;
  // In the mixed view, keep the Arabic shelf short and link to the full list.
  const arabicPreview = bl === "all" ? arabic.slice(0, 6) : arabic;

  return (
    <>
      {/* ───────── Hero ───────── */}
      <section className="pattern relative overflow-hidden bg-forest text-[#f1ebe0]">
        <div className="pointer-events-none absolute -top-40 start-1/3 h-[28rem] w-[28rem] rounded-full bg-[#e2b65f]/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-[1.15fr_1fr] md:py-20">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#e2b65f]/40 bg-[#e2b65f]/10 px-3 py-1 text-xs font-semibold text-[#e2b65f]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#e2b65f]" />
              {t.heroBadge}
            </span>
            <h1 className="font-display mt-5 text-4xl font-bold leading-[1.15] sm:text-6xl">
              {t.heroTitle1}
              <br />
              <span className="bg-gradient-to-l from-[#f5d48b] to-[#c8913a] bg-clip-text text-transparent">
                {t.heroTitle2}
              </span>
            </h1>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-[#f1ebe0]/75">{t.heroSubtitle}</p>

            <form
              action={`/${lang}#results`}
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

            <dl className="mt-8 flex gap-8">
              {[
                [`+${fmt.format(Math.floor(totalBooks / 1000) * 1000)}`, t.statBooks],
                [fmt.format(4), t.statFormats],
                [`${fmt.format(100)}%`, t.statFree],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="font-display text-2xl font-bold text-[#e2b65f]">{value}</dt>
                  <dd className="text-sm text-[#f1ebe0]/60">{label}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* fanned covers */}
          <div className="relative mx-auto hidden aspect-[5/4] w-full max-w-md md:block">
            {heroBooks.map((book, i) => (
              <Link
                key={book.id}
                href={`/${lang}/book/${book.id}`}
                className={`absolute ${FAN[i].pos} ${FAN[i].z} transition hover:z-40`}
              >
                <div
                  className="animate-float"
                  style={{ "--r": FAN[i].r, animationDelay: FAN[i].delay } as React.CSSProperties}
                >
                  <BookCover book={book} eager className="shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] ring-1 ring-white/10" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

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
              {arabic.length ? (
                <BookGrid books={arabicPreview} lang={lang} t={t} />
              ) : (
                <div className="py-16 text-center text-muted">
                  <div className="mb-3 text-5xl">📭</div>
                  {t.noResults}
                </div>
              )}
            </section>
          )}

          {/* ───────── World classics (Gutenberg) ───────── */}
          {bl !== "ar" && (
            <section>
              <SectionHeader
                title={bl === "all" && isDefaultView ? `${t.englishShelf} · ${t.popular}` : worldTitle}
                badge={world ? `${fmt.format(world.count)} ${t.booksCount}` : undefined}
              />

              {!world ? (
                <p className="rounded-xl border border-red-300 bg-red-50 p-4 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
                  {t.loadError}
                </p>
              ) : world.results.length === 0 ? (
                <div className="py-16 text-center text-muted">
                  <div className="mb-3 text-5xl">📭</div>
                  {t.noResults}
                </div>
              ) : (
                <>
                  <BookGrid books={world.results} lang={lang} t={t} />
                  <nav className="mt-12 flex items-center justify-center gap-3">
                    {world.hasPrev && (
                      <Link href={hrefWith({ page: page - 1 })} className="rounded-full border border-line bg-card px-5 py-2 font-semibold transition hover:border-gold hover:text-gold">
                        {t.prev}
                      </Link>
                    )}
                    <span className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper">
                      {t.page} {fmt.format(page)}
                    </span>
                    {world.hasNext && (
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
    </>
  );
}
