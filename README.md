# Claude App

A full-stack web application with PostgreSQL, Express REST API, and React frontend — including JWT authentication.

## Stack

| Layer    | Technology              |
|----------|-------------------------|
| Database | PostgreSQL 16           |
| Backend  | Node.js v24 + Express 5 |
| Frontend | React + Vite            |
| Auth     | JWT + bcrypt            |

## Project Structure

```
Development/
├── server/                      # Express REST API (port 3001)
│   ├── middleware/
│   │   └── auth.js              # JWT verification middleware
│   ├── routes/
│   │   ├── auth.js              # Register and login routes
│   │   └── users.js             # Users CRUD routes (protected)
│   ├── index.js                 # Entry point and route registration
│   ├── db.js                    # PostgreSQL connection pool
│   └── .env                     # Environment variables (not committed)
├── client/                      # React frontend (port 5173)
│   ├── src/
│   │   ├── api.js               # Fetch helper with JWT header injection
│   │   ├── App.jsx              # App shell — handles auth state
│   │   ├── Login.jsx            # Login and register page
│   │   └── Users.jsx            # Users management UI
│   └── vite.config.js           # Proxies /api -> localhost:3001
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

Register an account to get started. Once signed in you can manage users.

## API Endpoints

### Auth (public)

| Method | Endpoint              | Body                        | Description     |
|--------|-----------------------|-----------------------------|-----------------|
| POST   | /api/auth/register    | `{ name, email, password }` | Create account  |
| POST   | /api/auth/login       | `{ email, password }`       | Sign in         |

### Health (public)

| Method | Endpoint           | Description           |
|--------|--------------------|-----------------------|
| GET    | /api/health        | API health check      |
| GET    | /api/health/db     | Database health check |

### Users (requires Bearer token)

| Method | Endpoint          | Body             | Description    |
|--------|-------------------|------------------|----------------|
| GET    | /api/users        |                  | List all users |
| GET    | /api/users/:id    |                  | Get a user     |
| POST   | /api/users        | `{ name, email }`| Create a user  |
| PUT    | /api/users/:id    | `{ name, email }`| Update a user  |
| DELETE | /api/users/:id    |                  | Delete a user  |

## Database

- **Host:** localhost:5432
- **Database:** appdb
- **User:** appuser
- **Credentials:** stored in `server/.env` (never committed)

### Schema

```sql
CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  created_at    TIMESTAMP DEFAULT NOW()
);
```

## Current State

- JWT authentication — register, login, sign out
- Passwords hashed with bcrypt
- All user routes protected with JWT middleware
- Frontend automatically attaches token to every API request
- Token stored in localStorage; expired tokens trigger automatic sign out
