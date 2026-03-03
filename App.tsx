import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Layout } from "@/components/layout";

// Pages
import Dashboard from "@/pages/dashboard";
import TelemetryLog from "@/pages/telemetry";
import Webhooks from "@/pages/webhooks";
import TestingTab from "@/pages/testing";
import Pricing from "@/pages/pricing";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard}/>
        <Route path="/telemetry" component={TelemetryLog}/>
        <Route path="/webhooks" component={Webhooks}/>
        <Route path="/testing" component={TestingTab}/>
        <Route path="/pricing" component={Pricing}/>
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
