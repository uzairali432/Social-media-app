
# Social Media App

Lightweight full-stack social media application with a Vite + React frontend and a Node.js + Express + MongoDB backend.

## What This Repo Contains

- Frontend: React (Vite) app in `src/` with routing, contexts, and UI components.
- Backend: Express API in `server/` with auth, posts, and user routes.
- Utilities: shared constants, validation schemas, and helpers.

## Key Features

- JWT-based authentication (access + refresh tokens)
- Create, edit, and list posts (feed-style)
- Like/unlike posts
- Follow/unfollow users and basic profile APIs
- Protected routes on the frontend

## Tech Stack

- Frontend: React, Vite, React Router, Axios, MUI/Ant Design
- Backend: Node.js, Express, MongoDB (Mongoose), jsonwebtoken, bcryptjs

## Quick Setup

Follow these steps to run the app locally. The commands assume Windows PowerShell or a POSIX shell where noted.

1) Install dependencies (project root)

```powershell
npm install
```

2) Install backend deps and create env (server)

```powershell
cd server
npm install
copy NUL .env  # Windows: creates empty .env file
```

Create `server/.env` with at minimum:

```env
MONGODB_URI=mongodb://localhost:27017/social-media-app
JWT_SECRET=change_me_access_secret
JWT_REFRESH_SECRET=change_me_refresh_secret
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
PORT=5000
NODE_ENV=development
```

3) Create frontend env (project root)

```powershell
copy NUL .env
```

Add to the project root `.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_PIXABAY_API_KEY=your_pixabay_api_key
```

4) Run the backend

```powershell
cd server
npm run dev
```

5) Run the frontend (from project root)

```powershell
npm run dev
```

6) Open the app

- Frontend: http://localhost:5173
- API health: http://localhost:5000/api/health

## NPM Scripts

- `npm run dev` — Start frontend Vite dev server (project root)
- `npm run build` — Build frontend for production
- `npm run preview` — Preview built frontend
- `npm run lint` — Run ESLint

Backend (`server/`) scripts:
- `npm run dev` — Start Express server with `nodemon`
- `npm start` — Start Express server with `node`

## Environment Variables (summary)

- Server: `server/.env`
	- `MONGODB_URI` — MongoDB connection string
	- `JWT_SECRET`, `JWT_REFRESH_SECRET` — secrets for tokens
	- `JWT_EXPIRE`, `JWT_REFRESH_EXPIRE` — token lifetimes
	- `PORT` — backend port (default 5000)

- Frontend: project root `.env`
	- `VITE_API_URL` — API base URL (e.g. `http://localhost:5000/api`)
	- `VITE_PIXABAY_API_KEY` — optional image provider key

## Development Notes

- Do not commit real secrets. Use CI/CD or secret management for production.
- Rotate JWT secrets and review token lifetimes before deployment.
- Confirm CORS settings in `server/index.js` when deploying cross-origin.

## Useful Links

- Backend README: [server/README.md](server/README.md)
- Setup checklist: [GETTING_STARTED.md](GETTING_STARTED.md)
- Troubleshooting: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- JWT migration guide: [JWT_MIGRATION_GUIDE.md](JWT_MIGRATION_GUIDE.md)

## Contributing

Contributions are welcome. Create issues or PRs, follow existing code style, and add tests where applicable.

## License

See the project `LICENSE`.


