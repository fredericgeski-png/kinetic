import { useTelemetryList } from "@/hooks/use-telemetry";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

export default function TelemetryLog() {
  const { data: telemetry, isLoading } = useTelemetryList();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Telemetry Log</h1>
        <p className="text-muted-foreground">Raw event stream from all connected SDKs.</p>
      </div>

      <Card className="border-white/10 bg-card/40 backdrop-blur-md overflow-hidden">
        {isLoading ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-black/40">
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="font-mono">TIMESTAMP</TableHead>
                  <TableHead className="font-mono">AGENT ID</TableHead>
                  <TableHead className="font-mono">SDK</TableHead>
                  <TableHead className="font-mono">ENTROPY</TableHead>
                  <TableHead className="font-mono">STATUS</TableHead>
                  <TableHead className="text-right font-mono">SAVINGS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {telemetry?.sort((a, b) => new Date(b.timestamp!).getTime() - new Date(a.timestamp!).getTime()).map((event) => (
                  <TableRow key={event.id} className="border-white/5 hover:bg-white/5 transition-colors">
                    <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                      {format(new Date(event.timestamp!), "MMM dd, yyyy HH:mm:ss")}
                    </TableCell>
                    <TableCell className="font-mono text-primary text-sm">
                      {event.agentId}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-white/20 bg-black/40 text-xs">
                        {event.sdkType}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      <span className={Number(event.entropyScore) > 0.8 ? "text-red-400 font-bold" : "text-muted-foreground"}>
                        {Number(event.entropyScore).toFixed(3)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {event.loopDetected && (
                          <Badge variant="destructive" className="bg-orange-500/20 text-orange-400 border-orange-500/50">Loop</Badge>
                        )}
                        {event.autoTerminated && (
                          <Badge variant="destructive" className="bg-red-500/20 text-red-400 border-red-500/50">Killed</Badge>
                        )}
                        {!event.loopDetected && !event.autoTerminated && (
                          <Badge variant="outline" className="text-green-400 border-green-500/50 bg-green-500/10">Normal</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm text-green-400">
                      ${event.wastePrevented}
                    </TableCell>
                  </TableRow>
                ))}
                
                {(!telemetry || telemetry.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      No telemetry data received yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
}
