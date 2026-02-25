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
- **Password:** apppassword (stored in `server/.env`, never committed)

### Schema

```sql
CREATE TABLE users (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## API Endpoints

### Health
- `GET /api/health` — API health check
- `GET /api/health/db` — Database health check

### Users
- `GET    /api/users` — List all users
- `GET    /api/users/:id` — Get a user
- `POST   /api/users` — Create a user `{ name, email }`
- `PUT    /api/users/:id` — Update a user `{ name, email }`
- `DELETE /api/users/:id` — Delete a user

## Conventions

- New routes go in `server/routes/` and are registered in `server/index.js`
- Frontend components go in `client/src/`
- Use inline styles in React components (no CSS framework)
- Always use parameterised queries (`$1, $2`) — never string-interpolate SQL
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
