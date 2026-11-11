import { notFound } from "next/navigation";
import { Suspense } from "react";
import BookView from "@/components/BookView";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

type Props = { params: Promise<{ lang: string }> };

// One static page per language; the book id comes from ?id= and loads in the browser.
export default async function BookPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <Suspense fallback={null}>
      <BookView lang={lang} t={getDictionary(lang)} />
    </Suspense>
  );
}
