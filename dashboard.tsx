import { useDashboardStats, useTelemetryList } from "@/hooks/use-stats";
import { StatCard } from "@/components/stat-card";
import { useTelemetryList as useTelemetry } from "@/hooks/use-telemetry";
import { Activity, ShieldCheck, Zap, Repeat, Loader2, ArrowUpCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: telemetry, isLoading: telemetryLoading } = useTelemetry();

  if (statsLoading || telemetryLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Transform telemetry data for the chart (grouping by minute or showing last 20 events)
  const chartData = [...(telemetry || [])]
    .sort((a, b) => new Date(a.timestamp!).getTime() - new Date(b.timestamp!).getTime())
    .slice(-20)
    .map(t => ({
      time: format(new Date(t.timestamp!), "HH:mm:ss"),
      entropy: Number(t.entropyScore),
    }));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Platform Overview</h1>
          <p className="text-muted-foreground">Real-time metrics and agent integrity monitoring.</p>
        </div>
        <Button asChild className="gap-2 shadow-lg shadow-primary/20" data-testid="button-upgrade-dashboard">
          <Link href="/pricing">
            <ArrowUpCircle className="h-4 w-4" />
            Upgrade to Pro
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Sessions"
          value={stats?.activeSessions || 0}
          icon={Activity}
          description="Agents currently monitored"
        />
        <StatCard
          title="Avg Entropy Score"
          value={stats?.averageEntropy?.toFixed(2) || "0.00"}
          icon={Zap}
          trend={stats?.averageEntropy! > 0.8 ? "up" : "down"}
          trendValue="0.05"
          description="System-wide chaotic action probability"
        />
        <StatCard
          title="Waste Prevented"
          value={`$${stats?.wastePrevented || 0}`}
          icon={ShieldCheck}
          description="Estimated cost savings"
        />
        <StatCard
          title="Loops Detected"
          value={stats?.totalLoopsDetected || 0}
          icon={Repeat}
          description="Auto-terminated infinite loops"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-white/10 bg-card/40 backdrop-blur-md p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium">System Entropy Over Time</h3>
            <p className="text-sm text-muted-foreground">Tracking anomalous behavior across all active agents.</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorEntropy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis 
                  dataKey="time" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12} 
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 1]}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '8px',
                    fontFamily: 'var(--font-mono)'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="entropy" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorEntropy)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="border-white/10 bg-card/40 backdrop-blur-md p-6 overflow-hidden flex flex-col">
          <div className="mb-4">
            <h3 className="text-lg font-medium">Recent Interventions</h3>
            <p className="text-sm text-muted-foreground">Latest auto-terminations.</p>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {telemetry?.filter(t => t.autoTerminated).slice(0, 5).map(event => (
              <div key={event.id} className="p-3 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-mono text-primary">{event.agentId}</p>
                  <p className="text-xs text-muted-foreground">{format(new Date(event.timestamp!), "MMM d, HH:mm:ss")}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-red-400">Terminated</p>
                  <p className="text-xs font-mono text-muted-foreground">E: {Number(event.entropyScore).toFixed(2)}</p>
                </div>
              </div>
            ))}
            {(!telemetry || telemetry.filter(t => t.autoTerminated).length === 0) && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No recent interventions.
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
