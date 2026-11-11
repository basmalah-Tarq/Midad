"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import { likeLabels } from "@/i18n/dictionaries";
import {
  clearLibrary,
  useLibrary,
  type Activity,
  type LibraryEntry,
  type ReadingStatus,
} from "@/lib/userLibrary";
import BookCover from "./BookCover";
import LikeButton from "./LikeButton";

type Tab = "liked" | "reading" | "want" | "done" | "recent";
const TABS: { key: Tab; icon: string }[] = [
  { key: "liked", icon: "❤️" },
  { key: "reading", icon: "📖" },
  { key: "want", icon: "🔖" },
  { key: "done", icon: "✅" },
  { key: "recent", icon: "🕘" },
];

const ACTIVITY_ICON: Record<Activity["type"], string> = {
  like: "❤️",
  unlike: "💔",
  want: "🔖",
  reading: "📖",
  done: "✅",
  none: "↩️",
  download: "⬇️",
};

const STATUS_STYLE: Record<ReadingStatus, string> = {
  want: "bg-sky-500/90",
  reading: "bg-amber-500/90",
  done: "bg-emerald-600/90",
};

const useMounted = () =>
  useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

function timeAgo(at: number, lang: string) {
  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: "auto" });
  const sec = Math.round((at - Date.now()) / 1000);
  const steps: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [unit, s] of steps) if (Math.abs(sec) >= s) return rtf.format(Math.round(sec / s), unit);
  return rtf.format(sec, "second");
}

export default function MyLibrary({ lang, t }: { lang: string; t: Dictionary }) {
  const mounted = useMounted();
  const { books, activity } = useLibrary();
  const [tab, setTab] = useState<Tab>("liked");
  const fmt = new Intl.NumberFormat(lang);

  const all = Object.values(books);
  const shelves: Record<Tab, LibraryEntry[]> = {
    liked: all.filter((b) => b.likedAt).sort((a, b) => b.likedAt! - a.likedAt!),
    reading: all.filter((b) => b.status === "reading").sort((a, b) => b.statusAt! - a.statusAt!),
    want: all.filter((b) => b.status === "want").sort((a, b) => b.statusAt! - a.statusAt!),
    done: all.filter((b) => b.status === "done").sort((a, b) => b.statusAt! - a.statusAt!),
    recent: all.filter((b) => b.viewedAt).sort((a, b) => b.viewedAt! - a.viewedAt!).slice(0, 18),
  };
  const downloads = all.reduce((n, b) => n + (b.downloads?.length ?? 0), 0);
  const hasAnything = all.some((b) => b.likedAt || b.status || b.downloads?.length) || activity.length > 0;

  const stats = [
    { icon: "❤️", value: shelves.liked.length, label: t.tabs.liked },
    { icon: "📖", value: shelves.reading.length, label: t.tabs.reading },
    { icon: "✅", value: shelves.done.length, label: t.tabs.done },
    { icon: "⬇️", value: downloads, label: t.statDownloads },
  ];

  const shelf = shelves[tab];
  const labels = likeLabels(t);

  return (
    <>
      {/* ───────── Header ───────── */}
      <section className="pattern relative overflow-hidden bg-forest text-[#f1ebe0]">
        <div className="pointer-events-none absolute -top-32 end-10 h-80 w-80 rounded-full bg-rose-400/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 start-10 h-80 w-80 rounded-full bg-[#e2b65f]/15 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-4 py-12">
          {mounted && hasAnything && <p className="mb-2 text-sm font-semibold text-[#e2b65f]">{t.welcomeBack}</p>}
          <h1 className="font-display text-4xl font-bold sm:text-5xl">{t.myLibrary}</h1>
          <p className="mt-3 max-w-xl text-[#f1ebe0]/70">{t.myLibrarySubtitle}</p>

          <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <dt className="flex items-center gap-2 text-sm text-[#f1ebe0]/60">
                  <span aria-hidden>{s.icon}</span>
                  {s.label}
                </dt>
                <dd className="font-display mt-1 text-3xl font-bold text-[#e2b65f]">{mounted ? fmt.format(s.value) : "–"}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 lg:grid-cols-[1fr_320px]">
        {/* ───────── Shelves ───────── */}
        <section className="min-w-0">
          <div role="tablist" className="mb-6 flex gap-2 overflow-x-auto pb-1">
            {TABS.map((tb) => {
              const active = tb.key === tab;
              return (
                <button
                  key={tb.key}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(tb.key)}
                  className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    active ? "border-ink bg-ink text-paper" : "border-line bg-card hover:border-gold"
                  }`}
                >
                  <span aria-hidden>{tb.icon}</span>
                  {t.tabs[tb.key]}
                  <span className={`rounded-full px-1.5 text-xs ${active ? "bg-paper/20" : "bg-line"}`}>
                    {mounted ? fmt.format(shelves[tb.key].length) : "–"}
                  </span>
                </button>
              );
            })}
          </div>

          {!mounted ? (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="aspect-[2/3] animate-pulse rounded-md bg-line" />
              ))}
            </div>
          ) : shelf.length === 0 ? (
            <div className="flex flex-col items-center rounded-3xl border border-dashed border-line px-6 py-16 text-center">
              <div className="mb-3 text-5xl">{TABS.find((x) => x.key === tab)?.icon}</div>
              <p className="text-muted">{t.emptyShelf}</p>
              <Link
                href={`/${lang}`}
                className="mt-5 rounded-full bg-gradient-to-b from-[#ecc677] to-[#c8913a] px-6 py-2.5 font-bold text-[#1f1b16] shadow transition hover:brightness-110"
              >
                {t.browse}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 md:grid-cols-4">
              {shelf.map((b) => (
                <div key={b.id} className="group relative">
                  <Link href={`/${lang}/book/${b.id}`} className="flex flex-col gap-3">
                    <div className="relative transition duration-300 group-hover:-translate-y-1.5">
                      <BookCover book={b} />
                      {b.status && (
                        <span className={`absolute bottom-2 start-2 rounded-full px-2 py-0.5 text-[11px] font-bold text-white ${STATUS_STYLE[b.status]}`}>
                          {t.status[b.status]}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 dir="auto" className="line-clamp-2 font-semibold leading-snug group-hover:text-gold">
                        {b.title}
                      </h3>
                      {b.author && (
                        <p dir="auto" className="line-clamp-1 text-sm text-muted">
                          {b.author}
                        </p>
                      )}
                    </div>
                  </Link>
                  <LikeButton book={b} labels={labels} revealOnHover className="absolute end-2 top-2 z-10" />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ───────── Activity ───────── */}
        <aside className="h-fit rounded-3xl border border-line bg-card p-5 lg:sticky lg:top-24">
          <h2 className="font-display mb-4 text-xl font-bold">{t.activityTitle}</h2>
          {!mounted ? null : activity.length === 0 ? (
            <p className="text-sm text-muted">{t.emptyActivity}</p>
          ) : (
            <ol className={`space-y-4 pe-1 ${activity.length > 8 ? "max-h-[28rem] overflow-y-auto" : ""}`}>
              {activity.slice(0, 40).map((a, i) => {
                const b = books[a.bookId];
                return (
                  <li key={`${a.at}-${i}`} className="flex gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-soft text-sm">
                      {ACTIVITY_ICON[a.type]}
                    </span>
                    <div className="min-w-0 text-sm">
                      <p className="leading-snug">
                        {t.activity[a.type]}{" "}
                        <Link href={`/${lang}/book/${a.bookId}`} className="font-semibold hover:text-gold">
                          «<bdi>{b?.title ?? a.bookId}</bdi>»
                        </Link>
                        {a.type === "download" && a.detail ? ` ${t.asFormat} ${a.detail}` : ""}
                      </p>
                      <p className="mt-0.5 text-xs text-muted">{timeAgo(a.at, lang)}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}

          {mounted && hasAnything && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm(t.clearConfirm)) clearLibrary();
              }}
              className="mt-6 w-full rounded-xl border border-line py-2 text-sm text-muted transition hover:border-red-400 hover:text-red-500"
            >
              {t.clearData}
            </button>
          )}
        </aside>
      </div>
    </>
  );
}
