import { Router } from "express";
import { body } from "express-validator";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireRole } from "../middlewares/requireRole.js";
import { validate } from "../middlewares/validate.js";
import * as C from "../controllers/guest.menu.controller.js";

const r = Router();

// Все эндпоинты ниже только для авторизованных гостей
r.use(requireAuth, requireRole("GUEST"));

/* timeline */
r.get("/event/timeline", C.timeline);

/* activities (placeholder) */
r.get("/activities", C.activities);

/* votes */
r.get("/votes", C.listVotes);
r.post(
  "/votes/:voteId/answer",
  validate([
    body("option_idx").custom(v => {
      if (Array.isArray(v)) return v.every(n => Number.isInteger(n));
      return Number.isInteger(v);
    })
  ]),
  C.answerVote
);

/* privileges */
r.get("/privileges", C.myPrivileges);
r.post(
  "/privileges",
  validate([
    body("type").isIn(["song","toast","custom"]),
    body("message").optional().isString(),
    body("amount").optional().isFloat({ min: 0 }),
  ]),
  C.createPrivilege
);

export default r;
