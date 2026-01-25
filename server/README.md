# Social Media App Backend

A Node.js/Express backend server with MongoDB and JWT authentication for the Social Media App.

## Features

- User authentication with JWT
- User registration and login
- Token refresh mechanism
- User profiles with followers/following
- Posts creation and management
- Like/unlike posts
- User search
- Follow/unfollow users

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4 or higher)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```
MONGODB_URI=mongodb://localhost:27017/social-media-app
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_change_this_in_production
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
PORT=5000
NODE_ENV=development
```

3. Make sure MongoDB is running:
```bash
# On Windows with MongoDB installed
mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo
```

## Running the Server

Development mode with auto-reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh JWT token
- `GET /api/auth/me` - Get current user (requires auth)
- `POST /api/auth/logout` - Logout user (requires auth)

### Users
- `GET /api/users/:userId` - Get user profile
- `PUT /api/users/profile` - Update profile (requires auth)
- `GET /api/users/search?q=query` - Search users
- `POST /api/users/:userId/follow` - Follow user (requires auth)
- `POST /api/users/:userId/unfollow` - Unfollow user (requires auth)

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create post (requires auth)
- `DELETE /api/posts/:postId` - Delete post (requires auth)
- `POST /api/posts/:postId/like` - Like post (requires auth)
- `POST /api/posts/:postId/unlike` - Unlike post (requires auth)

## Error Handling

The API returns appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## Security Notes

- Always change JWT secrets in production
- Use HTTPS in production
- Implement rate limiting
- Validate all user inputs
- Use environment variables for sensitive data
