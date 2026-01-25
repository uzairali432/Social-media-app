#!/bin/bash
# Quick setup script for Social Media App with JWT + MongoDB

echo "=== Social Media App Setup ==="
echo ""

# Check if MongoDB is running
echo "Checking MongoDB..."
if ! mongod --version > /dev/null 2>&1; then
    echo "⚠️  MongoDB is not installed. Please install it first."
    echo "Visit: https://www.mongodb.com/try/download/community"
    exit 1
fi

# Setup backend
echo ""
echo "Setting up backend..."
cd server || exit

if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
else
    echo "Backend dependencies already installed"
fi

# Check if .env exists in server
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found in server folder. Creating default..."
    cat > .env << EOF
MONGODB_URI=mongodb://localhost:27017/social-media-app
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_change_this_in_production
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
PORT=5000
NODE_ENV=development
EOF
    echo "Created .env with defaults. Please update JWT secrets!"
fi

cd ..

# Setup frontend
echo ""
echo "Setting up frontend..."
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
else
    echo "Frontend dependencies already installed"
fi

echo ""
echo "=== Setup Complete! ==="
echo ""
echo "Next steps:"
echo "1. Start MongoDB: mongod"
echo "2. Start backend: cd server && npm run dev"
echo "3. Start frontend in new terminal: npm run dev"
echo ""
echo "For more information, see JWT_MIGRATION_GUIDE.md"
