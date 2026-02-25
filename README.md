# Claude App

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
├── server/                  # Express REST API (port 3001)
│   ├── routes/
│   │   └── users.js         # Users CRUD routes
│   ├── index.js             # Entry point and route registration
│   ├── db.js                # PostgreSQL connection pool
│   └── .env                 # Environment variables (not committed)
├── client/                  # React frontend (port 5173)
│   ├── src/
│   │   ├── App.jsx          # App shell with header
│   │   └── Users.jsx        # Users management UI
│   └── vite.config.js       # Proxies /api -> localhost:3001
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

### Health

| Method | Endpoint         | Description           |
|--------|------------------|-----------------------|
| GET    | /api/health      | API health check      |
| GET    | /api/health/db   | Database health check |

### Users

| Method | Endpoint         | Description       |
|--------|------------------|-------------------|
| GET    | /api/users       | List all users    |
| GET    | /api/users/:id   | Get a user        |
| POST   | /api/users       | Create a user     |
| PUT    | /api/users/:id   | Update a user     |
| DELETE | /api/users/:id   | Delete a user     |

## Database

- **Host:** localhost:5432
- **Database:** appdb
- **User:** appuser
- **Credentials:** stored in `server/.env` (never committed)

### Schema

```sql
CREATE TABLE users (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Current State

- Full-stack connected: React frontend -> Express API -> PostgreSQL
- Users management UI with create, edit, and delete
- Inline error handling for duplicate emails and missing fields
