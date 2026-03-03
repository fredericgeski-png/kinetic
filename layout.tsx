import { Link, useLocation } from "wouter";
import { 
  Activity, 
  LayoutDashboard, 
  TerminalSquare, 
  Webhook,
  PowerOff,
  ShieldAlert,
  CreditCard
} from "lucide-react";
import { useKillSwitchCheck } from "@/hooks/use-tools";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/telemetry", label: "Telemetry Log", icon: Activity },
  { href: "/webhooks", label: "Webhooks", icon: Webhook },
  { href: "/testing", label: "Agent Testing", icon: TerminalSquare },
  { href: "/pricing", label: "Pricing", icon: CreditCard },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { data: killSwitch } = useKillSwitchCheck();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-card/30 flex flex-col backdrop-blur-xl">
        <div className="p-6">
          <div className="flex items-center gap-3 font-semibold text-lg text-primary text-glow">
            <ShieldAlert className="h-6 w-6" />
            <span>Kinetic Monitor</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2 font-mono">v1.4.2-stable</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 group ${
                    isActive
                      ? "bg-primary/10 text-primary border-glow"
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  }`}
                >
                  <item.icon
                    className={`h-4 w-4 ${
                      isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                    }`}
                  />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto">
          <div className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-muted-foreground">SYSTEM STATUS</span>
              {killSwitch?.active ? (
                <Badge variant="destructive" className="animate-pulse">ENGAGED</Badge>
              ) : (
                <Badge variant="outline" className="border-green-500/50 text-green-400 bg-green-500/10">ONLINE</Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <PowerOff className="h-3 w-3" />
              <span>Kill Switch Monitor</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Top ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="flex-1 overflow-y-auto p-8 relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
