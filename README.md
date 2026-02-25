# Claude

A full-stack web application project.

## Stack

| Layer    | Technology              |
|----------|-------------------------|
| Database | PostgreSQL 16           |
| Backend  | Node.js v24 + Express 5 |
| Frontend | React (Vite)            |

## Project Structure

```
Development/
├── server/        # Express REST API (port 3001)
│   ├── index.js   # Entry point
│   ├── db.js      # PostgreSQL connection pool
│   └── .env       # Environment variables (not committed)
├── client/        # React frontend (port 5173)
│   └── vite.config.js  # Proxies /api -> localhost:3001
├── .gitignore
├── README.md
└── CLAUDE.md
```

## Getting Started

**Start the backend:**
```bash
cd server && npm run dev
```

**Start the frontend:**
```bash
cd client && npm run dev
```

Then open `http://localhost:5173` in your browser.

## Database

- **Host:** localhost:5432
- **Database:** appdb
- **User:** appuser
