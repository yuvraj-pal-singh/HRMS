# HRMS Frontend

Dark industrial-modern React dashboard for the HRMS backend.

## Stack

- React 18 (JavaScript, no TypeScript)
- Vite 5
- React Router v6
- Recharts
- Lucide React icons
- date-fns
- Custom CSS (no Tailwind, no UI library)

## Setup

```bash
npm install
```

Create a `.env` file:

```
VITE_API_BASE_URL=https://your-backend.onrender.com
```

```bash
npm run dev      # development
npm run build    # production build
npm run preview  # preview production build
```

## Vercel Deployment

1. Push to GitHub
2. Import in Vercel
3. Add environment variable:
   - `VITE_API_BASE_URL` → your backend URL
4. Deploy

The `vercel.json` handles SPA routing (no 404 on refresh).

## Pages

- `/` — Dashboard with stats, pie chart, bar chart
- `/employees` — List, add, delete employees
- `/attendance` — Select employee, filter by date, mark attendance

## API Endpoints Used

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/employees/` | List employees |
| POST | `/employees/` | Create employee |
| DELETE | `/employees/{id}` | Delete employee |
| GET | `/attendance/{employeeId}` | Get attendance |
| POST | `/attendance/` | Mark attendance |
| GET | `/dashboard/stats` | Dashboard stats |
