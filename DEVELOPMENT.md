# Kinetic Development Guide

Contributing guide and development setup.

---

## Project Structure

```
kinetic/
├── server/                    # Node.js/Express backend
│   ├── src/
│   │   ├── index.ts          # Entry point
│   │   ├── db/               # Database layer
│   │   ├── services/         # Business logic
│   │   │   └── entropy.ts   # Core algorithm
│   │   └── routes/           # API routes
│   ├── Dockerfile
│   └── package.json
│
├── app/                       # Next.js frontend
│   ├── page.tsx              # Dashboard page
│   └── layout.tsx            # Root layout
│
├── components/                # React components
│   ├── entropy-chart.tsx
│   ├── kill-switch-status.tsx
│   ├── metrics-table.tsx
│   └── api-config.tsx
│
├── sdk-python/               # Python SDK
│   ├── kinetic/
│   │   ├── client.py
│   │   └── integrations/
│   │       ├── langchain_callback.py
│   │       └── crewai.py
│   └── setup.py
│
├── sdk-js/                   # Node.js SDK
│   ├── src/
│   │   └── index.ts
│   └── package.json
│
└── sdk-go/                   # Go SDK
    ├── kinetic/
    │   └── client.go
    └── go.mod
```

---

## Development Setup

### Backend

```bash
cd server

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env and add OPENAI_API_KEY

# Start development server
npm run dev

# Watch TypeScript
npm run watch

# Run tests (when available)
npm test
```

### Frontend

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

### Python SDK

```bash
cd sdk-python

# Install in development mode
pip install -e .

# Install with LangChain extras
pip install -e ".[langchain]"

# Run tests
python -m pytest tests/

# Format code
black kinetic/
```

### Node.js SDK

```bash
cd sdk-js

# Install dependencies
npm install

# Build TypeScript
npm run build

# Watch for changes
npm run dev
```

### Go SDK

```bash
cd sdk-go

# Run tests
go test ./...

# Format code
gofmt -s -w ./

# Lint
go vet ./...
```

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  api_key TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  webhook_url TEXT,
  created_at INTEGER NOT NULL
);
```

### Sessions Table
```sql
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  agent_id TEXT NOT NULL,
  entropy REAL DEFAULT 0,
  kill_switch_triggered INTEGER DEFAULT 0,
  waste_prevented_cents INTEGER DEFAULT 0,
  started_at INTEGER NOT NULL,
  ended_at INTEGER,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Telemetry Table
```sql
CREATE TABLE telemetry (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  response_id TEXT NOT NULL,
  response_text TEXT NOT NULL,
  tokens INTEGER NOT NULL,
  entropy REAL DEFAULT 0,
  loop_detected INTEGER DEFAULT 0,
  timestamp INTEGER NOT NULL,
  FOREIGN KEY (session_id) REFERENCES sessions(id)
);
```

---

## API Endpoints

### Calculate Entropy

```
POST /api/v1/calculate-entropy
```

**Request:**
```json
{
  "responses": ["text1", "text2", ...],
  "tokens": [100, 95, ...],
  "agent_id": "optional",
  "session_id": "optional"
}
```

**Response:**
```json
{
  "entropy": 42.5,
  "loopDetected": false,
  "wastePrevented": 250,
  "similarity": 0.42,
  "tokenDelta": 5,
  "session_id": "sess_xxx",
  "telemetry_id": "tel_xxx"
}
```

### Kill-Switch Check

```
POST /api/v1/kill-switch/check
```

### Telemetry

```
POST /api/v1/telemetry
```

### Metrics

```
GET /api/v1/metrics?period=24h|7d|30d
```

### Sessions

```
GET /api/v1/sessions/{session_id}
```

---

## Entropy Algorithm Details

The entropy calculation uses semantic embeddings to detect loops:

1. **Generate Embeddings**: Use OpenAI's text-embedding-3-small for last 3 responses
2. **Calculate Similarity**: Compute cosine similarity between consecutive embeddings
3. **Detect Loops**: If similarity > 0.85 AND token_delta < 20, loop detected
4. **Calculate Entropy**: entropy = (1 - avg_similarity) * 100

### Example

```python
from kinetic.services.entropy import calculateEntropy

responses = [
    "The answer is 42",
    "The answer is 42",
    "Let me calculate again..."
]
tokens = [50, 50, 75]

result = await calculateEntropy(responses, tokens)
# entropy: 15.3 (high similarity = low entropy)
# loopDetected: true (similarity 0.98 > 0.85)
```

---

## Testing

### Backend Tests

```bash
cd server

# Unit tests
npm test

# Integration tests
npm run test:integration

# Coverage
npm run test:coverage
```

### Frontend Tests

```bash
# Component tests
npm run test

# E2E tests
npm run test:e2e
```

### SDK Tests

```bash
# Python
cd sdk-python
pytest tests/

# Node.js
cd sdk-js
npm test

# Go
cd sdk-go
go test ./...
```

---

## Code Style

### Python
- Follow PEP 8
- Use Black for formatting
- Use mypy for type checking

```bash
black kinetic/
mypy kinetic/
```

### TypeScript/JavaScript
- Follow ESLint rules
- Use Prettier for formatting

```bash
npm run lint
npm run format
```

### Go
- Follow Go conventions
- Use gofmt for formatting

```bash
gofmt -s -w ./
go vet ./...
```

---

## Debugging

### Backend

```typescript
// Add debug logs
console.log('[v0] Debug message:', variable);

// In production, use a logger
import logger from './logger';
logger.debug('message', { variable });
```

### Frontend

```typescript
// React DevTools browser extension
// Redux DevTools for state management

// Debug network requests
// Open browser DevTools → Network tab
```

### Python SDK

```python
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger('kinetic')
logger.debug('Debug message')
```

---

## Common Tasks

### Add a New API Endpoint

1. Create route handler in `src/routes/api.ts`
2. Add database query in `src/db/index.ts`
3. Document in API spec

### Update Entropy Algorithm

1. Modify `src/services/entropy.ts`
2. Update corresponding SDKs
3. Add tests

### Add Framework Integration

1. Create file in `sdk-python/kinetic/integrations/`
2. Follow existing patterns (LangChain, CrewAI)
3. Add examples and tests

### Deploy to Staging

```bash
git push origin develop
# CI/CD pipeline automatically deploys to staging
```

### Deploy to Production

```bash
git push origin main
# CI/CD pipeline automatically deploys to production
```

---

## Git Workflow

### Branch Naming

```
feature/add-webhook-integration
bugfix/entropy-calculation-error
docs/deployment-guide
```

### Commit Messages

```
feat: Add webhook integration for Slack
fix: Correct entropy calculation algorithm
docs: Update API documentation
test: Add unit tests for entropy service
```

### Pull Request Process

1. Create feature branch
2. Make changes with tests
3. Submit PR with description
4. Wait for CI checks to pass
5. Request review
6. Merge after approval

---

## Performance Optimization

### Backend

```typescript
// Use database indices
db.run('CREATE INDEX idx_sessions_user_id ON sessions(user_id)');

// Connection pooling
import { Pool } from 'pg';
const pool = new Pool({ max: 20 });

// Caching
const cache = new Map();
```

### Frontend

```typescript
// Code splitting
const EntropyChart = dynamic(() => import('@/components/entropy-chart'), {
  loading: () => <Skeleton />,
});

// React.memo for expensive components
export const ExpensiveComponent = React.memo(Component);
```

---

## Monitoring & Logging

### Server Logs

```bash
# Follow logs in development
npm run dev

# In production
docker logs kinetic-server --follow
```

### Error Tracking

```typescript
// Implement Sentry for error tracking
import * as Sentry from "@sentry/node";

Sentry.captureException(error);
```

### Performance Monitoring

```typescript
// Add timing instrumentation
console.time('calculate-entropy');
const result = await calculateEntropy(responses, tokens);
console.timeEnd('calculate-entropy');
```

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for our community standards.

---

## Support

- **Discord**: Join our development channel
- **Issues**: Report bugs on GitHub
- **Discussions**: Discuss features on GitHub Discussions

---

## License

All code is MIT licensed. See LICENSE file for details.
