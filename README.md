This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### On a new machine

1. Install Node.js and npm
2. Open PowerShell in the project root
3. Run:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\setup-dev.ps1
```

This installs the frontend and API dependencies, then starts the web app and the API together.

### Manual start

If you prefer to start things manually:

```bash
npm install
npm --prefix barbieri_api install
npm run dev:all
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment setup

The project reads its runtime settings from `.env` and `.env.local`.
Make sure the database values are valid for the target machine before starting the API.

## Notes

- The frontend runs on port `3000`
- The API runs on port `3001`
- The API expects a MySQL database reachable through the values in the environment file

## Project structure

- `src/` — Next.js frontend
- `barbieri_api/` — Express API
- `scripts/` — helper scripts for setup and startup
