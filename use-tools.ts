import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";

export function useKillSwitchCheck() {
  return useQuery({
    queryKey: [api.killSwitch.check.path],
    queryFn: async () => {
      const res = await fetch(api.killSwitch.check.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to check kill switch");
      return api.killSwitch.check.responses[200].parse(await res.json());
    },
    refetchInterval: 10000,
  });
}

type EntropyInput = z.infer<typeof api.entropy.calculate.input>;

export function useCalculateEntropy() {
  return useMutation({
    mutationFn: async (data: EntropyInput) => {
      const validated = api.entropy.calculate.input.parse(data);
      const res = await fetch(api.entropy.calculate.path, {
        method: api.entropy.calculate.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const err = await res.json();
          throw new Error(err.message || "Validation failed");
        }
        throw new Error("Failed to calculate entropy");
      }
      return api.entropy.calculate.responses[200].parse(await res.json());
    },
  });
}
