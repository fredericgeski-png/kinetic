import { useWebhooks, useCreateWebhook, useDeleteWebhook } from "@/hooks/use-webhooks";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Webhook as WebhookIcon, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@shared/routes";
import { z } from "zod";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

type FormValues = z.infer<typeof api.webhooks.create.input>;

export default function Webhooks() {
  const { data: webhooks, isLoading } = useWebhooks();
  const createWebhook = useCreateWebhook();
  const deleteWebhook = useDeleteWebhook();
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(api.webhooks.create.input),
    defaultValues: {
      name: "",
      url: "",
      eventType: "all",
    },
  });

  const onSubmit = (data: FormValues) => {
    createWebhook.mutate(data, {
      onSuccess: () => {
        setIsOpen(false);
        form.reset();
        toast({ title: "Webhook created successfully", variant: "default" });
      },
      onError: (err) => {
        toast({ title: "Error creating webhook", description: err.message, variant: "destructive" });
      }
    });
  };

  const handleDelete = (id: number) => {
    deleteWebhook.mutate(id, {
      onSuccess: () => toast({ title: "Webhook deleted", variant: "default" }),
      onError: (err) => toast({ title: "Failed to delete", description: err.message, variant: "destructive" })
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Webhooks</h1>
          <p className="text-muted-foreground">Manage external notification endpoints.</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/80 shadow-[0_0_15px_rgba(0,255,255,0.3)]">
              <Plus className="h-4 w-4" /> Add Webhook
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-xl border-white/10">
            <DialogHeader>
              <DialogTitle>Add New Webhook</DialogTitle>
              <DialogDescription>
                Configure an endpoint to receive system events.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Slack Alerts" className="bg-black/50 border-white/10 focus-visible:ring-primary" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endpoint URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." className="bg-black/50 border-white/10 focus-visible:ring-primary" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="eventType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-black/50 border-white/10 focus-visible:ring-primary">
                            <SelectValue placeholder="Select event type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-card border-white/10">
                          <SelectItem value="all">All Events</SelectItem>
                          <SelectItem value="loop_detected">Loop Detected</SelectItem>
                          <SelectItem value="auto_terminated">Auto Terminated</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="pt-4 flex justify-end">
                  <Button type="submit" disabled={createWebhook.isPending} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    {createWebhook.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Webhook"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-white/10 bg-card/40 backdrop-blur-md overflow-hidden">
        {isLoading ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-black/40">
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead>NAME</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>EVENTS</TableHead>
                <TableHead className="text-right">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {webhooks?.map((webhook) => (
                <TableRow key={webhook.id} className="border-white/5 hover:bg-white/5 transition-colors">
                  <TableCell className="font-medium flex items-center gap-2">
                    <WebhookIcon className="h-4 w-4 text-muted-foreground" />
                    {webhook.name}
                  </TableCell>
                  <TableCell className="font-mono text-muted-foreground text-sm truncate max-w-[300px]">
                    {webhook.url}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full border border-white/10 px-2.5 py-0.5 text-xs font-semibold bg-white/5">
                      {webhook.eventType}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(webhook.id)}
                      disabled={deleteWebhook.isPending}
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              
              {(!webhooks || webhooks.length === 0) && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                    <div className="flex flex-col items-center justify-center">
                      <WebhookIcon className="h-10 w-10 mb-4 opacity-20" />
                      <p>No webhooks configured.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
