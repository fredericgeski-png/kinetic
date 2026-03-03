import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

export default function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Basic monitoring for small projects",
      features: ["5 agents", "Basic dashboard", "Email support"],
      buttonText: "Current Plan",
      buttonVariant: "outline" as const,
      disabled: true,
    },
    {
      name: "Pro",
      price: "$299",
      description: "Advanced integrity monitoring for scale",
      features: [
        "Unlimited agents",
        "Advanced analytics",
        "Priority support",
        "Webhook integrations",
        "Custom rules",
      ],
      buttonText: "Upgrade to Pro",
      buttonVariant: "default" as const,
      href: "https://fredericgeski.selar.com/727l48e1z1",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-glow">Kinetic Pricing</h1>
        <p className="text-muted-foreground text-lg">
          Choose the right plan to protect your agentic workflows and prevent infinite loops.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto pt-8">
        {plans.map((plan) => (
          <Card 
            key={plan.name} 
            className={`glass-panel flex flex-col ${plan.name === 'Pro' ? 'border-primary/50 border-glow' : ''}`}
          >
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground ml-2">/month</span>
              </div>
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant={plan.buttonVariant}
                disabled={plan.disabled}
                asChild={!!plan.href}
                data-testid={`button-upgrade-${plan.name.toLowerCase()}`}
              >
                {plan.href ? (
                  <a href={plan.href} target="_blank" rel="noopener noreferrer">
                    {plan.buttonText}
                  </a>
                ) : (
                  <span>{plan.buttonText}</span>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
