import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BookActions, { DownloadLink } from "@/components/BookActions";
import BookCover from "@/components/BookCover";
import { isLocale } from "@/i18n/config";
import { getDictionary, likeLabels } from "@/i18n/dictionaries";
import { DOWNLOAD_FORMATS, getLibraryBook } from "@/lib/library";

type Props = { params: Promise<{ lang: string; id: string }> };

const FORMAT_ICON: Record<string, string> = { epub: "📱", kindle: "📘", pdf: "🖨️", txt: "📄" };

async function load(params: Props["params"]) {
  const { lang, id } = await params;
  if (!isLocale(lang)) notFound();
  const book = await getLibraryBook(decodeURIComponent(id));
  if (!book) notFound();
  return { lang, book, t: getDictionary(lang) };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { book } = await load(params);
  return { title: book.title };
}

export default async function BookPage({ params }: Props) {
  const { lang, book, t } = await load(params);
  const formats = DOWNLOAD_FORMATS.filter((f) => book.files[f.key]);
  const languageNames = new Intl.DisplayNames([lang], { type: "language" });
  const fmt = new Intl.NumberFormat(lang);
  const sep = lang === "ar" ? "، " : ", ";

  const authors = book.authors.length
    ? book.authors.map((a) => a.name + (a.years ? ` (${a.years})` : "")).join(sep)
    : t.unknownAuthor;
  const snapshot = {
    id: book.id,
    title: book.title,
    author: book.authors.map((a) => a.name).join(sep) || undefined,
    cover: book.cover,
  };

  return (
    <article>
      {/* ───────── Banner ───────── */}
      <section className="pattern relative overflow-hidden bg-forest text-[#f1ebe0]">
        {book.cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={book.cover}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full scale-125 object-cover opacity-25 blur-2xl"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-forest/40 to-forest" />

        <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-8">
          <Link href={`/${lang}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#e2b65f] hover:underline">
            <span aria-hidden>{lang === "ar" ? "→" : "←"}</span> {t.back}
          </Link>

          <div className="mt-8 flex flex-col items-center gap-10 md:flex-row md:items-end">
            <div className="w-52 shrink-0 [perspective:1200px] sm:w-60">
              <div className="animate-fade-up transition duration-500 [transform:rotateY(-14deg)] hover:[transform:rotateY(0deg)] rtl:[transform:rotateY(14deg)] rtl:hover:[transform:rotateY(0deg)]">
                <BookCover book={book} eager className="shadow-[0_35px_60px_-15px_rgba(0,0,0,0.8)] ring-1 ring-white/10" />
              </div>
            </div>

            <div className="animate-fade-up flex-1 text-center md:text-start" style={{ animationDelay: "0.1s" }}>
              <h1 className="font-display text-3xl font-bold leading-tight sm:text-5xl">
                <bdi>{book.title}</bdi>
              </h1>
              <p className="mt-3 text-lg text-[#f1ebe0]/80">
                <span className="text-[#f1ebe0]/50">{t.by}</span> <bdi>{authors}</bdi>
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2 text-sm md:justify-start">
                <span className="rounded-full bg-white/10 px-3 py-1">
                  🌐 {book.languages.map((l) => languageNames.of(l) ?? l).join(sep)}
                </span>
                {book.downloads !== undefined && (
                  <span className="rounded-full bg-white/10 px-3 py-1">
                    ⬇ {fmt.format(book.downloads)} {t.downloadsCount}
                  </span>
                )}
                <span className="rounded-full bg-white/10 px-3 py-1">
                  📚 {book.source === "gutenberg" ? "Project Gutenberg" : "Internet Archive"}
                </span>
              </div>
              <BookActions
                book={snapshot}
                likeLabels={likeLabels(t)}
                statusLabels={t.status}
                statusTitle={t.statusLabel}
                statusToast={t.toastStatus}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[1fr_1.2fr]">
        {/* ───────── Downloads ───────── */}
        <section className="h-fit rounded-3xl border border-line bg-card p-6 shadow-sm lg:sticky lg:top-24">
          <h2 className="font-display text-2xl font-bold">{t.download}</h2>
          <p className="mt-1 text-sm text-muted">{t.downloadHint}</p>

          {formats.length ? (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {formats.map((f) => (
                <DownloadLink
                  key={f.key}
                  book={snapshot}
                  format={t.formats[f.key]}
                  toastMessage={t.toastDownload}
                  href={`/api/download/${book.id}?format=${f.key}`}
                  className="group flex items-center gap-3 rounded-2xl border border-line bg-paper p-4 transition hover:-translate-y-0.5 hover:border-gold hover:shadow-md"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-soft text-xl">
                    {FORMAT_ICON[f.key]}
                  </span>
                  <span className="flex-1">
                    <span className="block font-bold">{t.formats[f.key]}</span>
                    <span className="block text-xs text-muted">{t.formatHints[f.key]}</span>
                  </span>
                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-muted transition group-hover:translate-y-0.5 group-hover:text-gold" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
                    <path d="M12 4v11m0 0l-4.5-4.5M12 15l4.5-4.5M5 20h14" />
                  </svg>
                </DownloadLink>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-muted">{t.noFormats}</p>
          )}

          {book.readOnline && (
            <a
              href={book.readOnline}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-forest py-3.5 font-bold text-[#f1ebe0] transition hover:brightness-125"
            >
              📖 {t.readOnline}
            </a>
          )}
        </section>

        {/* ───────── Details ───────── */}
        <div className="flex flex-col gap-10">
          {book.summary && (
            <section>
              <h2 className="font-display mb-3 text-2xl font-bold">
                {t.summary}{" "}
                {book.summaryLang !== lang && book.summaryLang === "en" && (
                  <span className="text-sm font-normal text-muted">{t.summaryNote}</span>
                )}
              </h2>
              <p
                dir={book.summaryLang === "ar" ? "rtl" : "ltr"}
                lang={book.summaryLang}
                className="border-s-4 border-gold ps-5 text-start text-lg leading-relaxed text-ink/85"
              >
                {book.summary}
              </p>
            </section>
          )}

          {book.subjects.length > 0 && (
            <section>
              <h2 className="font-display mb-3 text-2xl font-bold">{t.subjects}</h2>
              <ul className="flex flex-wrap gap-2">
                {book.subjects.slice(0, 10).map((s) => (
                  <li key={s} dir="auto" className="rounded-full border border-line bg-card px-3 py-1.5 text-sm">
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
