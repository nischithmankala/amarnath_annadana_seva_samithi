import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { config } from "./config";
import authRouter from "./routes/auth";
import membershipsRouter from "./routes/memberships";
import donationsRouter from "./routes/donations";
import { errorHandler } from "./middlewares/error";
import crypto from "crypto";

dotenv.config();

const app = express();
const port = config.port;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Request ID middleware
app.use((req, res, next) => {
  req.headers["x-request-id"] = req.headers["x-request-id"] || crypto.randomUUID();
  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/memberships", membershipsRouter);
app.use("/api/donations", donationsRouter);

// Centralized error handling
app.use(errorHandler);

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`API server listening on port ${port}`);
  });
}

export default app;
