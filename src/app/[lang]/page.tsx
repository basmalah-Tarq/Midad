import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import BookCover from "@/components/BookCover";
import Browse from "@/components/Browse";
import SearchForm from "@/components/SearchForm";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { ARABIC_COUNT, searchGutenbergBooks } from "@/lib/library";
import { bookHref } from "@/lib/links";

type Props = { params: Promise<{ lang: string }> };

// Positions for the fanned stack of covers in the hero.
const FAN = [
  { pos: "start-[6%] top-[18%] w-[30%]", r: "-12deg", z: "z-10", delay: "0s" },
  { pos: "end-[6%] top-[18%] w-[30%]", r: "12deg", z: "z-10", delay: "1.2s" },
  { pos: "start-[19%] top-[8%] w-[34%]", r: "-5deg", z: "z-20", delay: "0.6s" },
  { pos: "end-[19%] top-[8%] w-[34%]", r: "5deg", z: "z-20", delay: "1.8s" },
  { pos: "start-1/2 -translate-x-1/2 rtl:translate-x-1/2 top-0 w-[40%]", r: "0deg", z: "z-30", delay: "0.3s" },
];

export default async function HomePage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);

  // Fetched once at build time: hero covers and the book count.
  const popular = await searchGutenbergBooks({ languages: "en" });
  const heroBooks = popular?.results.filter((b) => b.cover).slice(0, 5) ?? [];
  const totalBooks = (popular?.count ?? 60000) + ARABIC_COUNT;
  const fmt = new Intl.NumberFormat(lang);

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

            <Suspense fallback={<div className="mt-8 h-[60px] rounded-2xl bg-white" />}>
              <SearchForm lang={lang} t={t} />
            </Suspense>

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
                href={bookHref(lang, book.id)}
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

      <Suspense fallback={<div className="min-h-[60vh]" />}>
        <Browse lang={lang} t={t} />
      </Suspense>
    </>
  );
}
