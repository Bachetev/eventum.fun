import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

const allow = (process.env.CORS_ORIGIN || "").split(",").filter(Boolean);
app.use(cors({ origin: allow.length ? allow : true, credentials: true }));

// Simple health endpoint
app.get("/health", (_req, res) => res.json({ ok: true }));

export default app;
