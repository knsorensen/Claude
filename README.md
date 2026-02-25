# Claude

A full-stack web application with a PostgreSQL database, Express REST API, and React frontend.

## Stack

| Layer    | Technology              |
|----------|-------------------------|
| Database | PostgreSQL 16           |
| Backend  | Node.js v24 + Express 5 |
| Frontend | React + Vite            |

## Project Structure

```
Development/
├── server/        # Express REST API (port 3001)
│   ├── index.js   # Entry point and route definitions
│   ├── db.js      # PostgreSQL connection pool
│   └── .env       # Environment variables (not committed)
├── client/        # React frontend (port 5173)
│   ├── src/
│   │   └── App.jsx     # Main app — fetches and displays API status
│   └── vite.config.js  # Proxies /api -> localhost:3001
├── .gitignore
├── README.md
└── CLAUDE.md
```

## Getting Started

**1. Start the backend:**
```bash
cd server && npm run dev
```

**2. Start the frontend:**
```bash
cd client && npm run dev
```

**3. Open in browser:** `http://localhost:5173`

## API Endpoints

| Method | Endpoint          | Description              |
|--------|-------------------|--------------------------|
| GET    | /api/health       | API health check         |
| GET    | /api/health/db    | Database health check    |

## Database

- **Host:** localhost:5432
- **Database:** appdb
- **User:** appuser
- **Credentials:** stored in `server/.env` (never committed)

## Current State

- Frontend connected to backend API via Vite proxy
- Health status for API and database displayed on the homepage
- End-to-end stack verified and working locally
