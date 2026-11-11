// Internal URLs. The site is a static export, so a book page is one static page
// per language that reads the book id from the query string.
//
// next/link adds the base path by itself; use withBase() only for plain URLs
// such as a <form action>.

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const withBase = (path: string) => `${BASE_PATH}${path}`;

export const homeHref = (lang: string) => `/${lang}/`;
export const myLibraryHref = (lang: string) => `/${lang}/me/`;
export const bookHref = (lang: string, id: string) => `/${lang}/book/?id=${encodeURIComponent(id)}`;
