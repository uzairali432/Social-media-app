# JWT Authentication Implementation - Summary

## What Was Done

Your social media app has been successfully migrated from local localStorage authentication to a **JWT (JSON Web Token) based authentication system with MongoDB**.

## Project Structure

```
Social-media-app/
├── src/                          # Frontend React app
│   ├── services/
│   │   └── api.js               # NEW - Axios API client
│   ├── context/
│   │   ├── AuthContext.jsx      # UPDATED - JWT token management
│   │   └── Provider.jsx
│   ├── reducer/
│   │   └── AuthReducer.jsx      # UPDATED - JWT reducer
│   ├── pages/
│   │   └── auth/
│   │       ├── Login.jsx        # UPDATED - API calls
│   │       └── SignUp.jsx
│   ├── components/
│   │   └── Form.jsx             # UPDATED - API calls
│   └── ...
├── server/                        # NEW - Backend Node.js server
│   ├── models/
│   │   ├── User.js              # User schema with password hashing
│   │   └── Post.js              # Post schema
│   ├── routes/
│   │   ├── auth.js              # Login, signup, token refresh
│   │   ├── posts.js             # Post management
│   │   └── users.js             # User profiles
│   ├── middleware/
│   │   └── auth.js              # JWT verification
│   ├── index.js                 # Express server
│   ├── package.json
│   ├── .env
│   └── README.md
├── .env                          # UPDATED - API URL added
├── JWT_MIGRATION_GUIDE.md        # NEW - Detailed migration docs
├── setup.sh                      # NEW - Linux/Mac setup
├── setup.bat                     # NEW - Windows setup
└── ...
```

## Key Changes

### Frontend

| File | Changes |
|------|---------|
| `src/services/api.js` | Created axios instance with auth interceptors |
| `src/context/AuthContext.jsx` | Stores JWT token, checks auth on app load |
| `src/reducer/AuthReducer.jsx` | Updated to work with tokens |
| `src/pages/auth/Login.jsx` | Calls `authAPI.login()` |
| `src/components/Form.jsx` | Calls `authAPI.signup()` |
| `.env` | Added `VITE_API_URL` |

### Backend

Created complete Express.js server with:
- **User Registration** with password hashing
- **Login** with JWT token generation
- **Token Refresh** mechanism
- **Protected Routes** with JWT middleware
- **MongoDB Models** for Users and Posts
- **RESTful API** endpoints
- **Error Handling** and validation

## How It Works

### Authentication Flow

1. **Signup**
   - User fills signup form
   - Frontend sends data to `POST /api/auth/signup`
   - Backend hashes password and saves to MongoDB
   - Returns JWT token and refresh token
   - Frontend stores tokens and redirects to home

2. **Login**
   - User enters email/password
   - Frontend sends to `POST /api/auth/login`
   - Backend verifies credentials
   - Returns JWT and refresh tokens
   - Frontend stores and redirects

3. **Authenticated Requests**
   - Frontend includes token: `Authorization: Bearer <token>`
   - Backend verifies token with middleware
   - Processes request or returns 401 if invalid

4. **Token Refresh**
   - When access token expires (15 min)
   - Axios interceptor automatically refreshes
   - New token obtained from `POST /api/auth/refresh`
   - Request retried with new token

## Installation & Running

### Quick Start (Windows)
```bash
# Double-click setup.bat to install dependencies
# Then follow the prompts

# Or manually:
cd server
npm install
npm run dev

# In another terminal:
npm run dev  # Frontend
```

### Quick Start (Linux/Mac)
```bash
chmod +x setup.sh
./setup.sh

# Then:
cd server
npm run dev

# In another terminal:
npm run dev  # Frontend
```

### Prerequisites
- Node.js 14+
- MongoDB 4+ (local or Docker)
- npm or yarn

### MongoDB Setup
```bash
# Option 1: Local MongoDB
# Install from https://www.mongodb.com/try/download/community
mongod

# Option 2: Docker
docker run -d -p 27017:27017 --name mongodb mongo
```

### Environment Variables

**Frontend** (`.env`)
```
VITE_API_URL=http://localhost:5000/api
VITE_PIXABAY_API_KEY=your_key
```

**Backend** (`server/.env`)
```
MONGODB_URI=mongodb://localhost:27017/social-media-app
JWT_SECRET=change_this_in_production
JWT_REFRESH_SECRET=change_this_in_production
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
PORT=5000
NODE_ENV=development
```

## API Endpoints

### Auth
```
POST /api/auth/signup      - Register new user
POST /api/auth/login       - Login user
POST /api/auth/refresh     - Refresh access token
GET /api/auth/me           - Get current user (requires auth)
POST /api/auth/logout      - Logout user (requires auth)
```

### Users
```
GET /api/users/:userId           - Get user profile
PUT /api/users/profile           - Update profile (requires auth)
GET /api/users/search?q=query    - Search users
POST /api/users/:userId/follow   - Follow user (requires auth)
POST /api/users/:userId/unfollow - Unfollow user (requires auth)
```

### Posts
```
GET /api/posts                   - Get all posts
POST /api/posts                  - Create post (requires auth)
DELETE /api/posts/:postId        - Delete post (requires auth)
POST /api/posts/:postId/like     - Like post (requires auth)
POST /api/posts/:postId/unlike   - Unlike post (requires auth)
```

## Security Features

✅ **Password Hashing** - bcryptjs with salt rounds  
✅ **JWT Tokens** - Signed with secret keys  
✅ **Token Expiration** - 15-min access, 7-day refresh  
✅ **Request Authorization** - Bearer token validation  
✅ **Input Validation** - express-validator on all endpoints  
✅ **CORS** - Configured for frontend origin  
✅ **Error Handling** - No sensitive info in responses  

## Important Notes

⚠️ **Data Reset** - All localStorage accounts are lost. Users must sign up again.

⚠️ **MongoDB Required** - Backend won't run without MongoDB.

⚠️ **Change Secrets** - Update JWT secrets in production!

⚠️ **Backend Dependency** - App now requires backend server running.

## Files Created

- `src/services/api.js` - API client
- `server/` - Complete backend
  - `server/models/User.js`
  - `server/models/Post.js`
  - `server/routes/auth.js`
  - `server/routes/posts.js`
  - `server/routes/users.js`
  - `server/middleware/auth.js`
  - `server/index.js`
  - `server/package.json`
  - `server/.env`
  - `server/README.md`
- `JWT_MIGRATION_GUIDE.md` - Detailed guide
- `setup.sh` - Linux/Mac setup script
- `setup.bat` - Windows setup script

## Files Modified

- `src/context/AuthContext.jsx`
- `src/reducer/AuthReducer.jsx`
- `src/pages/auth/Login.jsx`
- `src/components/Form.jsx`
- `.env`

## Next Steps

1. **Install MongoDB** - Local or Docker
2. **Install dependencies** - Run setup script or `npm install` in both dirs
3. **Start MongoDB** - `mongod` or Docker
4. **Start backend** - `cd server && npm run dev`
5. **Start frontend** - `npm run dev`
6. **Test signup/login** - Try registering and logging in

## Troubleshooting

**MongoDB Connection Error**
```
Solution: Ensure MongoDB is running on port 27017
```

**CORS Error**
```
Solution: Check VITE_API_URL is correct and backend is running
```

**Port Already in Use**
```
Solution: Change PORT in server/.env or kill process on port 5000
```

**Module Not Found**
```
Solution: Run npm install in both frontend and server directories
```

## Documentation

- **Frontend**: See `JWT_MIGRATION_GUIDE.md`
- **Backend**: See `server/README.md`
- **Setup**: Follow `setup.sh` or `setup.bat`

## Support

For issues or questions:
1. Check the error messages in console
2. Review `JWT_MIGRATION_GUIDE.md`
3. Check `server/README.md` for backend details
4. Verify MongoDB is running
5. Verify environment variables are set correctly

---

**Migration Complete!** Your app is now ready for cloud deployment with enterprise-grade authentication. 🚀
