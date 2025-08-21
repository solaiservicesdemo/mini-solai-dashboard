import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  handleSendTemplate,
  handleGetEventsToday,
  handleProposeTimes,
  handleScheduleFollowup,
  handleRunInvoiceReminders,
  handleSyncCalendarEvents,
} from "./routes/dashboard";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Dashboard API routes
  app.post("/api/send-template", handleSendTemplate);
  app.get("/api/events-today", handleGetEventsToday);
  app.post("/api/propose-times", handleProposeTimes);
  app.post("/api/schedule-followup", handleScheduleFollowup);
  app.post("/api/run-invoice-reminders", handleRunInvoiceReminders);

  return app;
}
