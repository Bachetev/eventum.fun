import { Router } from "express";
import * as C from "../controllers/events.controller.js";
import { body } from "express-validator";
import { validate } from "../middlewares/validate.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireRole } from "../middlewares/requireRole.js";

const r = Router();

// Только авторизованные ORGANIZER/ADMIN
r.use(requireAuth, requireRole("ORGANIZER","ADMIN"));

r.get("/", C.list);
r.post(
  "/",
  validate([
    body("title").isString().notEmpty(),
    body("description").optional().isString(),
    body("start_at").optional().isISO8601(),
    body("end_at").optional().isISO8601()
  ]),
  C.create
);

r.get("/:id", C.get);
r.patch("/:id", C.patch);
r.delete("/:id", C.remove);

// timeline
r.get("/:id/timeline", C.listTimeline);
r.post(
  "/:id/timeline",
  validate([ body("title").isString().notEmpty() ]),
  C.addTimelineItem
);
r.patch("/:id/timeline/:itemId", C.updateTimelineItem);
r.delete("/:id/timeline/:itemId", C.removeTimelineItem);

export default r;
