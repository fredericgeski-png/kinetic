# Kinetic Deployment Guide

Deploy Kinetic to production in multiple ways.

---

## Option 1: Local Development (Recommended for Testing)

### Prerequisites
- Node.js 18+
- Python 3.8+
- OpenAI API key

### Setup

```bash
# Clone repo
git clone https://github.com/kinetic-integrity/kinetic
cd kinetic

# Backend
cd server
cp .env.example .env
# Edit .env and add OPENAI_API_KEY
npm install
npm run dev

# Frontend (in new terminal)
cd ..
npm install
npm run dev
```

Access at: `http://localhost:3000`

---

## Option 2: Docker Compose (Recommended for Production)

### Prerequisites
- Docker & Docker Compose
- OpenAI API key

### Setup

```bash
# Clone repo
git clone https://github.com/kinetic-integrity/kinetic
cd kinetic

# Create .env
echo "OPENAI_API_KEY=sk-..." > .env

# Start services
docker-compose up

# Access at http://localhost:3000
```

### Configuration

Edit `docker-compose.yml` to customize:
- Ports
- Environment variables
- Volume mounts
- Resource limits

---

## Option 3: Vercel (Frontend Only)

### Prerequisites
- Vercel account
- Backend deployed separately

### Deploy Frontend

```bash
vercel deploy

# Set NEXT_PUBLIC_API_URL environment variable
# to your backend endpoint
```

---

## Option 4: Heroku

### Prerequisites
- Heroku account
- Heroku CLI

### Deploy Backend

```bash
# Create Heroku app
heroku create kinetic-api

# Add PostgreSQL
heroku addons:create heroku-postgresql:standard-0

# Set environment variables
heroku config:set OPENAI_API_KEY=sk-...
heroku config:set NODE_ENV=production

# Deploy
git push heroku main

# Your backend is now at https://kinetic-api.herokuapp.com
```

### Deploy Frontend

```bash
cd ..

# Create frontend app
heroku create kinetic-dashboard

# Set API URL
heroku config:set NEXT_PUBLIC_API_URL=https://kinetic-api.herokuapp.com

# Deploy
git push heroku main
```

---

## Option 5: Railway.app

### Prerequisites
- Railway account
- GitHub repository

### Setup

1. Go to [Railway.app](https://railway.app)
2. Click "New Project"
3. Select "GitHub Repo"
4. Connect your Kinetic repository

#### Backend Service

```toml
[backend]
name = "kinetic-server"
root = "server"
buildCommand = "npm install && npm run build"
startCommand = "npm start"
port = 3001
```

Add environment variables:
- `OPENAI_API_KEY`: Your API key
- `NODE_ENV`: `production`

#### Frontend Service

```toml
[frontend]
name = "kinetic-dashboard"
buildCommand = "npm install && npm run build"
startCommand = "npm start"
port = 3000
```

Add environment variables:
- `NEXT_PUBLIC_API_URL`: Backend URL from Railway

---

## Option 6: AWS Lambda + RDS

### Prerequisites
- AWS account
- Serverless Framework

### Deploy Backend

```bash
# Install Serverless Framework
npm install -g serverless

# Configure credentials
serverless config credentials --provider aws --key YOUR_KEY --secret YOUR_SECRET

# Deploy
serverless deploy
```

Update API Gateway URL in frontend configuration.

### Deploy Frontend

```bash
# Use AWS Amplify
amplify init
amplify add hosting
amplify publish
```

---

## Option 7: Self-Hosted (Linux VPS)

### Prerequisites
- Linux VPS (Ubuntu 20.04+)
- Docker installed

### Setup

```bash
# SSH into VPS
ssh root@your-vps-ip

# Clone repo
git clone https://github.com/kinetic-integrity/kinetic
cd kinetic

# Create .env
nano .env
# Add OPENAI_API_KEY=sk-...

# Start services
docker-compose up -d

# Setup reverse proxy (Nginx)
sudo apt-get install nginx
# Configure nginx to proxy to localhost:3000 and :3001
```

---

## Database Migration (SQLite → PostgreSQL)

For production deployments, migrate from SQLite to PostgreSQL:

### 1. Create PostgreSQL Database

```bash
createdb kinetic
```

### 2. Update Connection String

```bash
# .env
DATABASE_URL=postgresql://user:password@localhost:5432/kinetic
```

### 3. Update Server Code

```typescript
// src/db/index.ts
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export function getDatabase() {
  return pool;
}
```

### 4. Migrate Data

```bash
npm run migrate
```

---

## Monitoring & Logging

### Docker Logs

```bash
# Follow backend logs
docker-compose logs -f kinetic-server

# Follow frontend logs
docker-compose logs -f kinetic-frontend
```

### Performance Monitoring

```bash
# Install PM2 (for Node.js apps)
npm install -g pm2

# Monitor process
pm2 monit

# View logs
pm2 logs
```

---

## Security

### SSL/TLS Certificate

```bash
# Using Let's Encrypt (via Certbot)
sudo apt-get install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d kinetic.yourdomain.com
```

### Environment Variables

Never commit secrets to Git:

```bash
# .gitignore
.env
.env.local
.env.*.local
```

### API Key Rotation

Rotate API keys regularly:

```bash
# Generate new key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Update in production
heroku config:set OPENAI_API_KEY=sk-new-key
```

---

## Scaling

### Horizontal Scaling (Multiple Instances)

```bash
# With Docker
docker-compose up -d --scale kinetic-server=3

# With Kubernetes
kubectl scale deployment kinetic-server --replicas=3
```

### Database Connection Pooling

```typescript
// Use connection pooling for PostgreSQL
import { Pool } from 'pg';

const pool = new Pool({
  max: 20,  // Maximum connections
  min: 5,   // Minimum connections
});
```

### Caching

```typescript
// Use Redis for caching
import redis from 'redis';

const client = redis.createClient();
const cached = await client.get(`entropy:${agentId}`);
```

---

## Backup & Recovery

### Database Backup (PostgreSQL)

```bash
# Daily backup
pg_dump kinetic > backup-$(date +%Y%m%d).sql

# Upload to S3
aws s3 cp backup-*.sql s3://your-bucket/backups/
```

### Database Restore

```bash
# Restore from backup
psql kinetic < backup-20240101.sql
```

---

## Troubleshooting

### Backend won't start

```bash
# Check environment variables
echo $OPENAI_API_KEY

# Check logs
docker logs kinetic-server

# Verify database
sqlite3 kinetic.db ".tables"
```

### Frontend won't connect to backend

```bash
# Check API URL
echo $NEXT_PUBLIC_API_URL

# Test backend connectivity
curl http://localhost:3001/health

# Check CORS settings in backend
```

### Out of memory

```bash
# Increase container memory
docker-compose.yml:
  services:
    kinetic-server:
      mem_limit: 1g
```

---

## Support

- Documentation: https://docs.kinetic.io
- Issues: https://github.com/kinetic-integrity/issues
- Email: support@kinetic.io
