# Social Media App

Full-stack social media application with a React + Vite frontend and a Node.js + Express + MongoDB backend.

## Overview

This project includes:
- User authentication with JWT access and refresh tokens
- Feed-style post creation and listing
- Like and unlike interactions
- User profile and follow/unfollow APIs
- Frontend routing and protected pages

## Tech Stack

Frontend:
- React 19
- Vite
- React Router
- Axios
- MUI + Ant Design

Backend:
- Node.js
- Express
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs

## Project Structure

```text
Social-media-app/
|-- src/                    # Frontend app
|   |-- components/
|   |-- context/
|   |-- pages/
|   |-- routes/
|   `-- services/api.js
|-- server/                 # Backend API
|   |-- middleware/
|   |-- models/
|   |-- routes/
|   |-- index.js
|   `-- README.md
|-- public/
|-- package.json
`-- README.md
```

## Prerequisites

- Node.js 18+
- npm
- MongoDB (local, Docker, or Atlas)

## Quick Start

1. Install frontend dependencies from the project root:

```bash
npm install
```

2. Install backend dependencies:

```bash
cd server
npm install
```

3. Configure backend environment in `server/.env`:

```env
MONGODB_URI=mongodb://localhost:27017/social-media-app
JWT_SECRET=change_me_access_secret
JWT_REFRESH_SECRET=change_me_refresh_secret
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
PORT=5000
NODE_ENV=development
```

4. Configure frontend environment in `.env` at the project root:

```env
VITE_API_URL=http://localhost:5000/api
VITE_PIXABAY_API_KEY=your_pixabay_api_key
```

5. Start backend (terminal 1):

```bash
cd server
npm run dev
```

6. Start frontend (terminal 2):

```bash
npm run dev
```

7. Open the app:

- Frontend: http://localhost:5173
- Backend health: http://localhost:5000/api/health

## Available Scripts

Frontend (project root):
- `npm run dev` - Start Vite dev server
- `npm run build` - Build production bundle
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

Backend (`server/`):
- `npm run dev` - Start API with nodemon
- `npm start` - Start API with node

## API Base URL

Set frontend API target with:

```env
VITE_API_URL=http://localhost:5000/api
```

The frontend service layer expects:
- `/auth/*`
- `/posts/*`
- `/users/*`

## Notes

- Do not commit real secrets or database credentials.
- Rotate JWT secrets for production deployments.
- Update CORS and environment settings before deploying.

## Documentation

- Backend details: `server/README.md`
- Setup checklist: `GETTING_STARTED.md`
- Troubleshooting: `TROUBLESHOOTING.md`
- JWT migration details: `JWT_MIGRATION_GUIDE.md`

