import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { cookieOptions } from "../config/security.js"; // у нас уже есть httpOnly-настройки в проекте
import * as G from "../services/guest.service.js";

function setAuthCookie(res, payload) {
  const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" });
  res.cookie("token", token, cookieOptions());
}

export async function join(req, res, next) {
  try {
    const { join_code, display_name } = req.body;
    if (!join_code || !display_name) {
      return res.status(400).json({ error: "join_code and display_name are required" });
    }

    const code = String(join_code).trim().toUpperCase();
    const event = await G.findEventByJoinCode(code);
    if (!event) return res.status(404).json({ error: "event not found or not published" });

    const user = await G.createGuestUser({ orgId: event.org_id, display_name });
    await G.linkGuestToEvent({ eventId: event.id, userId: user.id, nickname: display_name });

    // выдаём гостю cookie (как у auth), включая event_id в токен (удобно фронту)
    setAuthCookie(res, { id: user.id, org_id: event.org_id, role: "GUEST", event_id: event.id });

    res.status(201).json({
      user: { id: user.id, role: "GUEST", display_name },
      event: { id: event.id, title: event.title, join_code: event.join_code }
    });
  } catch (e) { next(e); }
}

export async function me(req, res, next) {
  try {
    const ctx = await G.getGuestContext(req.user.id);
    res.json({
      user: { id: req.user.id, role: req.user.role, org_id: req.user.org_id },
      event: ctx ? { id: ctx.id, title: ctx.title, join_code: ctx.join_code } : null
    });
  } catch (e) { next(e); }
}

export async function leave(req, res, next) {
  try {
    await G.leaveEvent(req.user.id);
    res.clearCookie("token", cookieOptions({ clear: true }));
    res.json({ ok: true });
  } catch (e) { next(e); }
}
