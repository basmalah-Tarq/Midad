import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import {
  coverUrl,
  displayName,
  DOWNLOAD_FORMATS,
  findFormatUrl,
  getBook,
  readOnlineUrl,
} from "@/lib/gutendex";

type Props = { params: Promise<{ lang: string; id: string }> };

async function load(params: Props["params"]) {
  const { lang, id } = await params;
  if (!isLocale(lang) || !/^\d+$/.test(id)) notFound();
  const book = await getBook(Number(id));
  if (!book) notFound();
  return { lang, book, t: getDictionary(lang) };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { book } = await load(params);
  return { title: book.title };
}

export default async function BookPage({ params }: Props) {
  const { lang, book, t } = await load(params);
  const cover = coverUrl(book);
  const formats = DOWNLOAD_FORMATS.filter((f) => findFormatUrl(book, f.mime));
  const online = readOnlineUrl(book);
  const languageNames = new Intl.DisplayNames([lang], { type: "language" });
  const fmt = new Intl.NumberFormat(lang);

  return (
    <article className="flex flex-col gap-8">
      <Link href={`/${lang}`} className="text-sm font-semibold text-emerald-700 hover:underline dark:text-emerald-400">
        {lang === "ar" ? "→" : "←"} {t.back}
      </Link>

      <div className="flex flex-col gap-8 md:flex-row">
        <div className="mx-auto w-56 shrink-0 md:mx-0">
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cover} alt={book.title} className="w-full rounded-xl shadow-lg" />
          ) : (
            <div className="flex aspect-[2/3] items-center justify-center rounded-xl bg-stone-200 p-4 text-center dark:bg-stone-800">
              {book.title}
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-4">
          <h1 className="text-3xl font-extrabold leading-tight">{book.title}</h1>
          <p className="text-lg text-stone-600 dark:text-stone-400">
            {t.by}{" "}
            {book.authors.length
              ? book.authors
                  .map((a) => {
                    const years = a.birth_year ? ` (${a.birth_year}–${a.death_year ?? ""})` : "";
                    return displayName(a) + years;
                  })
                  .join("، ")
              : t.unknownAuthor}
          </p>
          <p className="text-sm text-stone-500">
            {t.languages}: {book.languages.map((l) => languageNames.of(l) ?? l).join("، ")} ·{" "}
            {fmt.format(book.download_count)} {t.downloadsCount}
          </p>

          <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950">
            <h2 className="mb-3 font-bold">{t.download}</h2>
            {formats.length ? (
              <div className="flex flex-wrap gap-3">
                {formats.map((f) => (
                  <a
                    key={f.key}
                    href={`/api/download/${book.id}?format=${f.key}`}
                    className="rounded-lg bg-emerald-700 px-5 py-2.5 font-bold text-white hover:bg-emerald-800"
                  >
                    ⬇ {t.formats[f.key]}
                  </a>
                ))}
                {online && (
                  <a
                    href={online}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-emerald-700 px-5 py-2.5 font-bold text-emerald-800 hover:bg-emerald-100 dark:text-emerald-300 dark:hover:bg-emerald-900"
                  >
                    {t.readOnline}
                  </a>
                )}
              </div>
            ) : (
              <p className="text-stone-600">{t.noFormats}</p>
            )}
          </section>

          {book.summaries?.[0] && (
            <section>
              <h2 className="mb-2 font-bold">{t.summary}</h2>
              <p dir="auto" className="leading-relaxed text-stone-700 dark:text-stone-300">
                {book.summaries[0]}
              </p>
            </section>
          )}

          {book.subjects.length > 0 && (
            <section>
              <h2 className="mb-2 font-bold">{t.subjects}</h2>
              <ul className="flex flex-wrap gap-2">
                {book.subjects.slice(0, 8).map((s) => (
                  <li key={s} dir="auto" className="rounded-full bg-stone-200 px-3 py-1 text-xs dark:bg-stone-800">
                    {s}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </article>
  );
}
