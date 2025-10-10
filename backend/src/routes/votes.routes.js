import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireRole } from "../middlewares/requireRole.js";
import * as C from "../controllers/votes.controller.js";

const r = Router();

// Только для организатора
r.use(requireAuth, requireRole("ORGANIZER"));

// CRUD опросов в рамках события
r.post("/events/:eventId/votes", C.create);
r.get ("/events/:eventId/votes", C.list);
r.patch("/votes/:voteId",        C.update);
r.delete("/votes/:voteId",       C.remove);

export default r;
