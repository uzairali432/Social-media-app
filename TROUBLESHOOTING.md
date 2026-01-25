# Troubleshooting Guide

## Common Issues and Solutions

### Installation Issues

#### Issue: "npm: command not found"
**Cause**: Node.js/npm not installed  
**Solution**:
1. Download Node.js from https://nodejs.org/
2. Install it (includes npm)
3. Verify: `node --version` and `npm --version`
4. Restart terminal

#### Issue: "npm install fails with permission error"
**Cause**: Permission issues  
**Solution** (Windows):
- Run terminal as Administrator
- Or: `npm install --no-optional`

**Solution** (Mac/Linux):
```bash
sudo npm install -g npm@latest
npm install
```

#### Issue: "node_modules folder is huge / npm install is slow"
**Cause**: Slow internet or many dependencies  
**Solution**:
```bash
# Clean and retry
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

---

### MongoDB Issues

#### Issue: "MongoDB connection refused"
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Cause**: MongoDB not running  
**Solution**:

Option 1 - Local MongoDB:
```bash
# Start MongoDB service
mongod
# Leave running in background
```

Option 2 - Docker:
```bash
docker run -d -p 27017:27017 --name mongodb mongo
docker ps  # verify it's running
```

Option 3 - MongoDB Atlas (Cloud):
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account and cluster
3. Get connection string (looks like): 
   ```
   mongodb+srv://user:pass@cluster.mongodb.net/dbname
   ```
4. Update `server/.env`:
   ```
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
   ```

#### Issue: "Port 27017 already in use"
**Cause**: MongoDB already running or other process on port  
**Solution** (Windows):
```bash
netstat -ano | findstr :27017
taskkill /PID <PID> /F
```

**Solution** (Mac/Linux):
```bash
lsof -i :27017
kill -9 <PID>
```

#### Issue: "Authentication failed for MongoDB Atlas"
**Cause**: Wrong credentials or connection string  
**Solution**:
1. Check email/password in MongoDB Atlas
2. Check IP whitelist (Atlas → Network Access)
3. Add `0.0.0.0/0` for all IPs (dev only!)
4. Verify connection string format

---

### Backend Issues

#### Issue: "Cannot find module 'express' or other package"
**Cause**: Dependencies not installed  
**Solution**:
```bash
cd server
rm -rf node_modules package-lock.json
npm install
```

#### Issue: "Server won't start / Port 5000 in use"
**Cause**: Port already in use  
**Solution**:

Option 1 - Kill process:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

Option 2 - Change port:
```bash
# In server/.env
PORT=5001
```

#### Issue: "API endpoints return 404 or 500 errors"
**Cause**: Routes not defined or server error  
**Solution**:
1. Check backend console for errors
2. Verify `server/routes/` files exist
3. Check syntax in `server/index.js`
4. Restart backend server

#### Issue: "Syntax error in JavaScript"
```
SyntaxError: Unexpected token (line X)
```
**Cause**: JavaScript syntax error  
**Solution**:
1. Check the mentioned line
2. Look for missing braces, semicolons, or quotes
3. Use IDE with syntax highlighting
4. Restart server after fixing

#### Issue: "Password hashing not working / passwords not being hashed"
**Cause**: Middleware not configured  
**Solution**:
1. Check `server/models/User.js` has pre-save hook
2. Verify bcryptjs is installed: `npm list bcryptjs`
3. Check error logs for bcrypt errors

---

### Frontend Issues

#### Issue: "Module not found: 'vite' or 'react'"
**Cause**: Dependencies not installed  
**Solution**:
```bash
# In project root (not server folder)
rm -rf node_modules package-lock.json
npm install
```

#### Issue: "CORS error in browser console"
```
Access to XMLHttpRequest blocked by CORS policy
```
**Cause**: Backend CORS not configured or wrong API URL  
**Solution**:

1. Check backend has CORS enabled (`server/index.js`):
```javascript
app.use(cors());
```

2. Check frontend `.env`:
```
VITE_API_URL=http://localhost:5000/api
```

3. Verify backend is running on http://localhost:5000

4. Test in browser console:
```javascript
fetch('http://localhost:5000/api/health')
  .then(r => r.json())
  .then(d => console.log(d))
```

#### Issue: "API returns 401 Unauthorized"
**Cause**: Token missing, invalid, or expired  
**Solution**:
1. Check token in localStorage: `localStorage.getItem('authToken')`
2. Verify token is sent in headers
3. Check token expiry time
4. Try logging out and logging back in
5. Check backend `.env` has correct JWT_SECRET

#### Issue: "Cannot access /home page, redirects to login"
**Cause**: Not authenticated  
**Solution**:
1. Sign up or login first
2. Check localStorage has `authToken`
3. Check network tab for failed API requests
4. Verify backend is running

#### Issue: "Form submission does nothing"
**Cause**: Validation error or API call failing silently  
**Solution**:
1. Check browser console for errors
2. Check network tab → see request/response
3. Verify form validation passes (check error messages)
4. Verify backend is running
5. Check `VITE_API_URL` in `.env`

#### Issue: "Old localStorage accounts still there"
**Cause**: localStorage not cleared  
**Solution**:
```javascript
// In browser console
localStorage.clear()
// Refresh page
```

---

### Authentication Issues

#### Issue: "Can't sign up - email already exists error"
**Cause**: User already registered  
**Solution**:
1. Use different email
2. If testing, delete user from MongoDB
3. Or clear MongoDB and restart

#### Issue: "Can't login - 'Invalid credentials'"
**Cause**: Wrong email/password or user doesn't exist  
**Solution**:
1. Sign up new account
2. Verify email matches exactly (case-sensitive)
3. Check password is correct
4. Make sure backend is running

#### Issue: "Token won't refresh automatically"
**Cause**: Interceptor not working or token format wrong  
**Solution**:
1. Check `src/services/api.js` has interceptors
2. Verify token format: `Bearer <token>`
3. Check refresh token exists: `localStorage.getItem('refreshToken')`
4. Check backend refresh endpoint works

#### Issue: "Can login but tokens not saving"
**Cause**: localStorage disabled or interceptor not saving  
**Solution**:
1. Check browser localStorage is enabled
2. Verify AuthReducer saving to localStorage:
   ```javascript
   localStorage.setItem("authToken", token);
   ```
3. Check network response includes `token` and `refreshToken`

---

### Data Issues

#### Issue: "Data not persisting after refresh"
**Cause**: Not saving to database or using wrong user context  
**Solution**:
1. Verify MongoDB is connected
2. Check data was actually sent to backend
3. Use MongoDB Compass to check collections
4. Verify API endpoints save data to DB

#### Issue: "Old posts/users not showing"
**Cause**: Data in old localStorage, not in MongoDB  
**Solution**:
1. This is expected after migration
2. All old data in localStorage is lost
3. Users must sign up and create new posts
4. If data is critical, export from old localStorage first

#### Issue: "Cannot find user in database"
**Cause**: User not created or ID wrong  
**Solution**:
1. Use MongoDB Compass to browse collections
2. Verify user was created: `db.users.find()`
3. Check user ID format (should be 24-char MongoDB ObjectId)
4. Verify you're looking in correct database

---

### Performance Issues

#### Issue: "App is slow / requests take a long time"
**Cause**: Slow MongoDB, network, or unoptimized code  
**Solution**:
1. Check network tab in DevTools
2. Verify MongoDB is responsive: `mongosh`
3. Check backend console for slow queries
4. Add database indexes for frequently queried fields

#### Issue: "localStorage is full"
**Cause**: Too much data in localStorage (5-10MB limit)  
**Solution**:
1. Clear: `localStorage.clear()`
2. Move to IndexedDB for large data
3. Only store essential tokens, not user profiles

---

### Deployment Issues

#### Issue: "Backend works locally but fails in production"
**Cause**: Environment variables not set or paths wrong  
**Solution**:
1. Verify all `.env` variables are set on server
2. Check MongoDB connection string for production
3. Update `VITE_API_URL` to production API
4. Check logs on production server
5. Verify CORS allows production domain

#### Issue: "Frontend deployed but can't reach backend"
**Cause**: API URL points to localhost  
**Solution**:
1. Update `VITE_API_URL` to production backend URL
2. Rebuild frontend with `npm run build`
3. Verify backend is deployed and running
4. Check CORS allows frontend domain

---

### Development Tools

#### Use Browser DevTools

**Network Tab:**
```
1. Open DevTools (F12)
2. Click Network tab
3. Make API request
4. Check Request and Response
5. Verify headers include: Authorization: Bearer token
```

**Console Tab:**
```
1. Check for JavaScript errors
2. Test API manually:
fetch('http://localhost:5000/api/health')
  .then(r => r.json())
  .then(console.log)
```

**Application Tab:**
```
1. Check localStorage tokens exist
2. Verify token not expired
3. Decode JWT at https://jwt.io
```

#### MongoDB Tools

**MongoDB Compass:**
- Download: https://www.mongodb.com/products/compass
- Visual database explorer
- Query, insert, delete data
- Check collections and data

**mongosh (MongoDB Shell):**
```bash
mongosh

# Check database
show dbs
use social-media-app
show collections

# Check users
db.users.find()
db.users.findOne({email: "test@example.com"})

# Delete user for testing
db.users.deleteOne({email: "test@example.com"})

# Check posts
db.posts.find()
```

---

### Getting Help

**Before asking for help:**
1. Check this troubleshooting guide
2. Read error message carefully
3. Check browser console for errors
4. Check backend server console for errors
5. Verify MongoDB is running
6. Verify all services are running (Backend, Frontend, MongoDB)

**Information to provide:**
- Error message (exact text)
- Steps to reproduce
- What you were trying to do
- Console/terminal output
- Which file(s) are affected

**Recommended resources:**
- Check `IMPLEMENTATION_SUMMARY.md`
- Check `JWT_MIGRATION_GUIDE.md`
- Check `server/README.md`
- Check `ARCHITECTURE.md`
- MongoDB docs: https://docs.mongodb.com/
- Express docs: https://expressjs.com/
- JWT docs: https://jwt.io/
- React docs: https://react.dev/

---

### Quick Debugging Checklist

```
□ Is MongoDB running?
□ Is backend server running on port 5000?
□ Is frontend running on port 5173?
□ Are all dependencies installed?
□ Are .env files configured correctly?
□ Is VITE_API_URL pointing to correct backend?
□ Are there errors in browser console?
□ Are there errors in terminal/server console?
□ Is network request succeeding (check Network tab)?
□ Does response include expected data?
□ Is token being saved to localStorage?
□ Is authorization header being sent?
□ Is backend validating token correctly?
```

---

**Still stuck?** Take a break and come back with fresh eyes! Most issues are simple configuration problems. 🚀
