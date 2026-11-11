import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { coverUrl, displayName, type Book } from "@/lib/gutendex";

export default function BookCard({ book, lang, t }: { book: Book; lang: Locale; t: Dictionary }) {
  const cover = coverUrl(book);
  const author = book.authors[0] ? displayName(book.authors[0]) : t.unknownAuthor;
  const downloads = new Intl.NumberFormat(lang).format(book.download_count);

  return (
    <Link
      href={`/${lang}/book/${book.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg dark:border-stone-700 dark:bg-stone-900"
    >
      <div className="aspect-[2/3] w-full bg-stone-100 dark:bg-stone-800">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt={book.title} loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center p-4 text-center text-sm text-stone-500">
            {book.title}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="line-clamp-2 font-bold leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
          {book.title}
        </h3>
        <p className="line-clamp-1 text-sm text-stone-600 dark:text-stone-400">{author}</p>
        <p className="mt-auto pt-1 text-xs text-stone-500">
          {downloads} {t.downloadsCount}
        </p>
      </div>
    </Link>
  );
}
