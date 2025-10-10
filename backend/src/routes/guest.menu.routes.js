import { Router } from "express";
import { body } from "express-validator";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireRole } from "../middlewares/requireRole.js";
import { validate } from "../middlewares/validate.js";
import * as C from "../controllers/guest.menu.controller.js";
import { aggregateResults } from "../services/votes.service.js";

const r = Router();

// Все эндпоинты ниже только для авторизованных гостей
r.use(requireAuth, requireRole("GUEST"));

/* timeline */
r.get("/event/timeline", C.timeline);

/* activities (placeholder) */
r.get("/activities", C.activities);

/* -------------------- VOTES (алиасы путей) -------------------- */
// Список открытых голосований мероприятия
r.get("/votes", C.listVotes);
r.get("/activities/votes", C.listVotes); // alias

// Проголосовать (body: { option_idx: number | number[] })
const voteAnswerValidation = validate([
  body("option_idx").custom((v) => {
    if (Array.isArray(v)) return v.every((n) => Number.isInteger(n));
    return Number.isInteger(v);
  }),
]);
r.post("/votes/:voteId/answer", voteAnswerValidation, C.answerVote);
r.post("/activities/vote/:voteId", voteAnswerValidation, C.answerVote); // alias

// Результаты голосования
r.get("/activities/vote/:voteId/results", async (req, res, next) => {
  try {
    const { voteId } = req.params;
    const items = await aggregateResults(voteId);
    res.json({ items });
  } catch (e) {
    next(e);
  }
});

/* -------------------- PRIVILEGES -------------------- */
// Список моих привилегий
r.get("/privileges", C.myPrivileges);

// Создать привилегию
// Разрешаем два варианта:
//  1) Новый:  { type, payload: {...} }
//  2) Старый: { type, message?, amount? } — (оставлено для совместимости)
const privilegeValidation = validate([
  body("type").isIn(["song", "toast", "custom"]),
  body("payload").optional().isObject(),
  body("message").optional().isString(),
  body("amount").optional().isFloat({ min: 0 }),
]);
r.post("/privileges", privilegeValidation, C.createPrivilege);

export default r;
