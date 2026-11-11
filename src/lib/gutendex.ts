// Client for the Gutendex API (https://gutendex.com), a JSON API over Project Gutenberg.

export type Author = {
  name: string;
  birth_year: number | null;
  death_year: number | null;
};

export type Book = {
  id: number;
  title: string;
  authors: Author[];
  summaries?: string[];
  subjects: string[];
  bookshelves: string[];
  languages: string[];
  formats: Record<string, string>;
  download_count: number;
};

export type BookList = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Book[];
};

const API = "https://gutendex.com/books";

export const TOPICS = [
  "fiction",
  "history",
  "science",
  "children",
  "poetry",
  "philosophy",
  "adventure",
  "religion",
] as const;
export type Topic = (typeof TOPICS)[number];

export const DOWNLOAD_FORMATS = [
  { key: "epub", mime: "application/epub+zip", ext: "epub" },
  { key: "kindle", mime: "application/x-mobipocket-ebook", ext: "mobi" },
  { key: "pdf", mime: "application/pdf", ext: "pdf" },
  { key: "txt", mime: "text/plain", ext: "txt" },
] as const;
export type FormatKey = (typeof DOWNLOAD_FORMATS)[number]["key"];

export async function searchBooks(opts: {
  search?: string;
  topic?: string;
  languages?: string;
  page?: number;
}): Promise<BookList | null> {
  const params = new URLSearchParams();
  if (opts.search) params.set("search", opts.search);
  if (opts.topic) params.set("topic", opts.topic);
  params.set("languages", opts.languages || "ar,en");
  if (opts.page && opts.page > 1) params.set("page", String(opts.page));

  return getJson<BookList>(`${API}/?${params}`);
}

export async function getBook(id: number): Promise<Book | null> {
  // The list endpoint filtered by id is more reliable than /books/{id}/, which
  // intermittently answers 503 without CORS headers (breaking browser fetches).
  const data = await getJson<BookList>(`${API}/?ids=${id}`);
  return data?.results.find((b) => b.id === id) ?? null;
}

/** GET JSON with a timeout and one retry; Gutendex is occasionally slow or flaky. */
async function getJson<T>(url: string, attempts = 2): Promise<T | null> {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(25000) });
      if (res.ok) return (await res.json()) as T;
    } catch {
      // timeout or network error: retry
    }
  }
  return null;
}

export function coverUrl(book: Book): string | undefined {
  return book.formats["image/jpeg"];
}

export function findFormatUrl(book: Book, mime: string): string | undefined {
  return Object.entries(book.formats).find(([type]) => type.startsWith(mime))?.[1];
}

export function readOnlineUrl(book: Book): string | undefined {
  return findFormatUrl(book, "text/html");
}

/** Gutenberg stores names as "Austen, Jane" — turn them into "Jane Austen". */
export function displayName(author: Author): string {
  const [last, first] = author.name.split(", ");
  return first ? `${first} ${last}` : author.name;
}
