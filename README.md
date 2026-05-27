# ChurchPresent

Lightweight worship presentation software for churches — inspired by ProPresenter but simpler, modern, and open.

## Tech Stack

- **Next.js 15** App Router + TypeScript
- **TailwindCSS** — dark-first design system
- **Zustand** — global state management
- **Supabase** — database (ready to connect)
- **Socket.io** — realtime sync (ready to wire)
- **shadcn/ui** — UI primitives

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — redirects to `/control`

## Pages

| Route | Description |
|-------|-------------|
| `/control` | Main operator dashboard |
| `/songs` | Song library — search, filter, present |
| `/songs/new` | Add a new song with lyrics editor |
| `/bible` | Bible search — KJV, verse/keyword lookup |
| `/service` | Service flow builder with drag-drop |
| `/media` | Media library — images, videos, loops |
| `/settings` | App configuration |
| `/output` | **Fullscreen audience display** (open in second screen) |
| `/stage` | **Stage confidence monitor** (open for performers) |

## Architecture

```
stores/           # Zustand state (presentation, songs, service, bible, stage)
types/            # Shared TypeScript types
lib/
  lyrics/parser   # Auto-split lyrics into slides by section
  supabase/       # DB client (ready to configure)
  socket/         # Socket.io events map
components/
  layout/         # AppShell, Sidebar, BottomBar, RightPanel
  songs/          # Song CRUD components
  presentation/   # Slide renderer
  stage/          # Stage display widgets
  service/        # Service flow builder
  bible/          # Bible search
  media/          # Media library
app/              # Next.js routes
```

## Supabase Setup

1. Create a project at supabase.com
2. Copy your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Create a `.env.local` file:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```
4. Run the SQL migration in `supabase/migrations/0001_initial_schema.sql`

## Roadmap

- [x] Phase 1: Project foundation, routing, design system
- [x] Phase 2: Song library with lyrics auto-parser
- [x] Phase 3: Presentation output engine (`/output`)
- [x] Phase 4: Stage display (`/stage`)
- [x] Phase 5: Bible module with verse search
- [x] Phase 6: Service flow builder
- [x] Phase 7: Media library
- [ ] Phase 8: Socket.io realtime sync
- [ ] Phase 9: Supabase persistence
- [ ] Phase 10: Theme editor + templates
