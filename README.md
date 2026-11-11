# 📚 المكتبة الإلكترونية | E-Library

موقع مكتبة إلكترونية ثنائي اللغة (عربي / إنجليزي) للبحث عن الكتب المجانية وتحميلها مباشرة بصيغ جاهزة.

A bilingual (Arabic / English) e-library for searching free books and downloading them as ready-to-use files.

## المميزات | Features

- 🔍 البحث باسم الكتاب أو المؤلف، وفلترة حسب لغة الكتاب
- 🗂️ تصنيفات: روايات، تاريخ، علوم، أطفال، شعر، فلسفة...
- ⬇️ تحميل مباشر بصيغة **EPUB** و **Kindle (MOBI)** و **PDF** و **TXT**
- 🌐 واجهة عربية (من اليمين لليسار) وإنجليزية مع زر تبديل
- 🌙 زر للوضع الليلي / النهاري يحفظ اختيارك
- 📜 مكتبة «روائع الأدب العربي»: ابن خلدون، المتنبي، جبران، المنفلوطي، شوقي، جرجي زيدان...

## مصادر الكتب | Book sources

| المصدر | المحتوى |
|---|---|
| [Project Gutenberg](https://www.gutenberg.org) عبر [Gutendex API](https://gutendex.com) | أكثر من 60 ألف كتاب عالمي، أغلبها إنجليزي |
| [Internet Archive](https://archive.org) | قائمة مختارة يدوياً من الكتب العربية الكلاسيكية في [`src/data/arabic-books.ts`](src/data/arabic-books.ts) |

كل الكتب **في الملك العام** ومتاحة قانونياً. الكتب العربية مختارة لمؤلفين توفوا قبل أكثر من 70 سنة. تصنيفات الترخيص على Internet Archive يكتبها الرافعون أنفسهم وفيها أخطاء كثيرة، لهيك ما بنعرض نتائج بحث الأرشيف تلقائياً، وبنضيف الكتب يدوياً بعد التحقق.

Books come from Project Gutenberg (via Gutendex) and a hand-picked list of Arabic classics on the Internet Archive. All are in the public domain. Archive license tags are self-reported and often wrong, so Arabic books are added by hand rather than pulled from search.

### إضافة كتاب عربي | Adding an Arabic book

أضف عنصراً جديداً إلى `ARABIC_BOOKS` في `src/data/arabic-books.ts` بمعرّف الأرشيف (`archiveId`) واسم الملف بالضبط داخل العنصر.

## التقنيات | Tech stack

- [Next.js 15](https://nextjs.org) (App Router) + TypeScript
- Tailwind CSS 4
- خط Cairo

## التشغيل | Getting started

```bash
npm install
npm run dev
```

ثم افتح | then open: http://localhost:3000

## هيكل المشروع | Project structure

```
src/
├── app/
│   ├── [lang]/              # صفحات الموقع لكل لغة (ar / en)
│   │   ├── page.tsx         # الصفحة الرئيسية: بحث + تصنيفات + نتائج
│   │   └── book/[id]/       # صفحة الكتاب وأزرار التحميل
│   └── api/download/[id]/   # تحميل ملف الكتاب كمرفق جاهز
├── components/              # BookCard, LanguageSwitcher
├── i18n/                    # إعدادات اللغات والترجمات
├── lib/gutendex.ts          # الاتصال بـ Gutendex API
└── middleware.ts            # تحويل "/" إلى "/ar"
```

## الخطوات القادمة | Roadmap

- [ ] لوحة تحكم لرفع كتب عربية خاصة
- [ ] حسابات مستخدمين وقائمة مفضلة
- [ ] قارئ كتب داخل الموقع
- [ ] النشر على Vercel
