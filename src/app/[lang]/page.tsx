import Link from "next/link";
import { notFound } from "next/navigation";
import BookCard from "@/components/BookCard";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { searchBooks, TOPICS, type Topic } from "@/lib/gutendex";

type Props = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ q?: string; topic?: string; bl?: string; page?: string }>;
};

const BOOK_LANGS: Record<string, string> = { all: "ar,en", ar: "ar", en: "en" };

export default async function HomePage({ params, searchParams }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);

  const sp = await searchParams;
  const q = sp.q?.trim() ?? "";
  const topic = TOPICS.includes(sp.topic as Topic) ? (sp.topic as Topic) : undefined;
  const bl = sp.bl && sp.bl in BOOK_LANGS ? sp.bl : "all";
  const page = Math.max(1, Number(sp.page) || 1);

  const data = await searchBooks({ search: q, topic, languages: BOOK_LANGS[bl], page });

  const heading = q
    ? `${t.resultsFor} "${q}"`
    : topic
      ? `${t.category}: ${t.topics[topic]}`
      : t.popular;

  const pageHref = (p: number) => {
    const qs = new URLSearchParams();
    if (q) qs.set("q", q);
    if (topic) qs.set("topic", topic);
    if (bl !== "all") qs.set("bl", bl);
    if (p > 1) qs.set("page", String(p));
    const s = qs.toString();
    return `/${lang}${s ? `?${s}` : ""}`;
  };

  const fmt = new Intl.NumberFormat(lang);

  return (
    <div className="flex flex-col gap-10">
      <section className="rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-900 px-6 py-10 text-white shadow-lg">
        <h1 className="text-3xl font-extrabold sm:text-4xl">{t.siteName}</h1>
        <p className="mt-2 text-emerald-100">{t.tagline}</p>

        <form action={`/${lang}`} className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder={t.searchPlaceholder}
            className="flex-1 rounded-lg px-4 py-3 text-stone-900 outline-none ring-emerald-300 focus:ring-4"
          />
          <select
            name="bl"
            defaultValue={bl}
            aria-label={t.bookLanguage}
            className="rounded-lg px-3 py-3 text-stone-900"
          >
            <option value="all">{t.allLanguages}</option>
            <option value="ar">{t.arabic}</option>
            <option value="en">{t.english}</option>
          </select>
          <button className="rounded-lg bg-amber-400 px-6 py-3 font-bold text-stone-900 hover:bg-amber-300">
            {t.search}
          </button>
        </form>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold">{t.categories}</h2>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map((tp) => (
            <Link
              key={tp}
              href={`/${lang}?topic=${tp}${bl !== "all" ? `&bl=${bl}` : ""}`}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                tp === topic
                  ? "bg-emerald-700 text-white"
                  : "bg-stone-200 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700"
              }`}
            >
              {t.topics[tp]}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <h2 className="text-2xl font-bold">{heading}</h2>
          {data && (
            <span className="text-sm text-stone-500">
              {fmt.format(data.count)} {t.booksCount}
            </span>
          )}
        </div>

        {!data ? (
          <p className="rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-950 dark:text-red-200">{t.loadError}</p>
        ) : data.results.length === 0 ? (
          <p className="text-stone-500">{t.noResults}</p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {data.results.map((book) => (
                <BookCard key={book.id} book={book} lang={lang} t={t} />
              ))}
            </div>

            <nav className="mt-8 flex items-center justify-center gap-4">
              {data.previous && (
                <Link href={pageHref(page - 1)} className="rounded-lg border px-4 py-2 hover:bg-stone-100 dark:hover:bg-stone-800">
                  {t.prev}
                </Link>
              )}
              <span className="text-sm text-stone-500">
                {t.page} {fmt.format(page)}
              </span>
              {data.next && (
                <Link href={pageHref(page + 1)} className="rounded-lg border px-4 py-2 hover:bg-stone-100 dark:hover:bg-stone-800">
                  {t.next}
                </Link>
              )}
            </nav>
          </>
        )}
      </section>
    </div>
  );
}
