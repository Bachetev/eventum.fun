// backend/src/app.js
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

// health
app.get("/health", (_req, res) => res.json({ ok: true }));

// ROUTES
import authRoutes from "./routes/auth.routes.js";
import eventsRoutes from "./routes/events.routes.js";
import guestRoutes from "./routes/guest.routes.js";
import guestMenuRoutes from "./routes/guest.menu.routes.js";

app.use("/auth", authRoutes);
app.use("/events", eventsRoutes);
app.use("/guest", guestRoutes);
app.use("/guest", guestMenuRoutes);

// ERRORS (в самом конце)
import { errorHandler } from "./middlewares/error.middleware.js";
app.use(errorHandler);

export default app;
