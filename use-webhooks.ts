import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";

export function useWebhooks() {
  return useQuery({
    queryKey: [api.webhooks.list.path],
    queryFn: async () => {
      const res = await fetch(api.webhooks.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch webhooks");
      return api.webhooks.list.responses[200].parse(await res.json());
    },
  });
}

type WebhookInput = z.infer<typeof api.webhooks.create.input>;

export function useCreateWebhook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: WebhookInput) => {
      const validated = api.webhooks.create.input.parse(data);
      const res = await fetch(api.webhooks.create.path, {
        method: api.webhooks.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const err = await res.json();
          throw new Error(err.message || "Validation failed");
        }
        throw new Error("Failed to create webhook");
      }
      return api.webhooks.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.webhooks.list.path] }),
  });
}

export function useDeleteWebhook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.webhooks.delete.path, { id });
      const res = await fetch(url, {
        method: api.webhooks.delete.method,
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 404) throw new Error("Webhook not found");
        throw new Error("Failed to delete webhook");
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.webhooks.list.path] }),
  });
}
