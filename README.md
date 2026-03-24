# SolAI Dashboard

A full-stack AI operations dashboard prototype built with React + TypeScript + Express, focused on business workflow automation: templated outreach, intelligent meeting scheduling, client lookup, and assistant-first task handling.

This project demonstrates practical product engineering skills across frontend UX, API design, integration architecture, and deployment-ready setup.

## Key Components

- Built a multi-pane, responsive dashboard UX with modal-driven workflows for real business operations.
- Implemented end-to-end flows for templated email composition, meeting slot generation, and follow-up automation.
- Integrated a real Supabase client-data lookup experience (search + fallback manual entry).
- Structured a full-stack TypeScript codebase with shared types, local API layer, and serverless deployment support.
- Designed for integration with external automation systems (n8n webhooks, Google Calendar/Sheets patterns).
- Added maintainable design-system foundations using Radix + shadcn/ui + Tailwind tokenized theming.

## What The Product Does

SolAI Dashboard is designed as an AI copilot for service businesses and client-facing teams. It centralizes:

- Action execution (send outreach, schedule meetings, run reminders)
- Context awareness (emails, calendar events, notifications)
- Lightweight conversational assistance
- Workflow orchestration via APIs/webhooks

## Implemented Features

### 1) Dashboard Workspace (3-column layout)

- Left panel: Quick Actions
- Center panel: AI chat + recent starred emails
- Right panel: time-aware notifications (`This Week` vs `Later`)
- Responsive ordering for mobile and desktop layouts

### 2) AI Assistant Chat Panel (MVP)

- Chat timeline with timestamped messages
- Enter-to-send interaction and send button state handling
- Simulated assistant response loop (clearly marked in code for future LLM replacement)

### 3) Quick Compose Modal

- Template selection from predefined outbound email templates
- Dynamic variable interpolation (`{recipientFirst}`, `{senderFirst}`, etc.)
- Live subject/body preview before sending
- Optional “Polish with AI” toggle for future LLM-enhanced copy
- Submission wired to webhook endpoint (`send-template`) with payload shaping

### 4) Meeting Scheduler Modal (Multi-step Wizard)

- Client selection via searchable dropdown (Supabase-backed)
- Meeting metadata capture (title, duration, notes, max options)
- Multi-date selection calendar with past-date blocking
- Automatic time-slot generation within working-hour windows
- Availability conflict checks against existing events (mocked for MVP)
- Time-slot editing, add/remove controls, and status badges
- Final review step with generated email preview
- Proposal submission to backend endpoint (`/api/propose-times`)

### 5) Client Directory Lookup

- Fetches client profiles from Supabase table (`client_profiles`)
- Debounced search for fast UX and reduced query churn
- Graceful fallback: use typed value as custom email when no match exists
- Loading/error states and accessible command-style selection UI

### 6) Notifications and Event Handling

- Event grouping logic by date window (current week vs later)
- Action affordances for joining calls, emailing attendees, and snoozing reminders
- Badge counts derived from computed event buckets

### 7) Email Workflow Surface

- Recent starred email list with sender identity, preview, and follow-up actions
- Follow-up placeholders in UI and API stubs for scheduling automation

### 8) API Layer (Express)

Implemented API routes:

- `GET /api/ping`
- `GET /api/demo`
- `POST /api/send-template`
- `GET /api/events-today`
- `POST /api/propose-times`
- `POST /api/schedule-followup`
- `POST /api/run-invoice-reminders`
- `POST /api/sync-calendar-events`

These routes currently use mock data or simulated behavior where production integrations are planned.

### 9) Deployment-Ready App Structure

- Vite dev server with integrated Express middleware (single-port local dev)
- Separate production server build output (`dist/server`) and SPA output (`dist/spa`)
- Netlify function wrapper for API routing in serverless deployments

### 10) Design System Foundation

- Tailwind CSS token-based theme variables (light/dark-ready)
- shadcn/ui + Radix primitives for scalable component composition
- Reusable utility + hooks (`cn`, toast hooks, mobile hook)
- Large reusable UI component inventory available for rapid iteration

## Product Vision Captured In Screenshots

The provided screenshots point to a broader direction beyond the current route implementation:

- Service integration grid (Telegram, Gmail, X, Instagram, Facebook, Drive, Calendar, Supabase)
- Analytics cards (workflow performance, success rate, execution frequency)
- Market intelligence panel and KPI strip
- Expanded assistant workspace with voice mode toggles and tool shortcuts
- Light/dark mode visual system and “professional mode” assistant framing

This README separates **implemented code** from **product direction** so you can clearly see what is shipped today and what is intentionally staged next.

## Tech Stack And Tools Used

### Core Stack

- React 18
- TypeScript
- Vite 7
- Express 5
- React Router 6 (SPA)
- Tailwind CSS 3

### UI And Frontend Tooling

- Radix UI primitives
- shadcn/ui component system
- Lucide React icons
- class-variance-authority
- clsx + tailwind-merge (`cn` utility)
- react-day-picker (calendar)
- date-fns (date formatting)
- @tanstack/react-query (provider wired, ready for query usage expansion)

### Data, Automation, Integrations

- Supabase JS client (`client_profiles` read/search)
- n8n webhook pattern for template-email automation
- Google Calendar/Sheets integration contracts modeled in API endpoints

### Quality, Build, DX

- Vitest (unit tests in project)
- Prettier
- PostCSS + Autoprefixer
- Type aliases (`@/*`, `@shared/*`)
- PNPM lockfile + npm compatibility scripts

### Deployment

- Netlify function adapter (`serverless-http`)
- Production Node server build via Vite server config

## Architecture Overview

- `client/`: SPA UI, modals, workflow components, services
- `server/`: Express API handlers and production server bootstrap
- `shared/`: cross-layer TypeScript interfaces
- `netlify/functions/`: serverless entrypoint adapter for API routing

Local development runs frontend and API together through Vite + Express middleware for fast iteration.

## Environment Variables

Create a `.env` with:

- `PING_MESSAGE`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_PUBLIC_BUILDER_KEY` (template/scaffold key)

Note: keep private secrets out of frontend-exposed `VITE_*` variables unless intended to be public.

## Run Locally

```bash
pnpm install
pnpm dev
```

App runs on `http://localhost:8080`.

## Scripts

```bash
pnpm dev         # start Vite + integrated Express middleware
pnpm build       # build SPA + server
pnpm start       # run production server build
pnpm test        # run Vitest suite
pnpm typecheck   # TypeScript checks
pnpm format.fix  # format codebase
```

## Testing

Current test coverage includes utility behavior (`cn` class merge helper) via Vitest. The structure is set up to expand into component and API tests.


## Next High-Impact Improvements

- Replace mock assistant responses with real LLM orchestration
- Add authentication + role-based workspace data
- Persist tasks/emails/events to database-backed state
- Expand automated test coverage for scheduling and webhook flows
- Wire screenshot-level analytics and voice-mode experiences into routed pages
