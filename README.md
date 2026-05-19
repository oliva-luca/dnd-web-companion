# dnd-web-companion

A small React + TypeScript web app to manage characters and inventories for tabletop RPGs. Uses Vite as dev server/bundler and connects to Supabase for persistent storage.

This project is intentionally minimal and modular — components live under `src/components` and state-fetching hooks under `src/hooks`.

## Features
- List characters (fetched from Supabase)
- Select a character to view their inventory
- Paginated / grouped display of items by category
- Local mocks available for development
- Supabase client integration (configured via Vite env)

## Prerequisites
- Node.js (>= 18 recommended)
- pnpm (recommended) or npm/yarn
- A Supabase project (URL and anon key)

## Setup
1. Install dependencies

```bash
pnpm install
```

2. Create a `.env` in the project root (a template is already present). Set these variables with your Supabase project values:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Vite uses `import.meta.env` so these must be prefixed with `VITE_`.

## Run (development)

```bash
pnpm run dev
```

Open your browser at http://localhost:5173 (or the URL Vite prints).

## Project structure (important files)

- `index.html` — app entry
- `public/` — static assets and global `style.css`
- `src/main.tsx` — root React component
- `src/components/ItemsList.tsx` — inventory UI
- `src/components/JugadoresList.tsx` — characters list UI
- `src/hooks/useCharacters.ts` — hook that fetches characters + inventories from Supabase
- `src/supabaseClient.ts` — Supabase client (uses `import.meta.env`)
- `src/types.ts` — shared TypeScript types
- `src/data.ts` — mocks (useful for offline dev)

## Debugging tips
- Console debug logs are added in `useCharacters` and `ItemsList` to help inspect raw Supabase responses and mapped objects.
- The UI shows a small counter "Cargados: N" in the top-left to indicate how many characters were loaded.
- Use the "Refrescar" button to re-run the query.

## How to add features
- Prefer adding data fetching logic to `src/hooks` as reusable hooks (e.g. `useCharacters`).
- Put UI components under `src/components` with a paired CSS file for modular styles.
- Keep the Supabase client in `src/supabaseClient.ts` and do not store secrets in the repo.

## To do
- [ ] Add UI for viewing/editing item details (notes, equip status, amount)
- [ ] Add UI for creating item
- [ ] Implement authentication (Supabase Auth) and secure RLS policies
- [ ] Add a small seed SQL script to create example tables and rows for local testing

---
