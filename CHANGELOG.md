# Changelog

All notable changes to this template are documented here. This project
follows [Semantic Versioning](https://semver.org) and keeps a
[Keep a Changelog](https://keepachangelog.com) style history.

## [1.2.0] — 2026-04-20

### Added — marketing surface + premium interactions
- **Public landing page** (`/`) — hero, feature grid, split feature
  sections, testimonials, pricing preview, FAQ, CTA + marketing
  top-nav/footer. Dashboard moved to `/dashboard`.
- **Pricing page** (`/pricing`) — 3 tiers with monthly / annual toggle,
  comparison table, billing FAQ.
- **Command palette** (`⌘K` / `Ctrl K`) — fuzzy nav across every page,
  quick actions, recently viewed; Linear/Raycast-style polish.
- **Keyboard shortcuts modal** (`?` or `Ctrl /`) — complete cheat sheet
  of all global chords; `g d/p/o/c/i/l/k/a/s` two-key sequences for
  navigation; `Ctrl T` toggles theme; `Ctrl L` switches locale.
- **Error pages** — `app/error.tsx` (global), `app/(dashboard)/error.tsx`
  (scoped), `/maintenance`; polished `not-found.tsx` with mesh bg.
- **Help Center** (`/help`) — category grid, popular articles, FAQ
  accordion, contact card with ticket dialog, stats strip.
- **Date Range picker** — reusable primitive with 9 presets + custom
  two-month calendar; wired into Analytics.
- **RTL support** — third locale `ar` (Arabic proof-of-concept),
  `document.dir` switched by LanguageProvider, logical-property audit
  across sidebar/header/dialogs/tooltips, direction-aware icons flip
  via new `rtl:` / `ltr:` custom variants in `globals.css`.
- **Print styles** — sidebar/header/chrome hidden when printing;
  invoices become clean black-on-white receipts.
- **Bilingual** for every new surface — EN + FR.

### Changed
- Sidebar root href is now `/dashboard` (was `/`); `PublicRoute` first.
- Sitemap lists marketing routes first + dashboard under `/dashboard`.

### Developer experience
- Two new providers (`CommandPaletteProvider`, `ShortcutsProvider`)
  mounted inside the dashboard shell.
- New `@custom-variant rtl` and `@custom-variant ltr` so components
  can express direction with `rtl:*` / `ltr:*` utilities.

## [1.1.0] — 2026-04-20

### Added
- Complete **authentication** flow (UI only) — Login, Register,
  Forgot password, Verify email, with a two-column auth layout.
- **Invoices** module — list with KPI strip, status filters, detail
  view with timeline, create-invoice dialog.
- **Calendar** module — monthly grid, agenda list, event creation
  dialog, event detail dialog, agribusiness event mock data.
- **Kanban** board — four columns, drag-and-drop across columns,
  task detail dialog, new-task dialog, filters bar.
- Pricing / billing card in Settings, richer empty states.
- SEO — `app/sitemap.ts`, `app/robots.ts`, dynamic OpenGraph image
  at `app/opengraph-image.tsx`, enriched Twitter + JSON-LD metadata.
- Licenses index — `LICENSES.md` with every dependency + author.
- Changelog file (this document).

### Changed
- Extended the sidebar navigation to include Invoices, Calendar, and
  Board; badges updated.
- `README.md` gained sections for new modules, deployment, licenses.

### Developer experience
- No new runtime dependencies were added; everything is composed
  from primitives already in the template.
- Every new module follows the same i18n-friendly, responsive,
  mock-data-only convention as the core pages.

## [1.0.0] — 2026-04-18

### Added
- Initial release of **AgroDash** — premium agribusiness SaaS
  dashboard template.
- Six primary pages: Dashboard, Products, Orders (+ detail),
  Customers (+ profile), Analytics, Settings.
- Shadcn-style UI primitives: Button, Card, Input, Badge, Dialog,
  Sheet, Dropdown, Select, Tabs, Switch, Progress, Skeleton,
  Tooltip, Avatar, Table, EmptyState, Pagination.
- Dark / light / system theme with persistence.
- English + French i18n with auto-detect.
- Render deployment blueprint + GitHub Actions CI/CD.
- Mobile / tablet / desktop responsive sidebar with keyboard
  shortcuts (`Ctrl + B` to toggle, `Ctrl + K` for search).
- Agribusiness seeded mock data — 20 products, 12 customers,
  28 orders, weekly operations, regional breakdowns.

---

[1.1.0]: https://github.com/Wilfrieddevcreate/Agrodash/releases/tag/v1.1.0
[1.0.0]: https://github.com/Wilfrieddevcreate/Agrodash/releases/tag/v1.0.0
