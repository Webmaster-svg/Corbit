import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";
import { MockPool } from "./mock-pool";

const { Pool } = pg;

class SmartPool {
  private realPool: any = null;
  private mockPool: any = null;
  private useMock: boolean | null = null;
  private dbUrl: string | undefined;

  constructor(dbUrl: string | undefined) {
    this.dbUrl = dbUrl;
    this.mockPool = new MockPool();
    if (dbUrl && dbUrl !== "mock") {
      this.realPool = new Pool({
        connectionString: dbUrl,
        connectionTimeoutMillis: 1500,
      });
    }
  }

  private async determinePool() {
    if (this.useMock !== null) return;

    if (!this.dbUrl || this.dbUrl === "mock") {
      console.log("📝 DATABASE_URL is not set or set to 'mock'. Automatically starting in Mock Database Mode!");
      this.useMock = true;
      return;
    }

    try {
      // Attempt a quick connection check (SELECT 1)
      await Promise.race([
        this.realPool.query("SELECT 1"),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 1500))
      ]);
      console.log("🔌 Successfully connected to PostgreSQL database!");
      this.useMock = false;
    } catch (e) {
      console.warn("⚠️ Failed to connect to PostgreSQL database. Automatically falling back to Mock Database Mode (local_db.json)!");
      this.useMock = true;
    }
  }

  async query(sql: string, params: any[] = []) {
    await this.determinePool();
    if (this.useMock) {
      return this.mockPool.query(sql, params);
    } else {
      return this.realPool.query(sql, params);
    }
  }

  async connect() {
    await this.determinePool();
    if (this.useMock) {
      return this.mockPool.connect();
    } else {
      return this.realPool.connect();
    }
  }

  async end() {
    if (this.realPool && !this.useMock) {
      await this.realPool.end();
    }
  }
}

export const pool = new SmartPool(process.env.DATABASE_URL);
export const db = drizzle(pool as any, { schema });

export * from "./schema";
