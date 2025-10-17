MagIo Dashboard implements a responsive, accessible finance overview page with real API wiring ready.

Features
- TanStack React Query for API fetching with loading/success/error states
- Recharts line chart with hover tooltip
- Toast notifications for success and errors
- Currency/date i18n formatting using Intl.NumberFormat and currency.js via a Settings context
- Modular components with semantic HTML and Tailwind CSS
- Error boundary and route-level error/loading UI

Routes
- `/dashboard` main page (home redirects here)
- `/api/dashboard/overview` placeholder API returning empty structures; replace with real backend soon

Develop
```bash
npm run dev
```
Open http://localhost:3000 and you should land on the Dashboard.

Notes
- Change locale/currency defaults inside `src/providers/settings-context.tsx` when needed.
- Replace data source by editing `src/app/api/dashboard/overview/route.ts` or calling your backend.
