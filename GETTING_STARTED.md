# Getting Started Checklist

## Initial Setup

- [ ] Read `IMPLEMENTATION_SUMMARY.md` for overview
- [ ] Read `JWT_MIGRATION_GUIDE.md` for detailed guide
- [ ] Check `server/README.md` for backend documentation

## Prerequisites Installation

- [ ] Install Node.js 14+ from https://nodejs.org/
- [ ] Install MongoDB from https://www.mongodb.com/try/download/community
  - Or install Docker: https://www.docker.com/
- [ ] Verify installations:
  ```bash
  node --version
  npm --version
  mongod --version  # or docker --version
  ```

## MongoDB Setup

Choose one option:

**Option 1: Local MongoDB**
- [ ] Download and install MongoDB Community Edition
- [ ] Start MongoDB: `mongod`
- [ ] Verify it's running on `mongodb://localhost:27017`

**Option 2: Docker**
- [ ] Start MongoDB container:
  ```bash
  docker run -d -p 27017:27017 --name mongodb mongo
  ```
- [ ] Verify container is running: `docker ps`

**Option 3: MongoDB Atlas (Cloud)**
- [ ] Create account at https://www.mongodb.com/cloud/atlas
- [ ] Create a free cluster
- [ ] Get connection string
- [ ] Update `server/.env` with connection string

## Backend Setup

- [ ] Navigate to server folder: `cd server`
- [ ] Install dependencies: `npm install`
- [ ] Check `.env` file exists with proper configuration
- [ ] Update JWT secrets (optional for development):
  ```
  JWT_SECRET=your_secret_key_123
  JWT_REFRESH_SECRET=your_refresh_secret_456
  ```
- [ ] Test backend: `npm run dev`
- [ ] Verify server starts on http://localhost:5000
- [ ] Test health endpoint: http://localhost:5000/api/health

## Frontend Setup

- [ ] Navigate to project root
- [ ] Install dependencies: `npm install`
- [ ] Check `.env` file has `VITE_API_URL=http://localhost:5000/api`
- [ ] Start frontend: `npm run dev`
- [ ] Verify app opens on http://localhost:5173

## Test Authentication

### Test Signup
- [ ] Go to signup page
- [ ] Enter test data:
  - First name: John
  - Surname: Doe
  - Date: 01/01/1990
  - Gender: Male
  - Email: john@example.com
  - Password: Test@1234
- [ ] Click "Sign Up"
- [ ] Should redirect to home page
- [ ] Check browser console for no errors

### Test Login
- [ ] Logout (if possible, or clear localStorage)
- [ ] Go to login page
- [ ] Enter same email and password
- [ ] Click "Log in"
- [ ] Should redirect to home page
- [ ] Should show user info in state

### Test Token Refresh
- [ ] In browser DevTools, go to Application → localStorage
- [ ] Check `authToken` and `refreshToken` are present
- [ ] Wait (or modify token expiry to 1 second for testing)
- [ ] Make an API request
- [ ] Should auto-refresh token in background

## Verify Everything Works

- [ ] Backend server running without errors
- [ ] Frontend loading without errors
- [ ] Can sign up new user
- [ ] Can log in with credentials
- [ ] Tokens stored in localStorage
- [ ] User info displays correctly
- [ ] Token automatically refreshes (check Network tab)

## Before Production Deployment

- [ ] Update `JWT_SECRET` to strong random string
  ```bash
  # Generate strong secret:
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- [ ] Update `JWT_REFRESH_SECRET` similarly
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS
- [ ] Use MongoDB Atlas or cloud MongoDB
- [ ] Deploy backend (Heroku, AWS, DigitalOcean, etc.)
- [ ] Update `VITE_API_URL` to production API URL
- [ ] Build and deploy frontend
- [ ] Set up CORS for production domain
- [ ] Implement rate limiting
- [ ] Add email verification
- [ ] Add password reset
- [ ] Set up logging
- [ ] Monitor errors and performance

## Common Issues & Solutions

### Issue: "Cannot find module 'express'"
**Solution**: 
```bash
cd server
npm install
```

### Issue: "MongoDB connection refused"
**Solution**: 
- Start MongoDB: `mongod`
- Or: `docker run -d -p 27017:27017 --name mongodb mongo`

### Issue: "Port 5000 already in use"
**Solution**:
- Change PORT in `server/.env`
- Or kill process: `lsof -i :5000` → `kill -9 <PID>`

### Issue: "CORS error in browser"
**Solution**:
- Check `VITE_API_URL` is correct
- Check backend is running
- Check CORS middleware in `server/index.js`

### Issue: "Login fails with 400/401 error"
**Solution**:
- Check MongoDB is running
- Check email exists in database
- Check backend error logs
- Try signing up again

### Issue: "All old accounts lost"
**Solution**:
- This is expected - they were localStorage only
- Users must sign up again with new backend
- Export data from localStorage if needed

## Quick Commands Reference

```bash
# Backend
cd server
npm install          # Install dependencies
npm run dev         # Start with nodemon (hot reload)
npm start           # Start production server

# Frontend
npm install         # Install dependencies
npm run dev         # Start dev server
npm run build       # Build for production

# MongoDB
mongod              # Start local MongoDB
# Or
docker run -d -p 27017:27017 --name mongodb mongo

# Testing
# Backend health: curl http://localhost:5000/api/health
# Login: curl -X POST http://localhost:5000/api/auth/login
```

## File Structure Quick Reference

```
Social-media-app/
├── src/                              # Frontend React code
│   ├── services/api.js              # API calls configuration
│   ├── context/AuthContext.jsx      # Auth state management
│   └── ...
├── server/                           # Backend Node.js
│   ├── models/User.js               # Database schema
│   ├── routes/auth.js               # Auth endpoints
│   ├── index.js                     # Main server file
│   └── .env                         # Backend config
├── .env                              # Frontend config
├── IMPLEMENTATION_SUMMARY.md         # Overview
└── JWT_MIGRATION_GUIDE.md           # Detailed guide
```

## Next Learning Steps

After getting it running:

1. **Explore the code**:
   - Understand JWT flow in `src/services/api.js`
   - See auth middleware in `server/middleware/auth.js`
   - Check models in `server/models/`

2. **Add more features**:
   - User profile editing
   - Post comments
   - Notifications
   - Real-time updates with WebSockets

3. **Improve security**:
   - Email verification
   - Two-factor authentication
   - Rate limiting
   - API key protection

4. **Prepare for production**:
   - Database backups
   - Error logging (Sentry)
   - Performance monitoring
   - CDN for static assets

---

**You're ready to go!** 🎉

If you get stuck, check the troubleshooting guides in the documentation files.
