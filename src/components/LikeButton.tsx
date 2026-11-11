"use client";

import { useState } from "react";
import { toast, toggleLike, useLibrary, type BookSnapshot } from "@/lib/userLibrary";

export type LikeLabels = { add: string; remove: string; added: string; removed: string; liked: string };

function Heart({ filled, className }: { filled: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M12 20.5s-7.5-4.6-9.3-9.4C1.4 7.6 3.7 4 7.3 4c2 0 3.6 1.1 4.7 2.7C13.1 5.1 14.7 4 16.7 4c3.6 0 5.9 3.6 4.6 7.1-1.8 4.8-9.3 9.4-9.3 9.4z" />
    </svg>
  );
}

/** "icon": round button over a cover. "full": labelled button for the book page. */
export default function LikeButton({
  book,
  labels,
  variant = "icon",
  revealOnHover = false,
  className = "",
}: {
  book: BookSnapshot;
  labels: LikeLabels;
  variant?: "icon" | "full";
  /** Icon only: on desktop, hide until the parent `group` is hovered (always shown once liked). */
  revealOnHover?: boolean;
  className?: string;
}) {
  const liked = Boolean(useLibrary().books[book.id]?.likedAt);
  const [pop, setPop] = useState(0);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const now = toggleLike(book);
    setPop((n) => n + 1);
    toast(now ? labels.added : labels.removed);
  };

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={liked}
        className={`flex items-center justify-center gap-2 rounded-2xl border px-5 py-3 font-bold transition ${
          liked
            ? "border-rose-500/40 bg-rose-500/15 text-rose-500"
            : "border-white/20 bg-white/5 text-[#f1ebe0] hover:border-rose-400 hover:text-rose-400"
        } ${className}`}
      >
        <Heart key={pop} filled={liked} className={`h-5 w-5 ${pop ? "animate-pop" : ""}`} />
        {liked ? labels.liked : labels.add}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={liked}
      aria-label={liked ? labels.remove : labels.add}
      title={liked ? labels.remove : labels.add}
      className={`flex h-9 w-9 items-center justify-center rounded-full shadow-lg backdrop-blur transition ${
        liked ? "bg-white text-rose-500" : "bg-black/45 text-white hover:bg-white hover:text-rose-500"
      } ${
        revealOnHover && !liked ? "md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100" : ""
      } ${className}`}
    >
      <Heart key={pop} filled={liked} className={`h-[18px] w-[18px] ${pop ? "animate-pop" : ""}`} />
    </button>
  );
}
