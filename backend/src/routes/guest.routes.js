import { Router } from "express";
import { body } from "express-validator";

import { validate } from "../middlewares/validate.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireRole } from "../middlewares/requireRole.js";
import * as C from "../controllers/guest.controller.js";

const r = Router();

/* Публичный вход гостя по коду */
r.post(
  "/join",
  validate([
    body("join_code").isString().notEmpty(),
    body("display_name").optional().isString(),
  ]),
  C.join   // ← здесь было C.joinByCode, из-за этого падало
);

/* Ниже — только авторизованный гость */
r.use(requireAuth, requireRole("GUEST"));

r.get("/me", C.me);
r.post("/leave", C.leave);

export default r;
