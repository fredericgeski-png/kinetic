import { useState } from "react";
import { useCalculateEntropy } from "@/hooks/use-tools";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Play, ActivitySquare, Terminal, ChevronRight } from "lucide-react";

export default function TestingTab() {
  const [input, setInput] = useState("");
  const { mutate, isPending, data, error } = useCalculateEntropy();
  const [logs, setLogs] = useState<Array<{type: 'req' | 'res' | 'err', content: string}>>([]);

  const handleTest = () => {
    if (!input.trim()) return;
    
    setLogs(prev => [...prev, { type: 'req', content: `Analyzing payload [${input.length} bytes]...` }]);
    
    mutate({ text: input }, {
      onSuccess: (res) => {
        setLogs(prev => [...prev, { 
          type: 'res', 
          content: `Entropy score calculated: ${res.entropy.toFixed(4)}\nStatus: ${res.entropy > 0.8 ? 'ANOMALOUS' : 'NORMAL'}` 
        }]);
      },
      onError: (err) => {
        setLogs(prev => [...prev, { type: 'err', content: `Error: ${err.message}` }]);
      }
    });
  };

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Agent Sandbox</h1>
        <p className="text-muted-foreground">Test the kinetic entropy calculation directly against the API.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        <Card className="border-white/10 bg-card/40 backdrop-blur-md p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <ActivitySquare className="h-5 w-5 text-primary" />
              Payload Input
            </h3>
          </div>
          
          <Textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste agent output, prompt chain, or action sequence here..."
            className="flex-1 bg-black/50 border-white/10 focus-visible:ring-primary font-mono text-sm resize-none"
          />
          
          <div className="pt-4 flex justify-between items-center">
            <span className="text-xs text-muted-foreground font-mono">{input.length} characters</span>
            <Button 
              onClick={handleTest} 
              disabled={isPending || !input.trim()}
              className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shadow-[0_0_15px_rgba(0,255,255,0.2)]"
            >
              <Play className="h-4 w-4" /> Calculate Entropy
            </Button>
          </div>
        </Card>

        <Card className="border-white/10 bg-[#0a0a0c] p-0 flex flex-col overflow-hidden shadow-[inset_0_0_50px_rgba(0,0,0,0.5)]">
          <div className="bg-black/80 border-b border-white/5 p-3 flex items-center gap-2">
            <Terminal className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-mono text-muted-foreground">Diagnostic Output</span>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto font-mono text-sm space-y-3">
            <div className="text-muted-foreground opacity-50 flex gap-2">
              <ChevronRight className="h-4 w-4" /> System initialized. Awaiting input.
            </div>
            
            {logs.map((log, i) => (
              <div key={i} className="flex gap-2 animate-in fade-in">
                <ChevronRight className={`h-4 w-4 mt-0.5 shrink-0 ${
                  log.type === 'req' ? 'text-primary' : 
                  log.type === 'err' ? 'text-destructive' : 'text-green-400'
                }`} />
                <div className={`whitespace-pre-wrap ${
                  log.type === 'req' ? 'text-foreground' : 
                  log.type === 'err' ? 'text-destructive' : 'text-green-400'
                }`}>
                  {log.content}
                </div>
              </div>
            ))}
            {isPending && (
              <div className="flex gap-2 animate-pulse text-primary">
                <ChevronRight className="h-4 w-4 mt-0.5" />
                Processing signal...
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
