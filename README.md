# AgroDash — Agribusiness Management Dashboard

A premium, production-ready SaaS dashboard template for agribusiness operations: crops, inputs,
orders, customers and analytics. Designed for clarity, responsiveness and speed — suitable to
ship as a commercial template on marketplaces like Envato.

> Built with **Next.js 16 App Router**, **React 19**, **TypeScript**, **Tailwind CSS v4**,
> **Framer Motion** and **Recharts**.

---

## ✨ Highlights

- Six polished pages — Dashboard, Products, Orders (+ detail), Customers (+ profile), Analytics, Settings
- **Light / Dark / System** theme with smooth transition and persistence
- **Bilingual UI** — English + Français, with an extensible i18n dictionary
- Collapsible sidebar with mobile drawer, sticky header with search, notifications, profile
- KPI cards with trend spark-lines, rich Recharts visualisations (area, bar, line, pie, composed)
- Products page with **table view + grid view + add/edit modal**, search, filters, pagination
- Orders with status timeline, itemised summary, shipping & payment panels
- Customers with profile view: contact card, farm metadata, recent orders
- Beautiful empty states, loading skeletons, toast notifications (Sonner)
- Subtle Framer Motion animations for page transitions, sidebar, cards, tables
- Fully typed, modular component architecture and reusable UI primitives
- Responsive from 360 px up to ultra-wide (1400 px+ centred layout)

---

## 🚀 Getting Started

### Requirements

- **Node.js 20.9+** (Next.js 16 minimum)
- **npm**, **pnpm**, **yarn** or **bun**

### Install

```bash
# Clone / extract the template, then
npm install
```

### Run

```bash
npm run dev        # start dev server (Turbopack)
npm run build      # production build
npm run start      # run production build
npm run lint       # ESLint (flat config)
```

Open <http://localhost:3000> — the app loads straight into the dashboard.

---

## 📁 Folder Structure

```text
agrodash/
├── app/                           # Next.js App Router
│   ├── (dashboard)/               # Route group: shared shell (sidebar + header)
│   │   ├── layout.tsx             # Wraps pages with <Shell />
│   │   ├── loading.tsx            # Skeleton fallback
│   │   ├── page.tsx               # /            → Dashboard
│   │   ├── products/page.tsx      # /products
│   │   ├── orders/
│   │   │   ├── page.tsx           # /orders
│   │   │   └── [id]/page.tsx      # /orders/:id  (async params)
│   │   ├── customers/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx      # /customers/:id
│   │   ├── analytics/page.tsx
│   │   └── settings/page.tsx
│   ├── not-found.tsx              # 404 page
│   ├── layout.tsx                 # Root — providers, fonts, <Toaster />
│   └── globals.css                # Tailwind v4 tokens + custom utilities
│
├── components/
│   ├── providers/
│   │   ├── theme-provider.tsx     # next-themes wrapper
│   │   ├── language-provider.tsx  # EN / FR dictionary context
│   │   └── sidebar-provider.tsx   # collapsed + mobile-open state
│   ├── layout/
│   │   ├── shell.tsx              # Dashboard shell
│   │   ├── sidebar.tsx            # Collapsible, animated
│   │   ├── header.tsx             # Search, notifications, profile
│   │   ├── page-header.tsx        # Reusable page title block
│   │   └── logo.tsx
│   ├── ui/                        # Shadcn-style primitives
│   │   ├── button.tsx · card.tsx · badge.tsx · input.tsx · select.tsx
│   │   ├── dialog.tsx · dropdown.tsx · sheet.tsx · tabs.tsx
│   │   ├── switch.tsx · progress.tsx · skeleton.tsx · tooltip.tsx
│   │   ├── avatar.tsx · empty-state.tsx · table.tsx
│   ├── dashboard/                 # KPI, charts, activity list, dashboard page
│   ├── products/                  # Table, grid, form dialog
│   ├── orders/                    # List, detail, timeline
│   ├── customers/                 # List, detail profile
│   ├── analytics/                 # Advanced charts
│   └── settings/                  # Profile, preferences, notifications, billing
│
├── lib/
│   ├── utils.ts                   # cn, formatters (currency, number, date, relative)
│   ├── types.ts                   # Domain types
│   ├── mock-data.ts               # Seeded, realistic agribusiness data
│   └── i18n.ts                    # EN + FR dictionaries
│
├── public/                        # Static assets
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs              # ESLint flat config (Next 16)
└── package.json
```

---

## 🎨 Design System

All tokens live as CSS custom properties in `app/globals.css`, exposed to Tailwind via the
Tailwind v4 `@theme inline` directive. Light and dark modes each redefine the same token set.

```css
/* app/globals.css */
:root {
  --primary:      oklch(0.58 0.14 150);   /* agri green */
  --accent:       oklch(0.94 0.05 85);    /* harvest amber */
  --destructive:  oklch(0.62 0.22 27);
  --chart-1..6:   /* six coordinated chart colors */;
  --radius:       0.75rem;
}
.dark { /* dark mode overrides for the same tokens */ }
```

To **change the brand colour** — edit `--primary` (light) and its `.dark` counterpart.
Everything else (buttons, badges, charts, rings, gradients) picks it up automatically.

### Colour roles

| Token           | Purpose                            |
|-----------------|------------------------------------|
| `primary`       | Primary actions, active nav, KPI 1 |
| `secondary`     | Muted buttons, neutral badges      |
| `accent`        | Subtle highlights                  |
| `success`       | Delivered, healthy stock, +delta   |
| `warning`       | Pending, low stock                 |
| `destructive`   | Cancelled, out of stock, -delta    |
| `info`          | Shipped, neutral info badges       |
| `chart-1..6`    | Consistent chart palette           |

### Typography

- **Sans** — [Poppins](https://fonts.google.com/specimen/Poppins) (weights `300 · 400 · 500 · 600 · 700`) loaded via `next/font/google`. Applied on `<html>` so the font cascades to every child and Tailwind's `font-sans` utility resolves correctly.
- **Mono** — [Geist Mono](https://vercel.com/font) for numeric / code contexts (`kbd`, `code`, `.font-mono`, tabular metrics).
- **Display** — [Instrument Serif](https://fonts.google.com/specimen/Instrument+Serif) exposed as `--font-display-next` for optional serif accents.

The font cascade is explicit in [`app/globals.css`](app/globals.css) so the chosen family renders even before `next/font` hashed-name resolution.

**Swap the family:** edit [`app/layout.tsx`](app/layout.tsx) — replace `Poppins` with any Google/local font, update the `weight` array, done.

---

## 🌍 Internationalization

- Dictionaries live in [`lib/i18n.ts`](lib/i18n.ts) (`en` + `fr`)
- Access via the hook: `const t = useT();` then `t.products.title`
- Switch language from the header globe menu or Settings → Preferences
- Locale is persisted to `localStorage` and auto-detects browser language on first visit

**Adding a new language:**

```ts
// lib/i18n.ts
export const locales: Locale[] = ["en", "fr", "es"]; // ← add your locale
export const dictionaries = {
  en: { /* ... */ },
  fr: { /* ... */ },
  es: { /* copy the en tree and translate */ },
};
```

---

## 🌓 Theming

- Powered by [`next-themes`](https://github.com/pacocoursey/next-themes) with `class` strategy
- Auto-detects the OS preference; user override is stored under `agrodash-theme`
- Toggle in the header, or choose Light / Dark / System on the Settings page

---

## 🧩 Reusable UI Primitives

Built in the same style as shadcn/ui — they live in your project, not a package, so you own
the code. All primitives compose with the design tokens, support light/dark out of the box,
and include sensible `focus-visible` rings for accessibility.

| Component      | File                             |
|----------------|----------------------------------|
| Button         | `components/ui/button.tsx`       |
| Card           | `components/ui/card.tsx`         |
| Input / Label  | `components/ui/input.tsx`        |
| Badge          | `components/ui/badge.tsx`        |
| Table          | `components/ui/table.tsx`        |
| Dialog         | `components/ui/dialog.tsx`       |
| Sheet          | `components/ui/sheet.tsx`        |
| Dropdown       | `components/ui/dropdown.tsx`     |
| Select         | `components/ui/select.tsx`       |
| Tabs           | `components/ui/tabs.tsx`         |
| Switch         | `components/ui/switch.tsx`       |
| Tooltip        | `components/ui/tooltip.tsx` — portaled, auto-flipping, theme-aware |
| Pagination     | `components/ui/pagination.tsx` — elegant range + ellipsis paginator |
| Progress       | `components/ui/progress.tsx`     |
| Skeleton       | `components/ui/skeleton.tsx`     |
| Avatar         | `components/ui/avatar.tsx`       |
| Empty state    | `components/ui/empty-state.tsx`  |

### Pagination

Drop-in paginator used on Products, Orders, and Customers.

```tsx
import { Pagination } from "@/components/ui/pagination";

<Pagination
  page={page}
  pageSize={10}
  total={filtered.length}
  onPageChange={setPage}
  labels={t.common.pagination}          // localised
/>
```

- Smart page range with ellipses (`1 … 4 5 6 … 12`)
- Inverted solid pill for the current page
- Responsive stack (summary over controls on mobile)
- ARIA-correct (`nav[aria-label]`, `aria-current="page"`)

---

## 🧪 Mock Data

`lib/mock-data.ts` contains realistic, seeded agribusiness data:

- **20 products** — seeds, fertilizer, pesticide, equipment, animal feed, harvest
- **12 customers** — farmers, cooperatives, distributors, retailers across Africa
- **28 orders** — with items, status, payment, shipping, notes
- **Activity feed**, monthly sales series, regional breakdown, weekly operations

Because the seed is deterministic, SSR and client renders match (no hydration warnings).

---

## 🛠 Customization Guide

### Swap the logo

Replace the SVG marker in [`components/layout/logo.tsx`](components/layout/logo.tsx) with
your own mark. The gradient picks up `--primary` automatically.

### Change the brand colour

Edit `--primary` in [`app/globals.css`](app/globals.css) under `:root` (light) and `.dark`.
Chart colours (`--chart-1..6`) can be retuned to your palette.

### Adjust chart palette

```css
:root {
  --chart-1: oklch(0.62 0.15 150);
  /* … */
}
```

Every chart reads from these tokens — no hard-coded colours.

### Add a new page

1. Create `app/(dashboard)/your-page/page.tsx`
2. Export a default function returning your component
3. Add an entry to `mainNav` in [`components/layout/sidebar.tsx`](components/layout/sidebar.tsx)
4. Add translations under the matching key in `lib/i18n.ts`

### Wire real data

Replace the imports from `lib/mock-data.ts` in each page with calls to your API or database.
Pages like Dashboard, Products, Customers, Analytics are client components today; convert the
shell to a Server Component and pass data as props if you want server-side data fetching.

For async dynamic segments, note the Next.js 16 requirement:

```tsx
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // params is a Promise in Next 16
  // …
}
```

### Connect toasts

The `<Toaster />` from [sonner](https://sonner.emilkowal.ski/) is already mounted in the
root layout. Any component can call:

```ts
import { toast } from "sonner";
toast.success("Saved", { description: "Your changes are live." });
```

---

## ♿ Accessibility

- Semantic headings, landmarks, focus rings on all interactive elements
- `role="dialog"` + focus-trap-friendly overlay with `Escape` to close
- Colour contrast tuned for both light and dark modes
- Respects `prefers-color-scheme` by default

---

## 🧱 Tech Stack

- [Next.js 16.2](https://nextjs.org) App Router (Turbopack build)
- [React 19.2](https://react.dev)
- [TypeScript 5](https://www.typescriptlang.org)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/) — animations
- [Recharts](https://recharts.org) — charts
- [Lucide](https://lucide.dev) — icons
- [next-themes](https://github.com/pacocoursey/next-themes) — theming
- [Sonner](https://sonner.emilkowal.ski/) — toasts
- [class-variance-authority](https://cva.style) + `clsx` + `tailwind-merge` — variants

---

## 📦 Scripts

| Script          | What it does              |
|-----------------|---------------------------|
| `npm run dev`   | Dev server with Turbopack |
| `npm run build` | Production build          |
| `npm run start` | Serve the built app       |
| `npm run lint`  | ESLint (flat config)      |

---

## 🚢 Deployment — Render + GitHub Actions

A production-ready deploy pipeline is included.

### One-click deploy (Render Blueprint)

[`render.yaml`](render.yaml) defines the web service: Node 20.18 runtime, `npm ci && npm run build` build command, `npm start` start command, health check on `/`, auto-deploy from `main`.

On Render → **New → Blueprint** → pick this repository. Render reads `render.yaml` and provisions the service. Configure any `DATABASE_URL` / `NEXT_PUBLIC_*` variables from the Render dashboard (keep them out of git).

### CI/CD (GitHub Actions)

[`.github/workflows/render-deploy.yml`](.github/workflows/render-deploy.yml) runs on every push + PR:

1. **Validate** — `npm ci`, `tsc --noEmit`, `eslint`, `next build`
2. **Deploy** — on `main`, posts to Render's deploy hook

**Single secret to configure** in `Settings → Secrets and variables → Actions`:

| Secret                    | Where to find                                           |
|---------------------------|---------------------------------------------------------|
| `RENDER_DEPLOY_HOOK_URL`  | Render dashboard → Service → Settings → **Deploy Hook** |

Optionally add a `RENDER_SERVICE_URL` *variable* so the GitHub environment UI links to your live site.

---

## 📄 License

This template is distributed under the license provided with your purchase.
Use in unlimited end-products per the marketplace terms.

---

Made with ❤️ for teams building the future of agriculture.
