import { db } from "./db";
import {
  telemetry,
  webhooks,
  integrations,
  type InsertTelemetry,
  type Telemetry,
  type InsertWebhook,
  type Webhook,
  type InsertIntegration,
  type Integration,
  type DashboardStats
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  recordTelemetry(data: InsertTelemetry): Promise<Telemetry>;
  getRecentTelemetry(limit?: number): Promise<Telemetry[]>;
  getDashboardStats(): Promise<DashboardStats>;
  createWebhook(webhook: InsertWebhook): Promise<Webhook>;
  getWebhooks(): Promise<Webhook[]>;
  deleteWebhook(id: number): Promise<void>;
  getIntegrations(): Promise<Integration[]>;
  createIntegration(integration: InsertIntegration): Promise<Integration>;
  checkKillSwitch(): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async recordTelemetry(data: InsertTelemetry): Promise<Telemetry> {
    const [recorded] = await db.insert(telemetry).values(data).returning();
    return recorded;
  }

  async getRecentTelemetry(limit: number = 50): Promise<Telemetry[]> {
    return await db.select().from(telemetry).orderBy(desc(telemetry.timestamp)).limit(limit);
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const records = await db.select().from(telemetry);
    const activeSessions = new Set(records.map(r => r.agentId)).size;
    const wastePrevented = records.reduce((sum, r) => sum + r.wastePrevented, 0);
    const loopsDetected = records.filter(r => r.loopDetected).length;
    let averageEntropy = 0;
    if (records.length > 0) {
      const totalEntropy = records.reduce((sum, r) => sum + Number(r.entropyScore), 0);
      averageEntropy = totalEntropy / records.length;
    }
    return { activeSessions, wastePrevented, averageEntropy, totalLoopsDetected: loopsDetected };
  }

  async createWebhook(data: InsertWebhook): Promise<Webhook> {
    const [webhook] = await db.insert(webhooks).values(data).returning();
    return webhook;
  }

  async getWebhooks(): Promise<Webhook[]> {
    return await db.select().from(webhooks);
  }

  async deleteWebhook(id: number): Promise<void> {
    await db.delete(webhooks).where(eq(webhooks.id, id));
  }

  async getIntegrations(): Promise<Integration[]> {
    return await db.select().from(integrations);
  }

  async createIntegration(data: InsertIntegration): Promise<Integration> {
    const [integration] = await db.insert(integrations).values(data).returning();
    return integration;
  }

  async checkKillSwitch(): Promise<boolean> {
    const recentEvents = await this.getRecentTelemetry(10);
    const loopCount = recentEvents.filter(e => e.loopDetected).length;
    return loopCount >= 5;
  }
}

export const storage = new DatabaseStorage();
