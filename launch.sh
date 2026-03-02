#!/bin/bash

# Kinetic Launch Script
# Automates the go-live process

set -e

echo "════════════════════════════════════════"
echo "  KINETIC INTEGRITY MONITOR"
echo "  Launch Automation Script"
echo "════════════════════════════════════════"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${YELLOW}→${NC} $1"
}

# Check prerequisites
echo "Checking prerequisites..."
echo ""

if ! command -v node &> /dev/null; then
    print_error "Node.js not found. Please install Node.js 18+"
    exit 1
fi
print_status "Node.js found: $(node --version)"

if ! command -v npm &> /dev/null; then
    print_error "npm not found"
    exit 1
fi
print_status "npm found: $(npm --version)"

if ! command -v git &> /dev/null; then
    print_error "Git not found"
    exit 1
fi
print_status "Git found"

echo ""

# Option 1: Local testing
echo "════════════════════════════════════════"
echo "PHASE 1: LOCAL TESTING"
echo "════════════════════════════════════════"
echo ""

read -p "Do you want to test locally first? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_info "Starting backend server..."
    
    # Check if server dependencies are installed
    if [ ! -d "server/node_modules" ]; then
        print_info "Installing server dependencies..."
        cd server
        npm install
        cd ..
    fi
    
    # Start server in background
    cd server
    npm run dev &
    SERVER_PID=$!
    cd ..
    
    sleep 3
    
    # Check if server is running
    if curl -s http://localhost:3001/health > /dev/null; then
        print_status "Backend server running on port 3001"
    else
        print_error "Backend server failed to start"
        kill $SERVER_PID
        exit 1
    fi
    
    # Start frontend in background
    print_info "Starting frontend..."
    npm run dev &
    FRONTEND_PID=$!
    
    sleep 5
    
    print_status "Frontend running on http://localhost:3000"
    print_info "Starting demo agent..."
    
    # Run demo for 30 seconds
    timeout 30 node demo-agent.js || true
    
    echo ""
    print_info "Check http://localhost:3000 - entropy should be updating"
    echo ""
    
    read -p "Did everything work? (y/n) " -n 1 -r
    echo
    
    # Kill background processes
    kill $SERVER_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_error "Local testing failed. Check logs above."
        exit 1
    fi
fi

echo ""

# Option 2: Prepare for deployment
echo "════════════════════════════════════════"
echo "PHASE 2: PREPARE FOR DEPLOYMENT"
echo "════════════════════════════════════════"
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    print_info "Creating .env.local..."
    read -p "Enter your backend API URL (or press Enter for http://localhost:3001): " -r API_URL
    API_URL=${API_URL:-http://localhost:3001}
    echo "NEXT_PUBLIC_API_URL=$API_URL" > .env.local
    print_status "Created .env.local with API URL: $API_URL"
else
    print_status ".env.local already exists"
fi

echo ""

# Option 3: Git setup
print_info "Preparing git..."

if ! git diff-index --quiet HEAD --; then
    print_info "Committing changes..."
    git add .
    git commit -m "Kinetic MVP - ready for launch" || print_status "Already committed"
fi

print_status "Git ready for deployment"

echo ""

# Option 4: Deployment instructions
echo "════════════════════════════════════════"
echo "PHASE 3: DEPLOYMENT READY"
echo "════════════════════════════════════════"
echo ""

print_status "All checks passed! You're ready to deploy."
echo ""
echo "NEXT STEPS:"
echo ""
echo "1. Deploy backend to Railway:"
echo "   • Go to https://railway.app"
echo "   • Create new project from GitHub"
echo "   • Railway auto-deploys in 2-3 minutes"
echo ""
echo "2. Update frontend with backend URL:"
echo "   • Edit .env.local with your Railway URL"
echo "   • Push to GitHub"
echo "   • Vercel auto-deploys"
echo ""
echo "3. Test end-to-end:"
echo "   API_URL=<your-railway-url> node demo-agent.js"
echo ""
echo "4. Share your live dashboard:"
echo "   • Post to Hacker News"
echo "   • Tweet it out"
echo "   • Share in Discord communities"
echo ""

read -p "Ready to launch? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "You're going live!"
    echo ""
    echo "📚 Full guides available:"
    echo "   • LIVE_NOW.md - Step-by-step launch guide"
    echo "   • GO_LIVE.md - Detailed checklist"
    echo "   • SHIPPING_NOW.md - Final action plan"
    echo ""
    print_info "Opening LIVE_NOW.md..."
    if command -v open &> /dev/null; then
        open LIVE_NOW.md
    elif command -v xdg-open &> /dev/null; then
        xdg-open LIVE_NOW.md
    fi
    echo ""
    print_status "Launch sequence initiated. Go ship it!"
else
    print_info "Setup complete. Run this script again when ready."
fi

echo ""
echo "════════════════════════════════════════"
