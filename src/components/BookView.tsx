"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { Locale } from "@/i18n/config";
import { likeLabels, type Dictionary } from "@/i18n/dictionaries";
import { DOWNLOAD_FORMATS, getLibraryBook, type LibraryBook } from "@/lib/library";
import { homeHref } from "@/lib/links";
import BookActions, { DownloadLink } from "./BookActions";
import BookCover from "./BookCover";

const FORMAT_ICON: Record<string, string> = { epub: "📱", kindle: "📘", pdf: "🖨️", txt: "📄" };

type State = { id: string; book: LibraryBook | null } | null;

export default function BookView({ lang, t }: { lang: Locale; t: Dictionary }) {
  const id = useSearchParams().get("id") ?? "";
  const [state, setState] = useState<State>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    getLibraryBook(id).then((book) => {
      if (!cancelled) setState({ id, book });
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const ready = !id || state?.id === id;
  const book = id && state?.id === id ? state.book : null;

  useEffect(() => {
    if (book) document.title = `${book.title} | ${t.siteName}`;
  }, [book, t.siteName]);

  if (!ready) return <BookSkeleton />;
  if (!book) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
        <div className="mb-4 text-6xl">📕</div>
        <p className="text-lg text-muted">{t.noResults}</p>
        <Link href={homeHref(lang)} className="mt-6 font-semibold text-gold hover:underline">
          {t.back}
        </Link>
      </div>
    );
  }

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
          <Link href={homeHref(lang)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#e2b65f] hover:underline">
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
                  href={book.files[f.key]!}
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

function BookSkeleton() {
  return (
    <div aria-busy="true">
      <div className="bg-forest">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 py-16 md:flex-row md:items-end">
          <div className="aspect-[2/3] w-52 animate-pulse rounded-md bg-white/10 sm:w-60" />
          <div className="flex w-full flex-1 flex-col gap-4">
            <div className="h-10 w-3/4 animate-pulse rounded-lg bg-white/10" />
            <div className="h-5 w-1/2 animate-pulse rounded bg-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
}
