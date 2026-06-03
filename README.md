
# Social Media App

Full-stack social media app with a React + Vite frontend and a Node.js + Express + MongoDB backend.

## Project Structure

- `src/` — frontend app (auth pages, feed UI, protected routes, contexts)
- `server/` — backend API (auth, users, posts, middleware, models)
- Root docs — setup, architecture, troubleshooting, and migration guides

## Implemented Features

### Frontend
- Login and signup screens
- Protected routes for app pages (`/home`, `/search`, `/reels`, `/findfriends`, `/marketplace`, `/games`)
- API service layer with JWT header injection and refresh-token retry
- Feed and media pages using Pixabay API content

### Backend API
- JWT authentication with refresh token rotation
- Email verification + forgot/reset password endpoints
- User profile fetch/update, search, follow/unfollow
- Posts CRUD-style actions: list, create, delete, like/unlike, comment, search
- Basic health endpoint: `GET /api/health`

## Tech Stack

- Frontend: React 19, Vite, React Router, Axios, React Hook Form, Zod, MUI, Ant Design, Tailwind CSS
- Backend: Node.js, Express, Mongoose, JWT, bcryptjs, express-validator, nodemailer, express-rate-limit
- Database: MongoDB

## Local Setup

### 1) Install dependencies

```bash
# project root
npm install

# backend
cd server
npm install
```

### 2) Configure environment variables

Create `.env` in the project root:

```env
VITE_API_URL=http://localhost:5000/api
VITE_PIXABAY_API_KEY=your_pixabay_api_key
```

Create `server/.env`:

```env
MONGODB_URI=mongodb://localhost:27017/social-media-app
JWT_SECRET=change_me_access_secret
JWT_REFRESH_SECRET=change_me_refresh_secret
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
PORT=5000
NODE_ENV=development

# optional email/reset/verification configuration
APP_URL=http://localhost:5173
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=
APP_DOMAIN=localhost
```

### 3) Run the app

```bash
# terminal 1 (backend)
cd server
npm run dev

# terminal 2 (frontend, project root)
npm run dev
```

Open:
- Frontend: `http://localhost:5173`
- API health: `http://localhost:5000/api/health`

## Scripts

From project root:
- `npm run dev` — start Vite dev server
- `npm run build` — production build
- `npm run preview` — preview production build
- `npm run lint` — run ESLint

From `server/`:
- `npm run dev` — start Express with nodemon
- `npm start` — start Express with node

## API Overview

### Auth
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `GET /api/auth/verify`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

### Users
- `GET /api/users/:userId`
- `PUT /api/users/profile`
- `GET /api/users/search?q=...`
- `POST /api/users/:userId/follow`
- `POST /api/users/:userId/unfollow`

### Posts
- `GET /api/posts`
- `GET /api/posts/search?q=...`
- `POST /api/posts`
- `DELETE /api/posts/:postId`
- `POST /api/posts/:postId/like`
- `POST /api/posts/:postId/unlike`
- `POST /api/posts/:postId/comments`

## Documentation

- [GETTING_STARTED.md](GETTING_STARTED.md)
- [ARCHITECTURE.md](ARCHITECTURE.md)
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- [server/README.md](server/README.md)
- [DOCS_INDEX.md](DOCS_INDEX.md)

## License

See [LICENSE](LICENSE).
