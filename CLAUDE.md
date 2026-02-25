# CLAUDE.md

This file provides context and instructions for Claude Code when working in this repository.

## Project

- **Repo:** github.com/knsorensen/Claude
- **Branch:** main
- **Remote:** SSH (`git@github.com:knsorensen/Claude.git`)

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
- **Password:** apppassword (stored in server/.env, never committed)

## Git Workflow

- Always commit with descriptive messages
- Push to `origin main` after committing
- Do not amend published commits

## Preferences

- Keep code simple and avoid over-engineering
- No emojis in files or commit messages
- Ask before any destructive git operations (force push, reset --hard, etc.)

## Environment

- OS: Linux (Ubuntu)
- Shell: bash
- Node.js: v24.14.0 (via nvm)
- SSH key: `~/.ssh/id_ed25519` (ed25519, post@k-sorensen.com)

## Notes

- CLAUDE.md is updated continuously as the project evolves
- `.env` files are gitignored — never commit secrets
