# Deploy Kinetic to Railway.app

Railway.app is a modern, simple deployment platform perfect for getting Kinetic live in minutes.

## Quick Start (2 minutes)

### Step 1: Connect GitHub Repository

1. Go to [railway.app](https://railway.app)
2. Click "Create New Project"
3. Select "Deploy from GitHub"
4. Connect your GitHub account and select this repository
5. Click "Deploy"

Railway will automatically:
- Detect the Dockerfile
- Build the backend API
- Start the server on a public URL

### Step 2: Configure Environment Variables

In Railway dashboard:

1. Go to your project → Variables
2. Add: `NODE_ENV=production`
3. (Optional) Add `OPENAI_API_KEY=sk-...` for real embeddings
4. Leave blank for demo mode (uses mock embeddings)

### Step 3: Connect Frontend

Once backend is deployed:

1. Get your Railway backend URL (e.g., `https://kinetic-api-prod.railway.app`)
2. In your frontend `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=https://kinetic-api-prod.railway.app
   ```
3. Deploy frontend to Vercel

## Cost

- Free tier: $5 credit/month (more than enough for MVP)
- Generous free limits: 500 hours/month
- Auto-scales with demand
- No credit card needed initially

## Monitoring

In Railway dashboard:
- View logs in real-time
- Monitor CPU/memory usage
- Set up alerts for crashes
- View deployment history

## Next Steps

Once live:
1. Run the demo agent from your local machine to populate the dashboard
2. Invite early users to test
3. Collect feedback on the monitoring experience
4. Plan integration partnerships with LangChain, CrewAI

## Troubleshooting

### Deployment Failed
Check build logs: Project → Deployments → Build Logs

### API Not Responding
- Check health endpoint: `https://your-url.railway.app/health`
- View runtime logs in Railway dashboard

### Database Issues
SQLite is embedded in the Docker image, so it works out of the box. No additional setup needed.

## Scaling Beyond MVP

When ready to scale (1000+ agents):
1. Migrate from SQLite to PostgreSQL (Railway has managed Postgres)
2. Add Redis for caching
3. Implement proper load balancing
4. Set up monitoring with Datadog
