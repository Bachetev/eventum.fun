export function errorHandler(err, _req, res, _next) {
  console.error("[ERROR]", err);
  const status = err.status || 400;
  res.status(status).json({ error: err.message || "Unknown error" });
}
