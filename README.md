# 📚 المكتبة الإلكترونية | E-Library

موقع مكتبة إلكترونية ثنائي اللغة (عربي / إنجليزي) للبحث عن الكتب المجانية وتحميلها مباشرة بصيغ جاهزة.

A bilingual (Arabic / English) e-library for searching free books and downloading them as ready-to-use files.

## المميزات | Features

- 🔍 البحث باسم الكتاب أو المؤلف، وفلترة حسب لغة الكتاب
- 🗂️ تصنيفات: روايات، تاريخ، علوم، أطفال، شعر، فلسفة...
- ⬇️ تحميل مباشر بصيغة **EPUB** و **Kindle (MOBI)** و **PDF** و **TXT**
- 🌐 واجهة عربية (من اليمين لليسار) وإنجليزية مع زر تبديل
- 🌙 وضع ليلي تلقائي

## مصدر الكتب | Book source

الكتب من [Project Gutenberg](https://www.gutenberg.org) عبر [Gutendex API](https://gutendex.com)، وكلها في **الملك العام** ومتاحة قانونياً.

Books come from Project Gutenberg via the Gutendex API. All are in the public domain.

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
