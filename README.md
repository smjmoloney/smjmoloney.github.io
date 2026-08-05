# Thread Tracker

A mobile-first, offline-friendly personal DMC embroidery thread collection tracker. The app helps its owner see which colours they have, how many full skeins remain, which active skeins are running low, and what they intend to buy elsewhere.

## Current Status

The first functional prototype includes:

- A responsive swatch-card catalogue.
- Search by DMC number or colour name.
- Owned, need-to-buy, and low-stock filters.
- Persistent low-stock and buy-list summaries.
- An IndexedDB-backed editor for full skeins, active-skein status, and notes.
- A private personal buy list with duplicate-purchase warnings.
- Accessible alerts, dialogs, and toast feedback.
- An offline-capable app shell that loads the catalogue after its first visit.
- A range-aware schema ready for additional DMC product ranges.

The catalogue contains 505 Mouliné Spécial inventory colours. DMC's US storefront currently exposes 504 as selectable options; DMC 336 is retained because an inventory tracker should not hide an existing colour merely because it is currently unavailable to purchase. Names and on-screen colours are approximate reference aids for this private, noncommercial tool.

## Technology

- Astro 7
- React 19
- TypeScript
- Tailwind CSS 4
- Radix UI primitives
- Dexie and IndexedDB
- Vite PWA and Workbox

Astro provides the document shell. One hydrated React application owns the interactive catalogue, editor, filters, and local persistence.
The React application is organized as a feature under `src/features/thread-inventory`: presentational components receive typed props, hooks own state and side effects, and pure utilities own stock and filtering rules.
Astro 7's multi-environment build currently prevents Vite PWA from emitting its worker reliably, so the production build runs an explicit Workbox post-build step that generates `dist/sw.js` from the completed static output.

## Commands

Run commands from the repository root:

```sh
npm install
npm run generate:catalogue
npm run dev
npm run check
npm run build
npm run preview
```

`check` runs ESLint, Prettier verification, Astro type checking, and the Vitest suite. See [docs/code-style.md](docs/code-style.md) for the team conventions applied to feature code.

`generate:catalogue` refreshes the checked-in catalogue from DMC's structured US product data and derives approximate display colours from its thread swatch images. Normal builds do not require network access.

The repository development server can also be managed in background mode:

```sh
npx astro dev --background
npx astro dev status
npx astro dev logs
npx astro dev stop
```

## Data Boundaries

Bundled catalogue data is read-only reference data. IndexedDB stores only mutable personal data:

- Inventory records keyed by thread range and exact DMC identifier.
- Personal buy-list items keyed by the same compound identity.

DMC identifiers remain strings so values such as `01`, `White`, `Ecru`, and `B5200` are preserved exactly. Screen swatches are approximate and are never the authoritative colour identifier.

## Remaining Foundation Work

- Generate final standard, maskable, and Apple touch icons.
- Add validated JSON export and preview-and-replace restore.
- Expand unit coverage and add browser tests.
- Verify production installation, offline launch, and persistence on a physical iPhone.
