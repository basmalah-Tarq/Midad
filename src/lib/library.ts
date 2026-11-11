// One book shape for every source the site shows: Project Gutenberg (via Gutendex)
// and the curated Arabic catalog hosted on the Internet Archive.

import { ARABIC_BOOKS, type ArabicBook } from "@/data/arabic-books";
import {
  coverUrl,
  displayName,
  DOWNLOAD_FORMATS,
  findFormatUrl,
  getBook as getGutenbergBook,
  readOnlineUrl,
  searchBooks as searchGutenberg,
  type Book as GutenbergBook,
  type FormatKey,
  type Topic,
} from "./gutendex";

export type { FormatKey, Topic };
export { DOWNLOAD_FORMATS, TOPICS } from "./gutendex";

export type LibraryBook = {
  id: string;
  source: "gutenberg" | "archive";
  title: string;
  authors: { name: string; years?: string }[];
  summary?: string;
  /** Language the summary is written in. */
  summaryLang?: string;
  subjects: string[];
  languages: string[];
  cover?: string;
  downloads?: number;
  /** Direct file URL per format. */
  files: Partial<Record<FormatKey, string>>;
  readOnline?: string;
};

export type BookPage = { count: number; hasNext: boolean; hasPrev: boolean; results: LibraryBook[] };

/* ───────── Gutenberg ───────── */

function fromGutenberg(b: GutenbergBook): LibraryBook {
  const files: LibraryBook["files"] = {};
  for (const f of DOWNLOAD_FORMATS) {
    const url = findFormatUrl(b, f.mime);
    if (url) files[f.key] = url;
  }
  return {
    id: String(b.id),
    source: "gutenberg",
    title: b.title,
    authors: b.authors.map((a) => ({
      name: displayName(a),
      years: a.birth_year ? `${a.birth_year}–${a.death_year ?? ""}` : undefined,
    })),
    summary: b.summaries?.[0]?.replace(/\s*\(This is an automatically generated summary\.\)\s*$/, ""),
    summaryLang: "en",
    subjects: b.subjects.map((s) => s.replace(/ -- /g, " · ")),
    languages: b.languages,
    cover: coverUrl(b),
    downloads: b.download_count,
    files,
    readOnline: readOnlineUrl(b),
  };
}

export async function searchGutenbergBooks(opts: {
  search?: string;
  topic?: string;
  languages?: string;
  page?: number;
}): Promise<BookPage | null> {
  const data = await searchGutenberg(opts);
  if (!data) return null;
  return {
    count: data.count,
    hasNext: Boolean(data.next),
    hasPrev: Boolean(data.previous),
    results: data.results.map(fromGutenberg),
  };
}

/* ───────── Curated Arabic catalog ───────── */

const ARCHIVE = "https://archive.org";

function fromArabic(b: ArabicBook): LibraryBook {
  const files: LibraryBook["files"] = {};
  for (const [key, name] of Object.entries(b.files) as [FormatKey, string][]) {
    files[key] = `${ARCHIVE}/download/${b.archiveId}/${encodeURIComponent(name)}`;
  }
  return {
    id: `ar-${b.slug}`,
    source: "archive",
    title: b.title,
    authors: [{ name: b.author, years: b.years }],
    summary: b.description,
    summaryLang: "ar",
    subjects: [],
    languages: ["ar"],
    cover: `${ARCHIVE}/services/img/${b.archiveId}`,
    files,
    readOnline: `${ARCHIVE}/details/${b.archiveId}`,
  };
}

/** Loose Arabic matching: ignore diacritics, tatweel and alef/ya/ta-marbuta variants. */
function normalize(s: string) {
  return s
    .toLowerCase()
    .replace(/[ً-ْـ]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .trim();
}

export function searchArabicBooks(opts: { search?: string; topic?: Topic }): LibraryBook[] {
  const q = opts.search ? normalize(opts.search) : "";
  return ARABIC_BOOKS.filter(
    (b) =>
      (!opts.topic || b.topic === opts.topic) &&
      (!q || normalize(`${b.title} ${b.author}`).includes(q)),
  ).map(fromArabic);
}

export const ARABIC_COUNT = ARABIC_BOOKS.length;

/* ───────── Lookup by id ───────── */

export async function getLibraryBook(id: string): Promise<LibraryBook | null> {
  if (id.startsWith("ar-")) {
    const b = ARABIC_BOOKS.find((x) => `ar-${x.slug}` === id);
    return b ? fromArabic(b) : null;
  }
  if (!/^\d+$/.test(id)) return null;
  const b = await getGutenbergBook(Number(id));
  return b ? fromGutenberg(b) : null;
}

/** Hosts the download route is allowed to fetch from. */
export function isAllowedFileHost(url: string) {
  const host = new URL(url).hostname;
  return host.endsWith("gutenberg.org") || host === "archive.org" || host.endsWith(".archive.org");
}
