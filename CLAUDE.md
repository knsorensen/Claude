# CLAUDE.md

This file provides context and instructions for Claude Code when working in this repository.

## Project

- **Name:** Claude App
- **Repo:** github.com/knsorensen/Claude
- **Branch:** main
- **Remote:** SSH (`git@github.com:knsorensen/Claude.git`)

## Stack

| Layer    | Technology              |
|----------|-------------------------|
| Database | PostgreSQL 16           |
| Backend  | Node.js v24 + Express 5 |
| Frontend | React + Vite            |
| Auth     | JWT (jsonwebtoken) + bcrypt |

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
│   │   ├── api.js               # Fetch helper — injects Bearer token automatically
│   │   ├── App.jsx              # App shell — manages auth state and logout confirmation dialog
│   │   ├── Login.jsx            # Login and register page
│   │   ├── Users.jsx            # Users management UI (CRUD)
│   │   ├── index.css            # Global stylesheet — CSS custom properties, all shared styles
│   │   └── App.css              # App-level styles (minimal)
│   └── vite.config.js           # Proxies /api -> localhost:3001
├── .gitignore
├── README.md
└── CLAUDE.md
```

## Local Development

**Start the backend:**
```bash
cd server && npm run dev
```

**Start the frontend:**
```bash
cd client && npm run dev
```

## Database

- **Host:** localhost:5432
- **Database:** appdb
- **User:** appuser
- **Password:** apppassword (in `server/.env`, never committed)

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

## API Endpoints

### Auth (public)
- `POST /api/auth/register` — `{ name, email, password }` → `{ token, user }`
- `POST /api/auth/login` — `{ email, password }` → `{ token, user }`

### Health (public)
- `GET /api/health` — API health check
- `GET /api/health/db` — Database health check

### Users (Bearer token required)
- `GET    /api/users` — List all users
- `GET    /api/users/:id` — Get a user
- `POST   /api/users` — `{ name, email }` → create user
- `PUT    /api/users/:id` — `{ name, email }` → update user
- `DELETE /api/users/:id` — Delete a user

## Auth Flow

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens expire after 7 days
- Token stored in `localStorage` on the frontend
- `client/src/api.js` (`apiFetch`) injects `Authorization: Bearer <token>` on every request
- 401 responses from the API trigger automatic sign out on the frontend

## Conventions

- New routes go in `server/routes/` and are registered in `server/index.js`
- Protect routes by adding `requireAuth` middleware from `server/middleware/auth.js`
- Frontend components go in `client/src/`
- Always use `apiFetch` (not raw `fetch`) for authenticated API calls in the frontend
- All styles go in `client/src/index.css` using CSS custom properties — no inline styles, no CSS framework
- Use CSS classes defined in `index.css`; component-scoped styles go in a matching `.module.css` file if needed
- Always use parameterised queries (`$1, $2`) — never string-interpolate SQL
- Never expose `password_hash` in API responses — use explicit column selects
- `.env` files are gitignored — never commit secrets

## Git Workflow

- Commit with descriptive messages
- Push to `origin main` after committing
- Do not amend published commits

## Preferences

- Keep code simple, avoid over-engineering
- No emojis in files or commit messages
- Ask before any destructive git operations

## Environment

- OS: Linux (Ubuntu)
- Shell: bash
- Node.js: v24.14.0 (via nvm)
- SSH key: `~/.ssh/id_ed25519` (ed25519, post@k-sorensen.com)

## Notes

- CLAUDE.md is updated continuously as the project evolves
- README.md is the public-facing doc; CLAUDE.md is for Claude Code context
