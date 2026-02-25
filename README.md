# Claude App

A full-stack web application with PostgreSQL, Express REST API, and React frontend — including JWT authentication and company search via the Norwegian Business Registry.

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
│   │   ├── users.js             # Users CRUD routes (protected)
│   │   └── companies.js         # Company search and saved companies routes (protected)
│   ├── index.js                 # Entry point and route registration
│   ├── db.js                    # PostgreSQL connection pool
│   └── .env                     # Environment variables (not committed)
├── client/                      # React frontend (port 5173)
│   ├── src/
│   │   ├── api.js               # Fetch helper with JWT header injection
│   │   ├── App.jsx              # App shell — auth state and page navigation
│   │   ├── Login.jsx            # Login and register page
│   │   ├── Users.jsx            # Users management UI
│   │   ├── Companies.jsx        # Company search and saved companies UI
│   │   ├── index.css            # Global stylesheet — CSS custom properties
│   │   └── App.css              # App-level styles
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

Register an account to get started. Use the navigation in the header to switch between pages.

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

| Method | Endpoint          | Body              | Description    |
|--------|-------------------|-------------------|----------------|
| GET    | /api/users        |                   | List all users |
| GET    | /api/users/:id    |                   | Get a user     |
| POST   | /api/users        | `{ name, email }` | Create a user  |
| PUT    | /api/users/:id    | `{ name, email }` | Update a user  |
| DELETE | /api/users/:id    |                   | Delete a user  |

### Companies (requires Bearer token)

| Method | Endpoint                    | Body        | Description                        |
|--------|-----------------------------|-------------|------------------------------------|
| GET    | /api/companies/search?q=    |             | Search brreg.no by name or org. no.|
| GET    | /api/companies              |             | List saved companies               |
| POST   | /api/companies              | company obj | Save a company to the database     |
| DELETE | /api/companies/:id          |             | Remove a saved company             |

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

CREATE TABLE companies (
  id            SERIAL PRIMARY KEY,
  org_number    VARCHAR(20) UNIQUE NOT NULL,
  name          VARCHAR(255) NOT NULL,
  org_form      VARCHAR(100),
  industry      VARCHAR(255),
  address       VARCHAR(255),
  postal_code   VARCHAR(10),
  city          VARCHAR(100),
  municipality  VARCHAR(100),
  employees     INT,
  founded       DATE,
  saved_at      TIMESTAMP DEFAULT NOW()
);
```

## Current State

- JWT authentication — register, login, sign out with confirmation dialog
- Passwords hashed with bcrypt; all routes protected with JWT middleware
- Company search via brreg.no (Brønnøysundregistrene) — by name or org. number
- Search results displayed in table; single click to save to database
- Saved companies persisted in PostgreSQL with remove option
- Page navigation in header — Users and Companies pages
- Global CSS stylesheet with custom properties — clean light theme, no CSS framework
