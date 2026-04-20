# Changelog

All notable changes to this template are documented here. This project
follows [Semantic Versioning](https://semver.org) and keeps a
[Keep a Changelog](https://keepachangelog.com) style history.

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
