import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import auditRoutes from "./routes/audit.routes";
import { errorHandler } from "./middleware/errorHandler";
import { config } from "./config/env";

const app = express();

app.use(helmet());

app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
}));

app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests, please try again later." },
});
app.use("/api", limiter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api", auditRoutes);

app.use(errorHandler);

export default app;
