import { Router } from "express";
import { body } from "express-validator";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireRole } from "../middlewares/requireRole.js";
import { validate } from "../middlewares/validate.js";
import * as C from "../controllers/guest.controller.js";

const r = Router();

// Присоединиться по коду: без авторизации
r.post(
  "/join",
  validate([
    body("join_code").isString().isLength({ min: 4, max: 12 }),
    body("display_name").isString().isLength({ min: 2, max: 100 })
  ]),
  C.join
);

// Я-гость (нужна авторизация гостя)
r.get("/me", requireAuth, requireRole("GUEST"), C.me);

// Выйти (гость)
r.post("/leave", requireAuth, requireRole("GUEST"), C.leave);

export default r;
