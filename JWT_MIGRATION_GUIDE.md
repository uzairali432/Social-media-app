# JWT Authentication with MongoDB - Migration Guide

This document describes the changes made to implement JWT authentication with MongoDB in your social media app.

## Overview

The authentication system has been migrated from **localStorage-based local authentication** to **JWT (JSON Web Token) based authentication** with MongoDB as the database.

## What Changed

### Frontend Changes

#### 1. **API Service Layer** (`src/services/api.js`)
- Created a centralized axios instance for all API calls
- Implemented automatic token attachment to requests
- Added token refresh interceptor for handling expired tokens
- Organized all API endpoints (auth, posts, users)

#### 2. **Auth Context** (`src/context/AuthContext.jsx`)
- Stores JWT token instead of accounts list
- Automatically fetches current user on app load
- Manages authentication state with token
- Added loading state for auth checks

#### 3. **Auth Reducer** (`src/reducer/AuthReducer.jsx`)
- Updated to work with JWT tokens
- Stores user info with token
- Removed localStorage account storage
- Added `SET_USER` and `UPDATE_USER` actions

#### 4. **Login Page** (`src/pages/auth/Login.jsx`)
- Calls backend API instead of local validation
- Shows loading state during login
- Improved error handling

#### 5. **SignUp Form** (`src/components/Form.jsx`)
- Calls backend API for user registration
- Validates against backend rules
- Shows loading state during signup
- Improved error messages

#### 6. **Environment Configuration** (`.env`)
- Added `VITE_API_URL` pointing to backend server

### Backend Setup

Complete Node.js/Express backend with:
- **Express.js** - Web framework
- **MongoDB** - Database
- **JWT** - Token-based authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests

#### Backend Structure

```
server/
├── index.js                 # Main server file
├── package.json            # Dependencies
├── .env                    # Environment variables
├── models/
│   ├── User.js            # User schema
│   └── Post.js            # Post schema
├── routes/
│   ├── auth.js            # Authentication endpoints
│   ├── posts.js           # Posts endpoints
│   └── users.js           # Users endpoints
├── middleware/
│   └── auth.js            # JWT verification middleware
└── README.md              # Backend documentation
```

## How to Use

### 1. Install Backend Dependencies

```bash
cd server
npm install
```

### 2. Set Up MongoDB

Install MongoDB locally or use Docker:

```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo
```

### 3. Configure Environment Variables

Update `server/.env`:
```
MONGODB_URI=mongodb://localhost:27017/social-media-app
JWT_SECRET=your_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_key_here
PORT=5000
```

### 4. Start the Backend Server

```bash
cd server
npm run dev  # Development with nodemon
# or
npm start    # Production
```

### 5. Start the Frontend

In another terminal:
```bash
npm run dev
```

The frontend will automatically connect to `http://localhost:5000/api`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/:userId` - Get user profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/:userId/follow` - Follow user
- `POST /api/users/:userId/unfollow` - Unfollow user

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create post
- `DELETE /api/posts/:postId` - Delete post
- `POST /api/posts/:postId/like` - Like post
- `POST /api/posts/:postId/unlike` - Unlike post

## Key Features

### Token Management
- **Access Token**: 15-minute expiration (configurable)
- **Refresh Token**: 7-day expiration (configurable)
- Automatic token refresh on expired token
- Tokens stored in localStorage

### Security
- Passwords hashed with bcryptjs
- JWT tokens signed with secret keys
- Request authorization via Bearer tokens
- CORS enabled for frontend requests

### User Features
- User registration and login
- Profile management
- Follow/unfollow users
- Create, like, and delete posts

## Migration Notes

- All user accounts stored locally (localStorage) are lost - users must sign up again
- The app is now fully dependent on the backend server
- Ensure MongoDB is running before starting the backend
- Update `VITE_API_URL` if hosting backend on different URL

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED
```
**Solution**: Ensure MongoDB is running on port 27017

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution**: Ensure backend server is running and `VITE_API_URL` is correct

### Token Expired
The app automatically refreshes tokens. If still getting 401 errors:
- Clear localStorage: `localStorage.clear()`
- Log out and log back in

### Backend Not Starting
- Check if port 5000 is in use: `lsof -i :5000`
- Install dependencies: `npm install` in server folder
- Check `.env` file is in `server/` folder

## Next Steps

1. Deploy MongoDB (Atlas, self-hosted, etc.)
2. Deploy backend (Heroku, AWS, DigitalOcean, etc.)
3. Update `VITE_API_URL` for production
4. Change JWT secrets to strong random strings
5. Enable HTTPS in production
6. Implement rate limiting
7. Add email verification
8. Add password reset functionality
