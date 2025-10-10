// backend/src/routes/guest.menu.routes.js
import { Router } from "express";
import { body } from "express-validator";

import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/inputValidation.js";
import * as C from "../controllers/guest.menu.controller.js";

const r = Router();

// Все эндпоинты ниже — только для авторизованных гостей
r.use(requireAuth, requireRole("GUEST"));

/* timeline */
r.get("/event/timeline", C.timeline);

/* activities (заглушка) */
r.get("/activities", C.activities);

/* votes */
// список открытых голосований (два алиаса — любой можно использовать)
r.get("/votes", C.listVotes);
r.get("/activities/votes", C.listVotes);

// отдать ответ (single/multiple по настройкам голосования)
const optionIdxValidator = validate([
  body("option_idx").custom(v => {
    if (Array.isArray(v)) return v.every(Number.isInteger);
    return Number.isInteger(v);
  }),
]);

r.post("/votes/:voteId/answer", optionIdxValidator, C.answerVote);
r.post("/activities/vote/:voteId", optionIdxValidator, C.answerVote); // алиас

// результаты голосования (алиасы)
r.get("/votes/:voteId/results", C.voteResults);
r.get("/activities/vote/:voteId/results", C.voteResults);

/* privileges */
r.get("/privileges", C.myPrivileges);
r.post(
  "/privileges",
  validate([
    body("type").isIn(["song", "toast", "custom"]),
    body("message").optional().isString(),        // поддерживаем «старый» вариант
    body("amount").optional().isFloat({ min: 0 }),
    body("payload").optional().isObject(),        // и «новый» (payload -> message маппится в контроллере)
  ]),
  C.createPrivilege
);

export default r;
