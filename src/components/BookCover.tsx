import type { LibraryBook } from "@/lib/library";

const PLACEHOLDER_COLORS = [
  ["#0f2a24", "#1f5a4c"],
  ["#3b1d2e", "#7a3557"],
  ["#1d2a44", "#38598f"],
  ["#3d2a12", "#8a5a1e"],
  ["#22303a", "#4f6b7d"],
];

function hash(s: string) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) | 0;
  return Math.abs(h);
}

/** A book cover with a spine shadow and page gloss, or a generated cover when none exists. */
export default function BookCover({
  book,
  className = "",
  eager = false,
}: {
  book: Pick<LibraryBook, "id" | "title" | "cover">;
  className?: string;
  eager?: boolean;
}) {
  const [from, to] = PLACEHOLDER_COLORS[hash(book.id) % PLACEHOLDER_COLORS.length];

  return (
    <div
      className={`relative aspect-[2/3] overflow-hidden rounded-e-md rounded-s-sm bg-line shadow-[0_10px_25px_-8px_rgba(0,0,0,0.45)] ${className}`}
    >
      {book.cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={book.cover}
          alt={book.title}
          loading={eager ? "eager" : "lazy"}
          className="h-full w-full object-cover"
        />
      ) : (
        <div
          className="pattern flex h-full flex-col justify-between p-4 text-[#f1ebe0]"
          style={{ backgroundColor: from, backgroundImage: `linear-gradient(160deg, ${from}, ${to})` }}
        >
          <span className="h-px w-10 bg-[#e2b65f]" />
          <span dir="auto" className="font-display line-clamp-4 text-lg font-bold leading-snug">
            {book.title}
          </span>
          <span className="h-px w-10 bg-[#e2b65f]" />
        </div>
      )}
      {/* spine */}
      <span className="pointer-events-none absolute inset-y-0 start-0 w-2.5 bg-gradient-to-l from-transparent to-black/35 rtl:bg-gradient-to-r" />
      {/* gloss */}
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/0 to-white/15" />
    </div>
  );
}
