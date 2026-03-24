# SolAI Dashboard

SolAI Dashboard is a full-stack workflow assistant interface built with React, TypeScript, Vite, and Express.
It is designed to help operators manage client communication, scheduling, and follow-up actions from one screen.

This project focuses on practical execution: clean UI workflows, API-backed actions, and integration-ready architecture.

## Key Functionalities

- Built a responsive 3-column operations dashboard with clear workflow separation.
- Implemented modal-driven automation flows for email composition and scheduling.
- Integrated Supabase-backed client search in scheduling workflows.
- Structured the app as a full-stack TypeScript project with shared API contracts.
- Added deployment-ready support for both Node runtime and Netlify serverless functions.

## What This Product Does

The dashboard centers around three operator surfaces:

- Actions/Emails/Tasks panel (left)
- AI assistant chat + context area (center)
- Time-grouped notifications and event actions (right)

From this interface, users can:

- Send template-based emails
- Schedule meetings by proposing available time options
- Track tasks and follow-up actions
- Manage upcoming event reminders

## Implemented Features

### 1) Action Workspace (Left Panel)

- Tabbed workflow surface: `Actions`, `Emails`, `Tasks`
- Actions tab includes:
  - Send Template Email
  - Schedule Meeting
  - Add Task (UI scaffold)
  - Run Invoice Reminders (UI scaffold)
- Emails tab shows starred email threads with quick actions
- Tasks tab shows to-do list items with status/priority styling and management affordances

### 2) AI Assistant Panel (Center)

- Chat timeline with timestamped messages
- Enter-to-send input handling
- Simulated AI response loop (MVP placeholder for future LLM integration)

### 3) Notifications Panel (Right)

- Event grouping logic by `This Week` and `Later`
- Card actions for:
  - Join meeting (when link exists)
  - Email attendees
  - Snooze reminder
- Dynamic event count badges

### 4) Quick Compose Modal

- Template picker with multiple predefined templates
- Recipient input and variable-based templating
- Live email preview generation
- Optional “Polish with AI” toggle
- Send action with loading state and webhook submission payload

### 5) Calendar Scheduler Modal (Multi-step)

- Client selection with searchable dropdown
- Meeting detail capture (title, duration, notes, max options)
- Multi-date calendar selection
- Working-hours-based slot generation
- Availability checking against existing calendar items (mocked in MVP)
- Review/send flow connected to backend endpoint (`/api/propose-times`)

### 6) Client Search Integration (Supabase)

- Fetches from `client_profiles` table
- Debounced search behavior for smoother UX
- Manual email fallback when no profile match is found
- Loading and error states handled in dropdown

### 7) API Layer (Express)

Available routes:

- `GET /api/ping`
- `GET /api/demo`
- `POST /api/send-template`
- `GET /api/events-today`
- `POST /api/propose-times`
- `POST /api/schedule-followup`
- `POST /api/run-invoice-reminders`
- `POST /api/sync-calendar-events`

These endpoints currently include mock/simulated behavior where external provider integrations are intended next.

## Tech Stack And Tools Used

### Core

- React 18
- TypeScript
- Vite 7
- Express 5
- React Router 6
- Tailwind CSS 3

### UI And UX

- Radix UI primitives
- shadcn/ui component library
- Lucide React icons
- date-fns
- react-day-picker
- clsx + tailwind-merge (`cn` utility)

### Data And Integrations

- Supabase JS client
- n8n-style webhook workflow integration pattern

### Quality And DX

- Vitest
- Prettier
- PostCSS + Autoprefixer
- Path aliases (`@/*`, `@shared/*`)

### Deployment

- Node production server build via Vite
- Netlify function wrapper via `serverless-http`

## Architecture

- `client/`: UI pages, components, hooks, services
- `server/`: Express app and route handlers
- `shared/`: shared TypeScript types
- `netlify/functions/`: serverless adapter entrypoint

Local dev runs frontend + backend on one port using Vite middleware + Express.

## Environment Variables

Required values:

- `PING_MESSAGE`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_PUBLIC_BUILDER_KEY` (scaffold/public key)

## Run Locally

```bash
pnpm install
pnpm dev
```

App runs at `http://localhost:8080`.

## Scripts

```bash
pnpm dev         # dev server (Vite + Express middleware)
pnpm build       # build SPA and server outputs
pnpm start       # run production server
pnpm test        # run unit tests
pnpm typecheck   # TypeScript checks
pnpm format.fix  # format files
```

## What This Shows about Me:

- Ability to design and ship business-facing workflow interfaces.
- Strong full-stack execution across UI, API, and deployment layers.
- Integration-oriented mindset with clear path from mocks to production connectors.
- Organized, extensible codebase ready for team iteration.
