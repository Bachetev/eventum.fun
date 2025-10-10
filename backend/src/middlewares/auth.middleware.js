// Проверяем httpOnly-cookie с JWT и кладём payload в req.user
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function requireAuth(req, res, next) {
  const token = req.cookies?.token;        // имя cookie — то же, что ставишь при логине
  if (!token) return res.status(401).json({ error: "unauthorized" });

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    req.user = payload;                    // { id, org_id, role, iat, exp }
    next();
  } catch {
    return res.status(401).json({ error: "unauthorized" });
  }
}
