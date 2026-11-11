"use client";

// The reader's personal library — favorites, reading status, downloads and an
// activity log — kept in localStorage so it works without accounts.

import { useSyncExternalStore } from "react";

export type ReadingStatus = "want" | "reading" | "done";

/** Enough about a book to show it in "My Library" without fetching it again. */
export type BookSnapshot = { id: string; title: string; author?: string; cover?: string };

export type LibraryEntry = BookSnapshot & {
  likedAt?: number;
  status?: ReadingStatus;
  statusAt?: number;
  downloads?: { format: string; at: number }[];
  viewedAt?: number;
};

export type ActivityType = "like" | "unlike" | "download" | ReadingStatus | "none";
export type Activity = { type: ActivityType; bookId: string; at: number; detail?: string };

export type LibraryState = { books: Record<string, LibraryEntry>; activity: Activity[] };

const KEY = "midad:library:v1";
const EMPTY: LibraryState = { books: {}, activity: [] };
const MAX_ACTIVITY = 200;

let cache: LibraryState | null = null;
const listeners = new Set<() => void>();

function read(): LibraryState {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as LibraryState) : null;
    cache = parsed && parsed.books && Array.isArray(parsed.activity) ? parsed : EMPTY;
  } catch {
    cache = EMPTY;
  }
  return cache;
}

function write(next: LibraryState) {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage full or blocked: keep the in-memory copy for this visit.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null; // another tab changed it
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useLibrary(): LibraryState {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

function update(book: BookSnapshot, patch: (e: LibraryEntry) => LibraryEntry, activity?: Omit<Activity, "at" | "bookId">) {
  const state = read();
  const entry = patch({ ...state.books[book.id], ...book });
  const log = activity
    ? [{ ...activity, bookId: book.id, at: Date.now() }, ...state.activity].slice(0, MAX_ACTIVITY)
    : state.activity;
  write({ books: { ...state.books, [book.id]: entry }, activity: log });
}

/** Returns true when the book is now liked. */
export function toggleLike(book: BookSnapshot): boolean {
  const liked = !read().books[book.id]?.likedAt;
  update(book, (e) => ({ ...e, likedAt: liked ? Date.now() : undefined }), { type: liked ? "like" : "unlike" });
  return liked;
}

export function setStatus(book: BookSnapshot, status: ReadingStatus | null) {
  update(
    book,
    (e) => ({ ...e, status: status ?? undefined, statusAt: status ? Date.now() : undefined }),
    { type: status ?? "none" },
  );
}

export function recordDownload(book: BookSnapshot, format: string) {
  update(
    book,
    (e) => ({ ...e, downloads: [{ format, at: Date.now() }, ...(e.downloads ?? [])].slice(0, 20) }),
    { type: "download", detail: format },
  );
}

export function recordView(book: BookSnapshot) {
  update(book, (e) => ({ ...e, viewedAt: Date.now() }));
}

export function clearLibrary() {
  write(EMPTY);
}

/* ───────── Toasts ───────── */

const TOAST_EVENT = "midad:toast";

export function toast(message: string) {
  window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: message }));
}

export function onToast(handler: (message: string) => void) {
  const listener = (e: Event) => handler((e as CustomEvent<string>).detail);
  window.addEventListener(TOAST_EVENT, listener);
  return () => window.removeEventListener(TOAST_EVENT, listener);
}
