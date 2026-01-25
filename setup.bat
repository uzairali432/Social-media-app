@echo off
REM Quick setup script for Social Media App with JWT + MongoDB (Windows)

echo === Social Media App Setup ===
echo.

REM Setup backend
echo Setting up backend...
cd server

if not exist "node_modules" (
    echo Installing backend dependencies...
    call npm install
) else (
    echo Backend dependencies already installed
)

REM Check if .env exists in server
if not exist ".env" (
    echo Creating .env file...
    (
        echo MONGODB_URI=mongodb://localhost:27017/social-media-app
        echo JWT_SECRET=your_jwt_secret_key_change_this_in_production
        echo JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_change_this_in_production
        echo JWT_EXPIRE=15m
        echo JWT_REFRESH_EXPIRE=7d
        echo PORT=5000
        echo NODE_ENV=development
    ) > .env
    echo Created .env with defaults. Please update JWT secrets!
)

cd ..

REM Setup frontend
echo.
echo Setting up frontend...
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
) else (
    echo Frontend dependencies already installed
)

echo.
echo === Setup Complete! ===
echo.
echo Next steps:
echo 1. Start MongoDB (if not already running^)
echo 2. Start backend: cd server ^&^& npm run dev
echo 3. Start frontend in new terminal: npm run dev
echo.
echo For more information, see JWT_MIGRATION_GUIDE.md
echo.
pause
