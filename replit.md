# PharmacyPal

A clinical pharmacy decision-support tool for OTC safety screening, drug recommendations, and referral guidance.

## Stack

- **Frontend**: React + TypeScript (Vite)
- **UI**: shadcn/ui (Radix UI + Tailwind CSS)
- **Routing**: wouter
- **Data fetching**: TanStack Query
- **Drug data**: NLM RxNav API (public, no key required)

## Running the app

```bash
npm run dev
```

Runs on port 5000. Use the "Start application" workflow in Replit.

## Structure

- `src/pages/dashboard.tsx` — main dashboard (patient profile, symptoms, conditions, medications)
- `src/components/` — UI components
- `src/hooks/` — custom React hooks
- `src/lib/` — utilities and query client

## User preferences

<!-- Add user preferences here as they are noted -->
