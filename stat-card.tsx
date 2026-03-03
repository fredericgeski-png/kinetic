import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

export function StatCard({ title, value, icon: Icon, description, trend, trendValue }: StatCardProps) {
  return (
    <Card className="relative overflow-hidden border-white/10 bg-card/40 backdrop-blur-md group hover:border-primary/50 transition-colors duration-500">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="p-6 relative z-10">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        </div>
        
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight text-foreground font-mono">
            {value}
          </span>
          {trendValue && (
            <span className={`text-xs font-medium ${
              trend === "up" ? "text-red-400" : trend === "down" ? "text-green-400" : "text-muted-foreground"
            }`}>
              {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
            </span>
          )}
        </div>
        
        {description && (
          <p className="text-xs text-muted-foreground mt-2">
            {description}
          </p>
        )}
      </div>
    </Card>
  );
}
