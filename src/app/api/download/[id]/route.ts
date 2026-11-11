import { DOWNLOAD_FORMATS, findFormatUrl, getBook } from "@/lib/gutendex";

// Streams a book file from Project Gutenberg back to the browser as a ready-to-save
// attachment. Only URLs listed by Gutendex for this book are fetched, so this is not
// an open proxy.
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const formatKey = new URL(req.url).searchParams.get("format") ?? "epub";
  const format = DOWNLOAD_FORMATS.find((f) => f.key === formatKey);

  if (!format || !/^\d+$/.test(id)) {
    return new Response("Bad request", { status: 400 });
  }

  const book = await getBook(Number(id));
  if (!book) return new Response("Book not found", { status: 404 });

  const fileUrl = findFormatUrl(book, format.mime);
  if (!fileUrl || !new URL(fileUrl).hostname.endsWith("gutenberg.org")) {
    return new Response("Format not available", { status: 404 });
  }

  const upstream = await fetch(fileUrl, { cache: "no-store" });
  if (!upstream.ok || !upstream.body) {
    return new Response("Could not fetch the file", { status: 502 });
  }

  const safeTitle =
    book.title.replace(/[\\/:*?"<>|\r\n]+/g, " ").trim().slice(0, 100) || `book-${id}`;
  const filename = `${safeTitle}.${format.ext}`;

  const headers = new Headers({
    "Content-Type": format.mime === "text/plain" ? "text/plain; charset=utf-8" : format.mime,
    "Content-Disposition": `attachment; filename="book-${id}.${format.ext}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
    "Cache-Control": "public, max-age=86400",
  });
  const length = upstream.headers.get("content-length");
  if (length) headers.set("Content-Length", length);

  return new Response(upstream.body, { headers });
}
