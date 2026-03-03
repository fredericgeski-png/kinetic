# Kinetic Integrity Monitor

The Kinetic Integrity Monitor is an advanced observability and kill-switch system for autonomous agents (LangChain, CrewAI, OpenAI). It auto-detects loops, measures system entropy, and prevents compute waste by terminating runaway processes.

## Quick Start
1. Run `docker-compose up` to start the backend and database.
2. The Dashboard will be available at `http://localhost:5000`
3. Test the Python, Node.js, or Go SDKs located in their respective directories.

## SDK Usage

**Python:**
```python
from kinetic_monitor import KineticMonitor
monitor = KineticMonitor(agent_id="my-agent-1")
if monitor.check_loop("repeated thought"):
    print("Loop detected, terminating...")
```

**Node.js:**
```javascript
const KineticMonitor = require('./kinetic_monitor');
const monitor = new KineticMonitor("my-agent-1");
if (monitor.checkLoop("repeated thought")) {
    console.log("Loop detected, terminating...");
}
```

**Go:**
```go
import "kineticmonitor"
monitor := kineticmonitor.NewKineticMonitor("my-agent-1", "")
if monitor.CheckLoop("repeated thought") {
    fmt.Println("Loop detected, terminating...")
}
```

OPTION 1: DOCKER (Easiest - Recommended)
# 1. Install Docker (from docker.com)
# 2. Clone repo
git clone https://github.com/YOUR_USERNAME/kinetic.git
cd kinetic

# 3. Run everything
docker-compose up

# 4. Open browser
# Go to: http://localhost:3000
# Sign up → Get API key → Done! ✅
Time: 5 minutes
Difficulty: Very Easy
What it does:
Starts PostgreSQL (database)
Starts Redis (cache)
Starts Node.js backend
Starts web dashboard
Everything connected and ready
OPTION 2: PYTHON SDK (For Python Agents)
# 1. Install
pip install kinetic-integrity-monitor

# 2. In your agent code, add 2 lines:
from kinetic import KineticClient
kinetic = KineticClient(api_key="sk_your_key_here")

# ... your agent code ...
response = your_agent.run(prompt)

# 3. Track the response (critical line):
kinetic.track(response_text, token_count)

# 4. Run your agent
python your_agent.py
Time: 5 minutes
Difficulty: Easy
What it does:
Monitors your Python agent automatically
Detects loops
Calculates entropy
Reports to Kinetic dashboard
OPTION 3: NODE.JS SDK (For Node.js Agents)
# 1. Install
npm install @kinetic/monitor

# 2. In your code:
const KineticMonitor = require('@kinetic/monitor');
const monitor = new KineticMonitor({apiKey: 'sk_...'});

# ... your agent code ...
const response = await yourAgent.run(prompt);

# 3. Track response:
await monitor.track(responseText, tokenCount);

# 4. Run your agent
node your_agent.js
Time: 5 minutes
What it does:
Monitors your Node.js agent
Auto-detects loops
Real-time entropy tracking
OPTION 4: LOCAL DEVELOPMENT SETUP
# For developers who want to understand/modify the code

git clone https://github.com/YOUR_USERNAME/kinetic.git
cd kinetic

# Install backend
cd backend
npm install
npm start

# In another terminal: http://localhost:3000
Time: 20 minutes
Difficulty: Medium
TESTING YOUR SETUP (5 min)
# After docker-compose up (Option 1):

# 1. Open http://localhost:3000
# 2. Sign up with email
# 3. Go to Settings → Copy API Key
# 4. Test with Python:

from kinetic import KineticClient
kinetic = KineticClient(api_key="sk_YOUR_KEY")
kinetic.track("Test response", 100)
print("✅ Connected!")

# 5. Run: python test.py
# 6. If you see ✅, you're good!
WHAT YOU'LL SEE IN DASHBOARD
Active Sessions: 1
Agents Monitored: 1
Entropy: 0.23 (GREEN)
Tokens Used: 0
Kill-Switch: READY

As you use it:
✅ Each response tracked
✅ Entropy calculated real-time
✅ Dashboard updates live
✅ If loop detected → Kill-switch triggers
TROUBLESHOOTING
Problem
Solution
Port 3000 in use
docker-compose down then change PORT in .env
Docker won't start
Make sure Docker Desktop is running
API key error
Create new account, get new key
SDK install fails
pip install --upgrade pip then retry
WHICH OPTION?
Just trying it? → Docker (Option 1)
Have Python agent? → Python SDK (Option 2)
Have Node.js agent? → Node.js SDK (Option 3)
Want to contribute? → Local setup (Option 4)
SUCCESS CHECKLIST
When setup is complete:
[ ] Kinetic running (http://localhost:3000 opens)
[ ] Account created
[ ] API key obtained
[ ] SDK installed
[ ] 2 lines added to your agent
[ ] Agent is being monitored
If all checked: You're live! 🎉
WHAT HAPPENS NEXT
Your agent runs
Kinetic tracks every response
Entropy calculated in real-time
If loop detected → Kill-switch triggers
You're protected ✅
