# Kinetic Integrity Monitor - GO LIVE CHECKLIST

## Phase 1: Local Testing (30 minutes)

- [ ] **Start Backend Server**
  ```bash
  cd server
  npm install
  npm run dev
  # Should see: "Kinetic Integrity Monitor listening on http://localhost:3001"
  # "Embeddings: Using MOCK embeddings (demo mode)"
  ```

- [ ] **Start Frontend**
  ```bash
  npm run dev
  # Should see: "Local: http://localhost:3000"
  ```

- [ ] **Test Dashboard**
  - Open http://localhost:3000
  - You should see the dashboard with placeholder data
  - Kill-switch status should show "Ready"

- [ ] **Run Demo Agent**
  ```bash
  node demo-agent.js
  # Should see entropy calculations happening
  # Watch values change in the dashboard in real-time
  ```

- [ ] **Verify API Endpoints**
  ```bash
  curl http://localhost:3001/health
  # Should return: {"status":"ok","timestamp":...}
  ```

- [ ] **Check Database**
  - Backend should create `server/kinetic.db` (SQLite)
  - Run: `sqlite3 server/kinetic.db "SELECT COUNT(*) as count FROM telemetry;"`
  - Should show increasing row count as demo agent runs

## Phase 2: Deploy Backend to Railway (10 minutes)

- [ ] **Create Railway Account**
  - Go to https://railway.app
  - Sign up (free)

- [ ] **Push Repository to GitHub**
  ```bash
  git add .
  git commit -m "Kinetic MVP - ready for launch"
  git push origin main
  ```

- [ ] **Create Railway Project**
  - Railway Dashboard → "New Project"
  - Select "Deploy from GitHub"
  - Select this repository
  - Railway auto-deploys (takes 2-3 minutes)

- [ ] **Verify Backend is Live**
  - Go to Railway Dashboard → Your Project
  - Copy the public URL (e.g., `https://kinetic-api.railway.app`)
  - Test health endpoint:
    ```bash
    curl https://kinetic-api.railway.app/health
    # Should return: {"status":"ok","timestamp":...}
    ```

- [ ] **Note Backend URL**
  Save the URL for the next step. You'll need it to connect the frontend.

## Phase 3: Deploy Frontend to Vercel (10 minutes)

- [ ] **Add Backend URL to Environment**
  Create `.env.local` in project root:
  ```
  NEXT_PUBLIC_API_URL=https://kinetic-api.railway.app
  ```

- [ ] **Deploy to Vercel**
  Option A (Recommended): Push to GitHub → Vercel auto-deploys
  Option B: Manual: `vercel --prod`

- [ ] **Verify Frontend is Live**
  - Go to Vercel Dashboard → Your Project
  - Copy the live URL (e.g., `https://kinetic.vercel.app`)
  - Load it in browser - should show dashboard

- [ ] **Test API Connection**
  - Dashboard should load without errors
  - Check browser console (F12 → Console tab) for any errors
  - Metrics table might be empty (that's OK for now)

- [ ] **Save Frontend URL**
  You'll share this link with early users

## Phase 4: Create Demo Data (5 minutes)

- [ ] **Update Demo Agent to Point to Live Backend**
  ```bash
  API_URL=https://kinetic-api.railway.app node demo-agent.js
  ```

- [ ] **Watch Dashboard Update in Real-Time**
  - Open your live frontend: https://kinetic.vercel.app
  - The entropy chart should start populating
  - Kill-switch should trigger on certain scenarios
  - Metrics should show loop detection working

## Phase 5: Verification Checklist

- [ ] Dashboard loads without errors
- [ ] Entropy chart shows real-time updates
- [ ] Kill-switch status changes color
- [ ] Metrics table shows data
- [ ] API configuration section shows example code
- [ ] No console errors in browser
- [ ] Health endpoint responds: https://your-backend-url/health

## Phase 6: Share & Gather Feedback

- [ ] **Share Frontend URL**
  Send to early users: https://your-kinetic-frontend-url.vercel.app

- [ ] **Share SDK Installation Links**
  - Python: `pip install kinetic-client`
  - Node.js: `npm install @kinetic/monitor`
  - Go: `go get github.com/kinetic-integrity/go-monitor`

- [ ] **Create Quick Start**
  Users can follow: `/QUICK_START.md`

- [ ] **Collect Feedback**
  - What's confusing?
  - What's missing?
  - Would they use this?
  - Would they pay for it?

## Phase 7: Post-Launch

### Day 1-2: Monitor
- Watch Railway logs for errors
- Monitor Vercel error rates
- Check if real users are signing up

### Week 1: Optimize
- Improve onboarding based on feedback
- Add more demo data scenarios
- Create first case study

### Week 2: Integrations
- Submit SDK to PyPI (Python)
- Submit SDK to npm (JavaScript)
- Contact LangChain team about official integration
- Contact CrewAI team about official integration

### Week 3: Growth
- Write first blog post: "Why AI agents are draining your budget"
- Submit to Hacker News
- Post on Product Hunt
- Reach out to AI dev communities

## Troubleshooting

### Backend Won't Start
```bash
# Check Node version (need 18+)
node --version

# Check if ports are in use
lsof -i :3001
lsof -i :3000

# Clear and reinstall
rm -rf server/node_modules
cd server && npm install
npm run dev
```

### Dashboard Shows No Data
1. Is backend running? Check: http://localhost:3001/health
2. Is NEXT_PUBLIC_API_URL set correctly?
3. Are there any console errors? (F12 → Console)
4. Did you run the demo agent?

### Demo Agent Connection Refused
1. Is backend actually running?
2. Is the API URL correct?
3. Check if port 3001 is blocked by firewall

### Railway Deployment Failed
1. Check Railway build logs (Deployments tab)
2. Ensure Dockerfile exists at `/server/Dockerfile`
3. Check if docker build works locally: `docker build -t kinetic server/`

## Success Criteria

You'll know you're live when:
- ✅ Dashboard accessible at live URL
- ✅ Backend API responding to requests
- ✅ Demo agent can connect and send data
- ✅ Entropy values visible in real-time
- ✅ Kill-switch triggers appropriately
- ✅ Zero errors in console

Once all green, you're live! Next step: users and integrations.
