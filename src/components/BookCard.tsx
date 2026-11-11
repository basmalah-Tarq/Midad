import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { likeLabels, type Dictionary } from "@/i18n/dictionaries";
import type { LibraryBook } from "@/lib/library";
import { bookHref } from "@/lib/links";
import BookCover from "./BookCover";
import LikeButton from "./LikeButton";

export default function BookCard({ book, lang, t }: { book: LibraryBook; lang: Locale; t: Dictionary }) {
  const author = book.authors[0]?.name ?? t.unknownAuthor;

  return (
    <div className="group relative flex flex-col">
      <Link href={bookHref(lang, book.id)} className="flex flex-col gap-3">
        <div className="relative transition duration-300 group-hover:-translate-y-2 group-hover:rotate-[-1deg]">
          <BookCover book={book} className="group-hover:shadow-[0_22px_40px_-12px_rgba(0,0,0,0.55)]" />
          {book.downloads !== undefined && (
            <span className="absolute bottom-2 end-2 flex items-center gap-1 rounded-full bg-black/65 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur">
              <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
                <path d="M12 4v11m0 0l-4.5-4.5M12 15l4.5-4.5M5 20h14" />
              </svg>
              {new Intl.NumberFormat(lang, { notation: "compact" }).format(book.downloads)}
            </span>
          )}
        </div>
        <div className="px-0.5">
          <h3 dir="auto" className="line-clamp-2 font-semibold leading-snug transition group-hover:text-gold">
            {book.title}
          </h3>
          <p dir="auto" className="mt-0.5 line-clamp-1 text-sm text-muted">
            {author}
          </p>
        </div>
      </Link>
      <LikeButton
        book={{ id: book.id, title: book.title, author, cover: book.cover }}
        labels={likeLabels(t)}
        revealOnHover
        className="absolute end-2 top-2 z-10 transition group-hover:-translate-y-2"
      />
    </div>
  );
}
