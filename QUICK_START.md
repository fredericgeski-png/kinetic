# Kinetic - Quick Start (5 minutes)

Get monitoring in 5 minutes. Seriously.

---

## 1. Start the Backend (30 seconds)

```bash
cd server
export OPENAI_API_KEY=sk-your-key-here
npm install
npm run dev
```

Backend now running at `http://localhost:3001`

---

## 2. Start the Frontend (30 seconds)

```bash
# In new terminal, from root
npm install
npm run dev
```

Dashboard now at `http://localhost:3000`

---

## 3. Install SDK in Your Project (1 minute)

### Python
```bash
pip install kinetic-integrity
```

### Node.js
```bash
npm install @kinetic/monitor
```

### Go
```bash
go get github.com/kinetic-integrity/go-monitor
```

---

## 4. Add 3 Lines to Your Agent (1 minute)

### Python

```python
from kinetic import KineticClient

kinetic = KineticClient("sk-test", "http://localhost:3001")

# After your agent generates a response:
result = kinetic.track(response_text, token_count)

if result.loopDetected:
    print(f"Loop detected! Entropy: {result.entropy}")
```

### Node.js

```javascript
import { KineticMonitor } from '@kinetic/monitor';

const monitor = new KineticMonitor("sk-test", "http://localhost:3001");

// After your agent generates a response:
const result = await monitor.track(responseText, tokenCount);

if (result.loopDetected) {
    console.log(`Loop detected! Entropy: ${result.entropy}`);
}
```

### Go

```go
import "github.com/kinetic-integrity/go-monitor/kinetic"

monitor := kinetic.NewMonitor("sk-test", "http://localhost:3001", "my-agent")

// After your agent generates a response:
result, err := monitor.Track(responseText, tokenCount)

if err == kinetic.ErrLoopDetected {
    fmt.Printf("Loop detected! Entropy: %.2f\n", result.Entropy)
}
```

---

## 5. Test It (2 minutes)

Generate some test responses from your agent:

```bash
# Python
python test_agent.py

# Node.js
node test_agent.js

# Go
go run test_agent.go
```

Watch the dashboard at `http://localhost:3000` update in real-time!

---

## 6. Open Dashboard (1 minute)

Go to `http://localhost:3000`

You should see:
- Real-time entropy chart
- Kill-switch status indicator
- Recent metrics table
- API configuration examples

---

## What You Get

- ✅ Real-time entropy monitoring
- ✅ Automatic loop detection
- ✅ Kill-switch auto-termination
- ✅ Waste prevention tracking
- ✅ Beautiful dashboard
- ✅ Open-source code

---

## Next Steps

### To Deploy

See [DEPLOYMENT.md](DEPLOYMENT.md) for options:
- Heroku (5 min)
- Railway (5 min)
- Docker (1 min)
- AWS (15 min)
- Self-hosted (30 min)

### To Integrate with Framework

**LangChain**:
```python
from kinetic import KineticCallback

callbacks = [KineticCallback(api_key="sk-...", endpoint="http://localhost:3001")]
agent = initialize_agent(..., callbacks=callbacks)
# Automatic monitoring!
```

**CrewAI**:
```python
from kinetic.integrations.crewai import KineticCrew

crew = KineticCrew(agents=[...], tasks=[...], api_key="sk-...")
result = crew.kickoff()
# Automatic monitoring!
```

### To Read Full Docs

- [README.md](README.md) - Full feature overview
- [DEPLOYMENT.md](DEPLOYMENT.md) - Production deployment
- [DEVELOPMENT.md](DEVELOPMENT.md) - Contributing guide
- [LAUNCH.md](LAUNCH.md) - Launch strategy

---

## Troubleshooting

**Backend won't start**
```bash
# Check OpenAI API key
echo $OPENAI_API_KEY

# Check logs
cat server/server.log
```

**Frontend won't connect**
```bash
# Test backend
curl http://localhost:3001/health

# Should return: {"status": "ok", ...}
```

**Entropy always 0**
```bash
# You need at least 2 responses
# Send multiple responses from your agent
```

**Kill-switch not triggering**
```bash
# Entropy must exceed 85%
# High similarity in consecutive responses = high entropy score
```

---

## Support

- 📖 [Full Documentation](README.md)
- 🐛 [Report Issues](https://github.com/kinetic-integrity/issues)
- 💬 [Discord Community](https://discord.gg/kinetic)
- 📧 [Email Support](mailto:support@kinetic.io)

---

That's it! You're now monitoring your AI agents.

Go catch those runaway loops.
