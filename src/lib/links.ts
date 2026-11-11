// Internal URLs. The site is a static export, so a book page is one static page
// per language that reads the book id from the query string.

export const homeHref = (lang: string) => `/${lang}/`;
export const myLibraryHref = (lang: string) => `/${lang}/me/`;
export const bookHref = (lang: string, id: string) => `/${lang}/book/?id=${encodeURIComponent(id)}`;
