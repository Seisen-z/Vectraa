# IconVault — Icon Library

A production-ready icon library web application with 50,000+ icons across 20 categories. Browse, search, and download in SVG, PNG, JPG, WebP, ICO, and JSON formats.

## ✨ Features

- **50,000+ icons** from Lucide, Tabler, Phosphor, Bootstrap Icons, and Heroicons
- **20 categories** — Technology, Communication, Weather, Social Media, and more
- **6 style variants** — Outline, Filled, Bold, Thin, Duotone, Glyph
- **6 download formats** — SVG, PNG (6 sizes), JPG, WebP, ICO, JSON
- **Bulk ZIP download** — select multiple icons, download as `.zip`
- **Real-time search** with fuzzy matching
- **Dark / Light theme** with localStorage persistence
- **Virtualized grid** — renders 50k+ icons without UI lag
- **Fully responsive** — sidebar on desktop, tab bar on mobile

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Generate the icon library (run once)
npm run generate-icons

# 3. Start the dev server
npm run dev
```

Open http://localhost:5173

### Production Build

```bash
npm run build
npm run preview
```

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS v3 |
| State | Zustand (with localStorage persistence) |
| Virtualization | react-window + react-virtualized-auto-sizer |
| Search | Fuse.js (fuzzy search) |
| Downloads | Canvas API + JSZip + file-saver |
| Icons | Lucide, Tabler, Bootstrap Icons, Heroicons |

## 📁 Project Structure

```
Icons/
├── scripts/
│   └── generate-icon-index.ts   # Run once: builds icon database
├── public/
│   ├── favicon.svg
│   └── icons/
│       ├── index.json           # Generated icon metadata (~50k entries)
│       └── svg/                 # Individual .svg files for download
└── src/
    ├── data/                    # Type definitions + category data
    ├── store/                   # Zustand stores (icons, theme)
    ├── utils/                   # Download + search utilities
    └── components/
        ├── layout/              # AppLayout, Header, Sidebar
        ├── icons/               # IconGrid, IconCard, IconModal, DownloadDropdown
        ├── search/              # SearchBar
        └── bulk/                # BulkDownloadBar
```

## 🎨 Icon Sources & Licenses

| Library | License | Count |
|---|---|---|
| [Lucide](https://lucide.dev) | ISC | ~1,700 |
| [Tabler Icons](https://tabler.io/icons) | MIT | ~5,900 |
| [Bootstrap Icons](https://icons.getbootstrap.com) | MIT | ~2,000 |
| [Heroicons](https://heroicons.com) | MIT | ~1,100 |

All icons are open-source with permissive licenses. Style variants (outline, filled, etc.) are generated from the base icon data.

## 🔧 Customisation

### Adding icon sources
Edit `scripts/generate-icon-index.ts` and add a new `loadXxx()` function following the existing pattern.

### Adding categories
Edit `src/data/categories.ts` — add a new entry to `CATEGORIES` with appropriate `keywords`.

### Neon colour palette
Edit `tailwind.config.ts` under `theme.extend.colors.neon`.
