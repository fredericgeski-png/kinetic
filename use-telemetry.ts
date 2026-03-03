import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useTelemetryList() {
  return useQuery({
    queryKey: [api.telemetry.list.path],
    queryFn: async () => {
      const res = await fetch(api.telemetry.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch telemetry");
      const data = await res.json();
      return api.telemetry.list.responses[200].parse(data);
    },
  });
}

// Keeping this generic for the type injection
type TelemetryInput = typeof api.telemetry.create.input._type;

export function useCreateTelemetry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: TelemetryInput) => {
      const validated = api.telemetry.create.input.parse(data);
      const res = await fetch(api.telemetry.create.path, {
        method: api.telemetry.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const err = await res.json();
          throw new Error(err.message || "Validation failed");
        }
        throw new Error("Failed to create telemetry");
      }
      return api.telemetry.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.telemetry.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.stats.get.path] });
    },
  });
}
