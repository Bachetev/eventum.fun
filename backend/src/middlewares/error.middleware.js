// backend/src/middlewares/error.middleware.js

// Универсальный обработчик ошибок Express с именованным экспортом.
export function errorHandler(err, req, res, next) {
  const status = err?.status || 500;
  const message = err?.message || "internal_error";

  // логируем только 5xx, чтобы не шуметь на 4xx
  if (status >= 500) {
    // eslint-disable-next-line no-console
    console.error("[ERROR]", err);
  }

  res.status(status).json({ error: message });
}
