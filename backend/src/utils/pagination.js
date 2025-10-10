export function pageParams(q) {
  const limit = Math.min(Math.max(parseInt(q.limit || "20", 10), 1), 100);
  const offset = Math.max(parseInt(q.offset || "0", 10), 0);
  return { limit, offset };
}
