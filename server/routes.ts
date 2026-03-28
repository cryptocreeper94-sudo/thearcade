import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

export function registerRoutes(app: Express): Server {
  const httpServer = createServer(app);

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "thearcade" });
  });

  return httpServer;
}
