<div align="center">

<img src="src/app/icon.svg" alt="Midad logo" width="96">

# Midad · مِداد — Bilingual E-Library

**Discover a world of books. Download them in one click.**

A free, bilingual (Arabic / English) e-library: search 60,000+ public-domain books, browse a hand-picked shelf of Arabic classics, download ready-to-read files, and keep your own reading list — no sign-up needed.

![Next.js](https://img.shields.io/badge/Next.js-15-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-0F2A24)

</div>

---

## ✨ Highlights

- **60,000+ free books** — live search over Project Gutenberg by title or author, with categories and paging.
- **Arabic classics shelf** — 30 hand-picked public-domain works (Ibn Khaldun, al-Mutanabbi, Gibran, al-Manfaluti, Shawqi, Jurji Zaydan…), each verified to download.
- **Smart Arabic search** — ignores hamza, diacritics and ة/ه, ى/ي differences, so `الف ليله` finds «ألف ليلة وليلة».
- **Ready-to-read downloads** — EPUB, Kindle, PDF and TXT where available, plus "read online".
- **My Library** — favorites ❤️, reading status (want to read / reading / finished), download history and an activity timeline, saved in the browser.
- **Arabic & English (RTL)** and **Light / Dark mode** that remembers your choice.
- **Static site** — builds to plain HTML/CSS/JS, so it runs on any host, including free PHP hosting like InfinityFree.

## 📸 Screenshots

| Arabic · Light | Arabic · Dark | English |
|---|---|---|
| ![Landing Arabic light](docs/screenshots/web-landing-ar-light-1440.png) | ![Landing Arabic dark](docs/screenshots/web-landing-ar-dark-1440.png) | ![Landing English](docs/screenshots/web-landing-en-light-1440.png) |

| Arabic classics | Book page | My Library |
|---|---|---|
| ![Arabic classics](docs/screenshots/web-arabic-classics-ar-light-1440.png) | ![Book page](docs/screenshots/web-book-ar-dark-1440.png) | ![My Library](docs/screenshots/web-my-library-ar-light-1440.png) |

| Mobile · Dark | Mobile · My Library |
|---|---|
| <img src="docs/screenshots/mobile-landing-ar-dark-390.png" width="260"> | <img src="docs/screenshots/mobile-my-library-ar-light-390.png" width="260"> |

## 🏗️ Architecture

```
                ┌────────────────────────────────────┐
Browser ───────▶│  Static site (HTML / CSS / JS)      │
                │  /ar/  /en/  · book · my library    │
                └──────┬──────────────┬──────────────┘
                       │              │
        search & books │              │ favorites, reading status,
          (fetch, CORS)│              │ activity  →  localStorage
                       ▼              ▼
     ┌──────────────────────┐   ┌──────────────────────────────┐
     │ Gutendex API          │   │ Curated Arabic catalog         │
     │ (Project Gutenberg)   │   │ src/data/arabic-books.ts       │
     └──────────────────────┘   │ files & covers → Internet Archive│
                                └──────────────────────────────┘
```

## 🧰 Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, static export), React 19, TypeScript |
| Styling | Tailwind CSS 4, El Messiri + IBM Plex Sans Arabic fonts |
| Data | Gutendex API (Project Gutenberg), Internet Archive |
| Storage | Browser localStorage (no accounts, no database) |
| Hosting | Any static host — InfinityFree, Vercel, Netlify, GitHub Pages |

## 📁 Project structure

```
ebook-library/
├── src/
│   ├── app/
│   │   ├── [lang]/            # Pages for each language (ar / en)
│   │   │   ├── page.tsx       # Home: hero, search, categories, results
│   │   │   ├── book/          # Book page (reads ?id=)
│   │   │   └── me/            # My Library
│   │   └── icon.svg           # Logo / favicon
│   ├── components/            # BookCard, Browse, BookView, MyLibrary, LikeButton…
│   ├── data/arabic-books.ts   # Curated Arabic classics
│   ├── i18n/                  # Arabic / English dictionaries
│   └── lib/                   # Gutendex client, library model, user library store
├── public/                    # Root redirect, .htaccess for Apache hosts
└── docs/screenshots/          # Images used in this README
```

## 🚀 Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000/ar/

### Build & deploy (static)

```bash
npm run build
```

The site is written to `out/`. Upload the **contents** of `out/` to your host's web root (for InfinityFree: `htdocs/`). The included `.htaccess` handles the 404 page and caching.

### Adding an Arabic book

Add an entry to `ARABIC_BOOKS` in `src/data/arabic-books.ts` with the Internet Archive item id (`archiveId`) and the exact file name inside it. Only add works whose authors died more than 70 years ago.

## 🇵🇸 بالعربي

**مِداد** مكتبة إلكترونية مجانية بالعربي والإنجليزي.

- بحث بين أكثر من **60 ألف كتاب** من مشروع غوتنبرغ، حسب العنوان أو المؤلف أو التصنيف.
- رف **«روائع الأدب العربي»**: 30 كتاباً كلاسيكياً في الملك العام، منها مقدمة ابن خلدون، وديوان المتنبي، وجبران، والمنفلوطي، وشوقي، وجرجي زيدان.
- بحث عربي ذكي يتجاهل الهمزات والتشكيل.
- تحميل الكتب بصيغة EPUB و Kindle و PDF و TXT.
- **مكتبتي**: المفضلة، وحالة القراءة، وسجل التحميلات والنشاط، محفوظة على جهازك بدون تسجيل.
- **الوضع الفاتح والداكن** ويعمل على الكمبيوتر والموبايل.

كل الكتب في **الملك العام** ومتاحة قانونياً.

## 📚 Book sources

- [Project Gutenberg](https://www.gutenberg.org) via [Gutendex](https://gutendex.com)
- [Internet Archive](https://archive.org) for the curated Arabic shelf. Archive license tags are self-reported and often wrong, so Arabic books are added by hand after checking the author's dates.

## 👩‍💻 Author

**Basmalah Qaseem** ([@basmalah-Tarq](https://github.com/basmalah-Tarq))

## 📄 License

Released under the [MIT License](LICENSE).
