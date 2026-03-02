# Kinetic Integrity Monitor

🚀 **PRODUCTION READY - LAUNCH NOW**

**→ Quick Start:** Read [`START_HERE.md`](START_HERE.md) or run `./launch.sh`  
**→ Deploy:** [`LIVE_NOW.md`](LIVE_NOW.md) (5-minute guide)  
**→ Status:** All code built, tested, documented. Ready for production.

---

**Stop AI agent runaway loops before they drain your budget.**

Real-time semantic entropy monitoring, loop detection, and automatic kill-switches for AI agents across all frameworks.

> **Status**: MVP Launch Ready | **SDKs**: Python, Node.js, Go | **Integrations**: LangChain, CrewAI, and more

---

## Problem

AI agents can enter infinite loops:
- **Retry loops**: Agent retries the same action 50+ times
- **Search loops**: Agent searches the same space repeatedly  
- **Token loops**: Agent generates identical responses, wasting tokens

**Result**: $500+ bills from a single agent failure.

## Solution

Kinetic monitors every agent response in real-time:
1. **Calculates semantic entropy** using OpenAI embeddings
2. **Detects loops** when entropy exceeds threshold
3. **Auto-terminates** agents before waste accumulates
4. **Prevents waste** before it happens

**Typical savings**: $5-50 per incident. Scales with agent complexity.

---

## Quick Start (3 Lines)

### Python
```bash
pip install kinetic-integrity
```

```python
from kinetic import KineticClient

kinetic = KineticClient(api_key="sk-your-key", endpoint="http://localhost:3001")
result = kinetic.track(response_text, token_count)
```

### Node.js
```bash
npm install @kinetic/monitor
```

```javascript
import { KineticMonitor } from '@kinetic/monitor';

const monitor = new KineticMonitor('sk-your-key', 'http://localhost:3001');
const result = await monitor.track(responseText, tokenCount);
```

### Go
```bash
go get github.com/kinetic-integrity/go-monitor
```

```go
import "github.com/kinetic-integrity/go-monitor/kinetic"

monitor := kinetic.NewMonitor("sk-...", "http://localhost:3001", "my-agent")
result, err := monitor.Track(responseText, tokenCount)
```

---

## Zero-Friction Integration

### With LangChain (Automatic)

```python
from kinetic import KineticCallback
from langchain.agents import initialize_agent

callbacks = [KineticCallback(api_key="sk-...")]
agent = initialize_agent(..., callbacks=callbacks)

# Entropy tracking is automatic!
result = agent.run("Do something")
```

### With CrewAI (Automatic)

```python
from kinetic.integrations.crewai import KineticCrew

crew = KineticCrew(
    agents=[agent1, agent2],
    tasks=[task1, task2],
    api_key="sk-..."
)

# All agents monitored automatically
result = crew.kickoff()
```

### Custom Integration

```python
agent_response = my_agent.run(prompt)
kinetic.track(agent_response, count_tokens(agent_response))

# If loop detected:
# → KineticTerminated exception raised
# → Agent terminated automatically
# → Waste prevented
```

---

## How It Works

### Algorithm

```
1. Collect last 5 agent responses
2. Generate embeddings using OpenAI API
3. Calculate cosine similarity between consecutive responses
4. If similarity > 85% AND token_delta < 20: LOOP DETECTED
5. Entropy = (1 - avg_similarity) * 100
```

### Entropy Score

- **0-30**: Healthy, diverse responses
- **30-70**: Normal operation
- **70-85**: Warning zone, increasing loop likelihood
- **85-100**: Critical, loop highly likely → **Kill-switch triggers**

---

## Architecture

### Backend
- **Server**: Node.js + Express
- **Database**: SQLite (MVP) → PostgreSQL (production)
- **Embeddings**: OpenAI text-embedding-3-small
- **Deployment**: Docker, Heroku, Railway, etc.

### Frontend
- **Dashboard**: React + Next.js
- **Charts**: Real-time entropy visualization
- **Metrics**: Kill-switch history, waste prevented

### SDKs
- **Python**: Full async support, LangChain callbacks, offline queueing
- **Node.js**: TypeScript, ESM/CommonJS, retry logic
- **Go**: Production-ready, minimal dependencies

---

## Features

- ✅ Real-time entropy calculation
- ✅ Semantic loop detection
- ✅ Automatic kill-switch termination
- ✅ Offline queueing & retry
- ✅ Waste prevention estimates
- ✅ Multiple language SDKs
- ✅ Framework integrations (LangChain, CrewAI)
- ✅ Webhook notifications
- ✅ REST API
- ✅ Live dashboard

---

## Setup

### 1. Start Backend Server

```bash
cd server
cp .env.example .env
# Add your OPENAI_API_KEY to .env
npm install
npm run dev
# Server running on http://localhost:3001
```

### 2. Start Frontend Dashboard

```bash
npm install
npm run dev
# Dashboard at http://localhost:3000
```

### 3. Or use Docker Compose

```bash
OPENAI_API_KEY=sk-... docker-compose up
```

### 4. Install SDK in Your Project

```bash
pip install kinetic-integrity
```

---

## Configuration

### Environment Variables

```bash
# Backend (.env)
PORT=3001
NODE_ENV=development
OPENAI_API_KEY=sk-your-key
FRONTEND_URL=http://localhost:3000

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Client Options

```python
KineticClient(
    api_key="sk-...",
    endpoint="http://localhost:3001",  # Custom endpoint
    agent_id="my-agent",               # Agent identifier
    auto_terminate=True,               # Raise on loop
    offline_queue_size=1000            # Queue size
)
```

---

## API Reference

### Calculate Entropy

```
POST /api/v1/calculate-entropy
Authorization: Bearer sk-...
Content-Type: application/json

{
  "responses": ["response1", "response2", ...],
  "tokens": [100, 95, ...],
  "agent_id": "my-agent",
  "session_id": "optional-session-id"
}

Response:
{
  "entropy": 45.23,
  "loopDetected": false,
  "wastePrevented": 250,
  "similarity": 0.42,
  "tokenDelta": 5,
  "session_id": "sess_xxx",
  "telemetry_id": "tel_xxx"
}
```

### Check Kill-Switch

```
POST /api/v1/kill-switch/check
Authorization: Bearer sk-...

{
  "entropy": 45.23,
  "session_id": "sess_xxx"
}

Response:
{
  "should_terminate": false,
  "entropy": 45.23,
  "threshold": 85,
  "severity": "warning"
}
```

### Get Metrics

```
GET /api/v1/metrics?period=24h
Authorization: Bearer sk-...

Response:
{
  "period": "24h",
  "stats": {
    "total_sessions": 42,
    "avg_entropy": 45.5,
    "max_entropy": 92.3,
    "kill_switches_triggered": 2,
    "total_waste_prevented": {
      "cents": 5000,
      "dollars": 50.00
    },
    "loops_detected": 3
  }
}
```

---

## Examples

### Basic Agent Monitoring

```python
from kinetic import KineticClient
import anthropic

kinetic = KineticClient(api_key="sk-...", endpoint="http://localhost:3001")
client = anthropic.Anthropic()

for i in range(10):
    response = client.messages.create(
        model="claude-3-opus-20240229",
        max_tokens=1024,
        messages=[
            {"role": "user", "content": "Solve this complex problem"}
        ],
    )
    
    text = response.content[0].text
    tokens = response.usage.output_tokens
    
    result = kinetic.track(text, tokens)
    print(f"Entropy: {result.entropy:.2f}, Loop: {result.loopDetected}")
```

### LangChain with Callbacks

```python
from kinetic import KineticCallback
from langchain.agents import AgentType, initialize_agent
from langchain.llms import OpenAI
from langchain.tools import Tool

llm = OpenAI(temperature=0)
tools = [
    Tool(name="Search", func=search_api, description="..."),
    Tool(name="Calculator", func=calculator, description="..."),
]

kinetic_callback = KineticCallback(api_key="sk-...")
callbacks = [kinetic_callback]

agent = initialize_agent(
    tools,
    llm,
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    callbacks=callbacks,
)

result = agent.run("What is 2^10?")
# Entropy automatically tracked!
```

### CrewAI with Monitoring

```python
from crewai import Agent, Task, Crew
from kinetic.integrations.crewai import KineticCrew

researcher = Agent(
    role="Research Analyst",
    goal="Research and summarize information",
    llm=llm
)

research_task = Task(
    description="Research AI safety",
    agent=researcher,
)

crew = KineticCrew(
    agents=[researcher],
    tasks=[research_task],
    api_key="sk-..."
)

result = crew.kickoff()
# All agents monitored automatically!
```

---

## Pricing (Planned)

| Tier | Price | Features |
|------|-------|----------|
| **Free** | $0 | 5 agents, basic entropy, web dashboard |
| **Pro** | $299/mo | Unlimited agents, advanced ML, integrations |
| **Enterprise** | Custom | White-label, dedicated support, SLA |

---

## Roadmap

### Phase 1 (MVP) ✅
- Core entropy calculation
- Basic kill-switch
- Python/Node.js/Go SDKs
- LangChain integration
- React dashboard

### Phase 2 (Month 2)
- Historical analytics & trends
- Advanced ML models for loop detection
- CrewAI integration
- Webhook integrations (Slack, PagerDuty)
- Rate limiting per agent

### Phase 3 (Month 3)
- White-label dashboard
- Custom alert rules
- Marketplace for community models
- Data export & compliance

### Phase 4 (Month 4+)
- Multi-language UI
- Enterprise SSO
- Advanced observability
- Mobile app

---

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Areas We Need Help
- Framework integrations (AutoGPT, Llama Index, etc.)
- Advanced entropy models
- Community examples
- Documentation translations

---

## License

MIT - Free to use, modify, and distribute.

---

## Community

- **Discord**: [Join our community](https://discord.gg/kinetic)
- **GitHub**: [github.com/kinetic-integrity](https://github.com/kinetic-integrity)
- **Twitter/X**: [@KineticMonitor](https://twitter.com/kineticmonitor)
- **Email**: hello@kinetic.io

---

## FAQ

**Q: Does Kinetic see my agent's data?**  
A: Only response text and token counts. No task context or sensitive data is stored.

**Q: Can I run Kinetic on-premises?**  
A: Yes! Deploy the Docker container anywhere. No SaaS required.

**Q: What if I don't use OpenAI?**  
A: The SDK works with any LLM. We use OpenAI for embeddings only, which is optional.

**Q: How much does entropy calculation cost?**  
A: Approximately $0.0001 per response (OpenAI embedding API). Usually offset by waste prevented.

**Q: Can I integrate with my custom agent framework?**  
A: Yes! Use our REST API directly. Takes 30 minutes to integrate.

---

## Support

- Documentation: https://docs.kinetic.io
- API Reference: https://api.kinetic.io
- Issues: https://github.com/kinetic-integrity/issues
- Email: support@kinetic.io

---

Built with ❤️ for AI safety and developer sanity.
