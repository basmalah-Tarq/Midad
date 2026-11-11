import type { Locale } from "./config";

const ar = {
  siteName: "المكتبة الإلكترونية",
  tagline: "آلاف الكتب المجانية، جاهزة للتحميل بصيغة EPUB و Kindle و PDF و TXT",
  searchPlaceholder: "ابحث باسم الكتاب أو المؤلف...",
  search: "بحث",
  bookLanguage: "لغة الكتاب",
  allLanguages: "كل اللغات",
  arabic: "العربية",
  english: "الإنجليزية",
  categories: "التصنيفات",
  popular: "الأكثر تحميلاً",
  resultsFor: "نتائج البحث عن",
  category: "تصنيف",
  booksCount: "كتاب",
  noResults: "لم يتم العثور على كتب. جرّب كلمة بحث أخرى.",
  loadError: "تعذّر الاتصال بمصدر الكتب. حاول مرة أخرى بعد قليل.",
  by: "تأليف",
  unknownAuthor: "مؤلف غير معروف",
  downloadsCount: "مرة تحميل",
  download: "تحميل الكتاب",
  readOnline: "اقرأ أونلاين",
  noFormats: "لا توجد ملفات متاحة للتحميل لهذا الكتاب.",
  subjects: "المواضيع",
  summary: "نبذة (بالإنجليزية)",
  languages: "اللغة",
  back: "العودة للمكتبة",
  next: "التالي",
  prev: "السابق",
  page: "صفحة",
  switchLanguage: "English",
  footer:
    "الكتب مقدّمة من مشروع غوتنبرغ (Project Gutenberg) وهي في الملك العام ومتاحة مجاناً بشكل قانوني.",
  topics: {
    fiction: "روايات",
    history: "تاريخ",
    science: "علوم",
    children: "أطفال",
    poetry: "شعر",
    philosophy: "فلسفة",
    adventure: "مغامرات",
    religion: "أديان",
  },
  formats: {
    epub: "EPUB",
    kindle: "Kindle",
    pdf: "PDF",
    txt: "نص TXT",
  },
};

export type Dictionary = typeof ar;

const en: Dictionary = {
  siteName: "E-Library",
  tagline: "Thousands of free books, ready to download as EPUB, Kindle, PDF and TXT",
  searchPlaceholder: "Search by title or author...",
  search: "Search",
  bookLanguage: "Book language",
  allLanguages: "All languages",
  arabic: "Arabic",
  english: "English",
  categories: "Categories",
  popular: "Most downloaded",
  resultsFor: "Results for",
  category: "Category",
  booksCount: "books",
  noResults: "No books found. Try another search.",
  loadError: "Couldn't reach the book source. Please try again shortly.",
  by: "by",
  unknownAuthor: "Unknown author",
  downloadsCount: "downloads",
  download: "Download",
  readOnline: "Read online",
  noFormats: "No downloadable files are available for this book.",
  subjects: "Subjects",
  summary: "Summary",
  languages: "Language",
  back: "Back to library",
  next: "Next",
  prev: "Previous",
  page: "Page",
  switchLanguage: "العربية",
  footer:
    "Books are provided by Project Gutenberg. They are in the public domain and free to download legally.",
  topics: {
    fiction: "Fiction",
    history: "History",
    science: "Science",
    children: "Children",
    poetry: "Poetry",
    philosophy: "Philosophy",
    adventure: "Adventure",
    religion: "Religion",
  },
  formats: {
    epub: "EPUB",
    kindle: "Kindle",
    pdf: "PDF",
    txt: "Plain text",
  },
};

const dictionaries: Record<Locale, Dictionary> = { ar, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
