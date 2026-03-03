import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

// Helper to calculate Shannon entropy
function calculateShannonEntropy(text: string): number {
  if (!text || text.length === 0) return 0;
  
  const frequencies: Record<string, number> = {};
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    frequencies[char] = (frequencies[char] || 0) + 1;
  }
  
  let entropy = 0;
  const len = text.length;
  for (const char in frequencies) {
    const p = frequencies[char] / len;
    entropy -= p * Math.log2(p);
  }
  
  return entropy;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Telemetry routes
  app.get(api.telemetry.list.path, async (req, res) => {
    try {
      const records = await storage.getRecentTelemetry(100);
      res.json(records);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch telemetry" });
    }
  });

  app.post(api.telemetry.create.path, async (req, res) => {
    try {
      const input = api.telemetry.create.input.parse(req.body);
      const record = await storage.recordTelemetry(input);
      res.status(201).json(record);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Dashboard Stats
  app.get(api.stats.get.path, async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Entropy Calculation
  app.post(api.entropy.calculate.path, async (req, res) => {
    try {
      const { text } = api.entropy.calculate.input.parse(req.body);
      const entropy = calculateShannonEntropy(text);
      res.json({ entropy });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Kill Switch
  app.get(api.killSwitch.check.path, async (req, res) => {
    try {
      const isActive = await storage.checkKillSwitch();
      res.json({ active: isActive });
    } catch (error) {
      res.status(500).json({ message: "Failed to check kill switch" });
    }
  });

  // Webhooks
  app.get(api.webhooks.list.path, async (req, res) => {
    try {
      const hooks = await storage.getWebhooks();
      res.json(hooks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch webhooks" });
    }
  });

  app.post(api.webhooks.create.path, async (req, res) => {
    try {
      const input = api.webhooks.create.input.parse(req.body);
      const hook = await storage.createWebhook(input);
      res.status(201).json(hook);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete(api.webhooks.delete.path, async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      await storage.deleteWebhook(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete webhook" });
    }
  });

  // Integrations
  app.get(api.integrations.list.path, async (req, res) => {
    try {
      const list = await storage.getIntegrations();
      res.json(list);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch integrations" });
    }
  });

  app.post(api.integrations.create.path, async (req, res) => {
    try {
      const input = api.integrations.create.input.parse(req.body);
      const integration = await storage.createIntegration(input);
      res.status(201).json(integration);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}
