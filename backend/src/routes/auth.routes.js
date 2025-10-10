import { Router } from "express";
import * as Auth from "../controllers/auth.controller.js";
import { body } from "express-validator";
import { validate } from "../middlewares/validate.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const r = Router();

r.post(
  "/register",
  validate([
    body("role").isIn(["GUEST","ORGANIZER"]).withMessage("Invalid role"),
    body("password").isLength({ min: 6 }),
    body("phone").optional().isString(),
    body("email").optional().isEmail().normalizeEmail(),
    body("display_name").optional().isString(),
  ]),
  Auth.register
);

r.post(
  "/login",
  validate([
    body("phone").optional().isString(),
    body("email").optional().isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }),
  ]),
  Auth.login
);

r.get("/me", requireAuth, Auth.me);
r.post("/logout", requireAuth, Auth.logout);

export default r;
