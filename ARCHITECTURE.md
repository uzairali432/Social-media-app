# JWT Authentication Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Frontend (React)                            │
│                  http://localhost:5173                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐    ┌──────────────────────┐               │
│  │  Login/SignUp    │ →→→│  Form.jsx            │               │
│  │  Pages           │    │  Login.jsx           │               │
│  └──────────────────┘    └──────────────────────┘               │
│           │                         │                            │
│           └─────────┬───────────────┘                            │
│                     │                                            │
│           ┌─────────▼──────────┐                                │
│           │  AuthContext.jsx   │                                │
│           │  - Stores token    │                                │
│           │  - Manages state   │                                │
│           └─────────┬──────────┘                                │
│                     │                                            │
│           ┌─────────▼──────────────────┐                        │
│           │  services/api.js           │                        │
│           │  - Axios instance          │                        │
│           │  - Token management        │                        │
│           │  - API endpoints           │                        │
│           │  - Request/Response        │                        │
│           │    interceptors            │                        │
│           └─────────┬──────────────────┘                        │
│                     │                                            │
└─────────────────────┼────────────────────────────────────────────┘
                      │
                      │ HTTP/HTTPS
                      │ Bearer Token
                      │
┌─────────────────────▼────────────────────────────────────────────┐
│                Backend (Node.js/Express)                          │
│                   http://localhost:5000                          │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │             Express Server (index.js)                    │   │
│  │  - CORS enabled                                          │   │
│  │  - JSON body parser                                      │   │
│  │  - Error handling middleware                             │   │
│  └──┬───────────────────────────────────────────────────────┘   │
│     │                                                             │
│     ├─────────────────────────────────────────────────────────┐  │
│     │  Routes:                                                │  │
│     │  ┌──────────────────────────────────────────────────┐  │  │
│     │  │ /api/auth/signup     → POST                      │  │  │
│     │  │ /api/auth/login      → POST                      │  │  │
│     │  │ /api/auth/refresh    → POST                      │  │  │
│     │  │ /api/auth/me         → GET (protected)           │  │  │
│     │  │ /api/users/*         → GET/PUT (protected)       │  │  │
│     │  │ /api/posts/*         → GET/POST/DELETE (mixed)   │  │  │
│     │  └──────────────────────────────────────────────────┘  │  │
│     │                                                          │  │
│     └──────────────────────────────────────────────────────────┘  │
│                     │                                              │
│     ┌───────────────┴───────────────┐                             │
│     │                               │                             │
│  ┌──▼──────────────────┐   ┌───────▼─────────────────┐           │
│  │  Auth Middleware    │   │  Models                 │           │
│  │  - JWT verification │   │  - User schema          │           │
│  │  - Token validation │   │  - Post schema          │           │
│  │  - User extraction  │   │  - Password hashing     │           │
│  └─────────────────────┘   └───────┬─────────────────┘           │
│                                     │                             │
└─────────────────────────────────────┼─────────────────────────────┘
                                      │
                          ┌───────────▼────────────┐
                          │    MongoDB Database    │
                          │  mongodb://localhost   │
                          │   :27017               │
                          │                        │
                          │  Collections:          │
                          │  - users               │
                          │  - posts               │
                          └────────────────────────┘
```

## Authentication Flow

### 1. Signup Flow
```
User fills form
    ↓
Form.jsx validates
    ↓
authAPI.signup(userData) → POST /api/auth/signup
    ↓
Backend validates & checks if user exists
    ↓
Hash password with bcryptjs
    ↓
Save user to MongoDB
    ↓
Generate JWT token & refresh token
    ↓
Return tokens + user data
    ↓
AuthReducer stores token (CREATE_ACCOUNT)
    ↓
localStorage saves: authToken, refreshToken
    ↓
Redirect to /home
```

### 2. Login Flow
```
User enters credentials
    ↓
Login.jsx validates
    ↓
authAPI.login(email, password) → POST /api/auth/login
    ↓
Backend finds user in MongoDB
    ↓
Compare password with bcrypt.compare()
    ↓
If match: Generate tokens & return
    ↓
AuthReducer stores token (LOGIN_USER)
    ↓
localStorage saves: authToken, refreshToken
    ↓
Redirect to /home
```

### 3. Protected Request Flow
```
User clicks to fetch data/create post
    ↓
Frontend calls API endpoint (e.g., authAPI.getPosts())
    ↓
axios.interceptors.request attaches token
    ↓
Request: GET /api/posts
         Headers: {Authorization: "Bearer <token>"}
    ↓
Backend authMiddleware verifies token
    ↓
If valid: Extract userId, continue to route handler
    ↓
Handler processes request with user context
    ↓
Return data
    ↓
Frontend handles response
```

### 4. Token Refresh Flow
```
Token expires (15 minutes)
    ↓
User makes request
    ↓
Backend returns 401 Unauthorized
    ↓
axios.interceptors.response catches 401
    ↓
Call POST /api/auth/refresh with refreshToken
    ↓
Backend verifies refresh token (valid 7 days)
    ↓
Generate new access token
    ↓
Return new token
    ↓
Retry original request with new token
    ↓
If successful: Complete request
    ↓
If refresh token invalid: Clear tokens → Redirect to /login
```

## Token Structure

### JWT Token Format
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJ1c2VySWQiOiI2MzZkNzM5ZDFmMzM1YTAwMjBjYzM4ZDEiLCJpYXQiOjE2OTAwMDAwMDB9.
signature123456789
```

**Parts:**
1. **Header**: Algorithm and type
2. **Payload**: User ID and issued time
3. **Signature**: Verified using JWT_SECRET

**Stored in:**
- `localStorage.authToken` - Access token (15 min)
- `localStorage.refreshToken` - Refresh token (7 days)

## Data Flow Diagram

```
┌─────────────────┐
│   User Action   │
│ (Login/Signup)  │
└────────┬────────┘
         │
         ▼
┌──────────────────┐
│   React Form     │
│   Validation     │
└────────┬─────────┘
         │
         ▼
┌──────────────────────┐
│ API Service Layer    │
│ (axios instance)     │
│ - Adds token header  │
│ - Handles errors     │
└────────┬─────────────┘
         │ HTTP Request
         │ {Authorization: Bearer token}
         │
         ▼
┌──────────────────────┐
│  Express Router      │
│  - Parses request    │
│  - CORS check        │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Auth Middleware      │
│ - Verify JWT token   │
│ - Extract userId     │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Route Handler        │
│ - Validate data      │
│ - Query/Update DB    │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│  MongoDB Database    │
│ - Save/Fetch data    │
└────────┬─────────────┘
         │ Response
         ▼
┌──────────────────────┐
│ Express Route        │
│ - Send JSON response │
└────────┬─────────────┘
         │ HTTP Response
         │ {user, token}
         │
         ▼
┌──────────────────────┐
│ API Interceptor      │
│ - Parse response     │
│ - Store token        │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│  AuthContext Reducer │
│  - Update state      │
│  - Store in storage  │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│  React Components    │
│  - Render UI         │
│  - Redirect to home  │
└──────────────────────┘
```

## Security Layers

```
Frontend Security:
├── Form validation (zod/react-hook-form)
├── Token in localStorage (cannot be XSS'd with httpOnly)
├── Token automatically attached to requests
└── Automatic token refresh

Backend Security:
├── Request validation (express-validator)
├── JWT signature verification
├── Password hashing (bcryptjs)
├── CORS policy enforcement
├── Error messages don't leak info
└── Protected routes with authMiddleware

Database Security:
├── Unique email constraint
├── Hashed passwords (never store plain text)
├── ObjectId for user references
└── Timestamps for audit trail
```

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_PIXABAY_API_KEY=your_key
```

### Backend (server/.env)
```
MONGODB_URI=mongodb://localhost:27017/social-media-app
JWT_SECRET=your_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
PORT=5000
NODE_ENV=development
```

## Key Technologies

### Frontend
- **React** - UI framework
- **Axios** - HTTP client
- **React Router** - Navigation
- **React Hook Form** - Form handling
- **Zod** - Validation

### Backend
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM (Object Data Mapper)
- **JWT** - Token authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests

### Database Schema

**Users Collection**
```javascript
{
  _id: ObjectId,
  firstName: String,
  surName: String,
  email: String (unique),
  password: String (hashed),
  dateOfBirth: String,
  gender: String,
  profilePicture: String,
  bio: String,
  followers: [ObjectId],
  following: [ObjectId],
  createdAt: Date
}
```

**Posts Collection**
```javascript
{
  _id: ObjectId,
  author: ObjectId (ref: User),
  content: String,
  image: String,
  likes: [ObjectId],
  comments: [{
    author: ObjectId (ref: User),
    text: String,
    createdAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

---

This architecture provides a scalable, secure, and maintainable authentication system for your social media application. 🚀
