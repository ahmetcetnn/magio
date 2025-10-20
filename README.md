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
	(Note) The previous placeholder API under `/api/dashboard/overview` has been removed.

Develop
```bash
npm run dev
```
Open http://localhost:3000 


