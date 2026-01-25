# Quick Reference Card

## Essential Commands

### Setup & Installation
```bash
# Windows
setup.bat

# Linux/Mac
chmod +x setup.sh && ./setup.sh

# Manual
cd server && npm install && npm run dev
npm install && npm run dev
```

### Running Services
```bash
# Backend (in server folder)
npm run dev          # Development with hot reload
npm start            # Production

# Frontend (in project root)
npm run dev          # Development
npm run build        # Build for production
npm run preview      # Preview build

# MongoDB
mongod              # Start local MongoDB
docker run -d -p 27017:27017 --name mongodb mongo  # Docker
```

### Testing
```bash
# Test backend health
curl http://localhost:5000/api/health

# Test signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","email":"john@test.com",...}'

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"Test@123"}'
```

---

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_PIXABAY_API_KEY=your_api_key_here
```

### Backend (server/.env)
```
MONGODB_URI=mongodb://localhost:27017/social-media-app
JWT_SECRET=your_jwt_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_key_here
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
PORT=5000
NODE_ENV=development
```

---

## API Endpoints Cheatsheet

### Auth Endpoints
```
POST   /api/auth/signup           Register new user
POST   /api/auth/login            Login user
POST   /api/auth/refresh          Refresh access token
GET    /api/auth/me               Get current user (auth required)
POST   /api/auth/logout           Logout user (auth required)
```

### User Endpoints
```
GET    /api/users/:userId                Get user profile
PUT    /api/users/profile                Update profile (auth required)
GET    /api/users/search?q=searchTerm    Search users
POST   /api/users/:userId/follow         Follow user (auth required)
POST   /api/users/:userId/unfollow       Unfollow user (auth required)
```

### Post Endpoints
```
GET    /api/posts                     Get all posts
POST   /api/posts                     Create post (auth required)
DELETE /api/posts/:postId             Delete post (auth required)
POST   /api/posts/:postId/like        Like post (auth required)
POST   /api/posts/:postId/unlike      Unlike post (auth required)
```

### Health Endpoint
```
GET    /api/health                   Server status
```

---

## Request Headers

### For Protected Endpoints
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

### Example
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer eyJhbGc..."
```

---

## Response Format

### Success Response
```json
{
  "message": "Success message",
  "user": {
    "_id": "63a1b2c3d4e5f6g7h8i9j0k1",
    "firstName": "John",
    "surName": "Doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

### Error Response
```json
{
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

---

## HTTP Status Codes

| Code | Meaning | Common Reason |
|------|---------|---------------|
| 200 | OK | Request succeeded |
| 201 | Created | Resource created |
| 400 | Bad Request | Invalid data |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | No permission |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Backend error |

---

## File Locations

| What | Where |
|------|-------|
| Frontend source | `src/` |
| Backend source | `server/` |
| API client | `src/services/api.js` |
| Auth context | `src/context/AuthContext.jsx` |
| Auth reducer | `src/reducer/AuthReducer.jsx` |
| Auth routes | `server/routes/auth.js` |
| User models | `server/models/User.js` |
| Post models | `server/models/Post.js` |
| Frontend config | `.env` |
| Backend config | `server/.env` |
| Documentation | Root folder (*.md) |

---

## Common Issues Quick Fixes

| Issue | Fix |
|-------|-----|
| "Connection refused" | Start MongoDB: `mongod` |
| "Port 5000 in use" | Change PORT in server/.env or `lsof -i :5000 && kill -9` |
| "CORS error" | Check VITE_API_URL in .env is correct |
| "Can't find module" | Run `npm install` in correct folder |
| "Token invalid" | Logout and login again, or check JWT_SECRET |
| "User not found" | Sign up first or check MongoDB |
| "Password requirements" | Use uppercase, lowercase, number, special char |

---

## Browser Developer Tools

### Check Authentication
```javascript
// In browser console
localStorage.getItem('authToken')      // View access token
localStorage.getItem('refreshToken')   // View refresh token
localStorage.clear()                   // Clear all tokens
```

### Test API
```javascript
// In browser console
fetch('http://localhost:5000/api/health')
  .then(r => r.json())
  .then(console.log)
```

### Decode JWT Token
Visit: https://jwt.io/

Paste token in "Encoded" section to see payload

---

## Database Operations

### Using MongoDB CLI (mongosh)
```bash
mongosh

# Show databases
show dbs

# Use database
use social-media-app

# Show collections
show collections

# Find users
db.users.find()
db.users.findOne({email: "john@example.com"})

# Find posts
db.posts.find()

# Delete user (for testing)
db.users.deleteOne({email: "test@example.com"})

# Delete all posts
db.posts.deleteMany({})
```

### Using MongoDB Compass (GUI)
1. Download: https://www.mongodb.com/products/compass
2. Connect to: `mongodb://localhost:27017`
3. Browse collections visually
4. Query, insert, edit, delete data

---

## Password Requirements

When signing up, password must have:
- ✅ At least 8 characters
- ✅ At least 1 uppercase letter (A-Z)
- ✅ At least 1 lowercase letter (a-z)
- ✅ At least 1 number (0-9)
- ✅ At least 1 special character (#?!@$%^&*-)

Example: `MyPassword123!`

---

## Token Details

### Access Token
- Expires in: 15 minutes (configurable)
- Used for: API requests
- Storage: localStorage
- Sent as: `Authorization: Bearer <token>`

### Refresh Token
- Expires in: 7 days (configurable)
- Used for: Getting new access token
- Storage: localStorage
- Automatic refresh when access token expires

---

## Debugging Checklist

Before posting in forums or asking for help:

- [ ] Read error message carefully
- [ ] Check browser console (F12)
- [ ] Check server terminal output
- [ ] Is MongoDB running? (`mongod`)
- [ ] Is backend running? (port 5000)
- [ ] Is frontend running? (port 5173)
- [ ] Is .env configured correctly?
- [ ] Are all dependencies installed? (`npm install`)
- [ ] Is VITE_API_URL correct?
- [ ] Did you restart services after .env changes?

---

## Port Reference

| Service | Port | URL |
|---------|------|-----|
| Frontend | 5173 | http://localhost:5173 |
| Backend | 5000 | http://localhost:5000 |
| MongoDB | 27017 | mongodb://localhost:27017 |

---

## File Size Reference

After setup, expect:
- Frontend node_modules: ~500MB
- Backend node_modules: ~200MB
- MongoDB (empty): ~200MB
- Database with data: Varies

Total disk space needed: ~1-2GB

---

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ⚠️ IE11 (not supported)

---

## Production Checklist

Before deploying:
- [ ] Change JWT_SECRET to random string
- [ ] Change JWT_REFRESH_SECRET to random string
- [ ] Set NODE_ENV=production
- [ ] Get SSL certificate (HTTPS)
- [ ] Set VITE_API_URL to production backend
- [ ] Configure MongoDB Atlas or managed DB
- [ ] Deploy backend to cloud
- [ ] Deploy frontend to CDN
- [ ] Test all features in production
- [ ] Set up monitoring/logging
- [ ] Document deployment process

---

## Useful Links

- **JWT.io**: https://jwt.io/ - Decode/verify tokens
- **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas - Cloud DB
- **Postman**: https://www.postman.com/ - API testing
- **MongoDB Compass**: https://www.mongodb.com/products/compass - DB GUI
- **VS Code**: https://code.visualstudio.com/ - Code editor

---

## Quick Generate Secrets

```bash
# Generate strong JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate another one
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Use these in production .env files

---

## One-Liner Commands

```bash
# Setup and run everything (Linux/Mac)
chmod +x setup.sh && ./setup.sh && mongod &

# Kill all node processes
killall node

# Check port usage
lsof -i :5000
lsof -i :5173
lsof -i :27017

# Clean everything (start fresh)
rm -rf node_modules server/node_modules package-lock.json
npm install && cd server && npm install
```

---

## Getting Help

1. Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
2. Check [GETTING_STARTED.md](GETTING_STARTED.md)
3. Search [ARCHITECTURE.md](ARCHITECTURE.md)
4. Check error logs in console/terminal
5. Use browser DevTools (F12)
6. Test endpoints manually with curl/Postman

---

**Bookmark this page for quick reference!** 📌
