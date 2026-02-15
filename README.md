# Kompressor

**Bulk image compression in the browser.** Drop your images, compress them instantly, and download as a single ZIP—no signup, no server uploads. Everything runs in your browser.

---

## Features

- **100% client-side** — Images never leave your device. No server uploads, no storage.
- **Bulk compression** — Up to 50 images at once (max 50 MB per image).
- **Multiple formats** — Input: JPEG, PNG, WebP, AVIF, TIFF. Output: JPEG, PNG, or WebP with optimized quality.
- **ZIP download** — One click to download all compressed images as a single ZIP file.
- **Live progress** — Per-file status and overall progress bar.
- **Savings stats** — Total bytes saved and percentage reduction after compression.
- **Responsive UI** — Works on desktop, tablet, and mobile.

---

## How It Works

1. **Add images** — Drag and drop or click to select. Accepted: JPEG, PNG, WebP, AVIF, TIFF (max 50 MB per image, up to 50 files).
2. **Review list** — See thumbnails, filenames, and original sizes. Remove any file before compressing.
3. **Compress** — Click **Compress X Images**. Each image is processed in the browser using the Canvas API: decoded, optionally resized if very large, then re-encoded at lower quality to reduce file size.
4. **Download** — When done, see total savings and click **Download ZIP** (or **Download Image** for a single file). ZIP is built in the browser with JSZip.

**Compression logic (no server):**

- Images are drawn to a `<canvas>` (or `OffscreenCanvas` when available).
- Output format: JPEG for most inputs (and PNG→JPEG for better compression); WebP stays WebP; PNG stays PNG.
- Quality is set (e.g. ~0.8–0.85) and reduced stepwise if the result is still larger than the original.
- Images larger than 4096px on any side are scaled down proportionally to reduce size.

So: **upload → process in browser → download**. No backend image processing.

---

## Tech Stack

| Category        | Technology |
|----------------|------------|
| **Framework**  | [Next.js 16](https://nextjs.org/) (App Router) |
| **UI**         | [React 19](https://react.dev/) |
| **Language**   | [TypeScript](https://www.typescriptlang.org/) |
| **Styling**    | [Tailwind CSS](https://tailwindcss.com/) |
| **Components** | [Radix UI](https://www.radix-ui.com/) (shadcn/ui-style) |
| **Compression**| Browser **Canvas API** (see `lib/compress-client.ts`) |
| **ZIP**        | [JSZip](https://stuk.github.io/jszip/) |
| **Download**   | [file-saver](https://github.com/eligrey/FileSaver.js) |
| **Toasts**     | [Sonner](https://sonner.emilkowal.ski/) |
| **Icons**      | [Lucide React](https://lucide.dev/) |


## Project Structure

```
kompresser/
├── app/
│   ├── layout.tsx      # Root layout, fonts, metadata, Toaster
│   ├── page.tsx        # Home: hero + ImageCompressor + features
│   └── globals.css     # Global styles and CSS variables
├── components/
│   ├── image-compressor.tsx  # Main flow: dropzone, list, progress, actions
│   ├── dropzone.tsx          # Drag-and-drop + file input (validation)
│   ├── file-list.tsx         # List of images with preview, size, status
│   ├── compression-stats.tsx # Post-compress: files count, saved bytes, %
│   ├── header.tsx
│   ├── features.tsx
│   ├── footer.tsx
│   └── ui/                   # Reusable UI (Button, Progress, Badge, etc.)
├── lib/
│   ├── compress-client.ts    # Canvas-based compression (no server)
│   └── utils.ts              # cn() for Tailwind class merging
├── public/
├── styles/
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- npm, yarn, or pnpm

### Install and run

```bash
# Clone (or navigate to the project)
cd kompresser

# Install dependencies
npm install
# or: pnpm install

# Start development server
npm run dev
# or: pnpm dev
```

### Scripts

| Command        | Description              |
|----------------|--------------------------|
| `npm run dev`  | Start dev server (Next.js with Turbo) |
| `npm run build`| Production build         |
| `npm run start`| Run production server    |
| `npm run lint` | Run Next.js ESLint       |

---

## Limits and Validation

- **Per image:** 50 MB max; only image types above (JPEG, PNG, WebP, AVIF, TIFF).
- **Total:** Up to 50 files per batch.
- Oversized or invalid files are skipped; the UI shows toasts for skipped files.

---

## License

Use and modify as you like. No warranty.

---

**Kompressor** — Compress images in bulk, instantly, in the browser.
