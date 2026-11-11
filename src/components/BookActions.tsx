"use client";

import { useEffect } from "react";
import {
  recordDownload,
  recordView,
  setStatus,
  toast,
  useLibrary,
  type BookSnapshot,
  type ReadingStatus,
} from "@/lib/userLibrary";
import LikeButton, { type LikeLabels } from "./LikeButton";

const STATUSES: { key: ReadingStatus; icon: string }[] = [
  { key: "want", icon: "🔖" },
  { key: "reading", icon: "📖" },
  { key: "done", icon: "✅" },
];

/** Like button + reading-status picker shown in the book banner. Also records the visit. */
export default function BookActions({
  book,
  likeLabels,
  statusLabels,
  statusTitle,
  statusToast,
}: {
  book: BookSnapshot;
  likeLabels: LikeLabels;
  statusLabels: Record<ReadingStatus, string>;
  statusTitle: string;
  statusToast: string;
}) {
  const current = useLibrary().books[book.id]?.status;

  useEffect(() => {
    recordView(book);
    // Only once per book page visit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book.id]);

  return (
    <div className="mt-6 flex flex-col items-center gap-3 md:items-start">
      <div className="flex flex-wrap justify-center gap-2 md:justify-start">
        <LikeButton book={book} labels={likeLabels} variant="full" />
        <div role="group" aria-label={statusTitle} className="flex rounded-2xl border border-white/15 bg-white/5 p-1">
          {STATUSES.map((s) => {
            const active = current === s.key;
            return (
              <button
                key={s.key}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setStatus(book, active ? null : s.key);
                  toast(statusToast);
                }}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold transition ${
                  active ? "bg-[#e2b65f] text-[#1f1b16] shadow" : "text-[#f1ebe0]/80 hover:bg-white/10"
                }`}
              >
                <span aria-hidden>{s.icon}</span>
                {statusLabels[s.key]}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** A download link that also logs the download in the reader's activity. */
export function DownloadLink({
  book,
  format,
  href,
  toastMessage,
  className,
  children,
}: {
  book: BookSnapshot;
  format: string;
  href: string;
  toastMessage: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => {
        recordDownload(book, format);
        toast(toastMessage);
      }}
    >
      {children}
    </a>
  );
}
