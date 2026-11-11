import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MyLibrary from "@/components/MyLibrary";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return { title: getDictionary(lang).myLibrary, robots: { index: false } };
}

export default async function MyLibraryPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <MyLibrary lang={lang} t={getDictionary(lang)} />;
}
