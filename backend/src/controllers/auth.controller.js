import * as AuthService from "../services/auth.service.js";
import jwt from "jsonwebtoken";

const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: "lax",
  secure: false, // в проде true (HTTPS)
  path: "/",
  maxAge: 1000 * 60 * 60 * 24 * 7,
};

export async function register(req, res, next) {
  try {
    const { role, phone, email, password, display_name } = req.body;
    const { user } = await AuthService.register({ role, phone, email, password, display_name });

    const token = jwt.sign(
      { id: user.id, org_id: user.org_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.cookie("token", token, COOKIE_OPTS);
    res.status(201).json({ user });
  } catch (e) { next(e); }
}

export async function login(req, res, next) {
  try {
    const { phone, email, password } = req.body;
    const { user } = await AuthService.login({ phone, email, password });

    const token = jwt.sign(
      { id: user.id, org_id: user.org_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.cookie("token", token, COOKIE_OPTS);
    res.json({ user });
  } catch (e) { next(e); }
}

export async function me(req, res) {
  res.json({ user: req.user });
}

export async function logout(_req, res) {
  res.clearCookie("token", { path: "/" });
  res.json({ ok: true });
}
