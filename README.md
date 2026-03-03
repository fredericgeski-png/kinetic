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
