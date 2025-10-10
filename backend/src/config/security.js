// backend/src/config/security.js
import { env } from "./env.js";

/**
 * Опции для httpOnly cookie с JWT.
 * Совпадают при установке и очистке (важно для корректного удаления cookie).
 */
export function cookieOptions({ clear = false } = {}) {
  const base = {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV !== "development", // в dev можно без secure
    path: "/",
  };

  // maxAge только при установке, при очистке — expires в прошлом
  return clear
    ? { ...base, expires: new Date(0) }
    : { ...base, maxAge: 7 * 24 * 60 * 60 * 1000 }; // 7 дней
}
