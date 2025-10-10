import { query } from "../config/db.js";
import { joinCode } from "../utils/random.js";

export async function createEvent({ orgId, userId, title, description, start_at, end_at }) {
  // генерируем уникальный join_code в пределах организации
  let code;
  for (let i = 0; i < 10; i++) {
    code = joinCode(6);
    const dup = await query(
      "SELECT 1 FROM eventum.events WHERE org_id = $1 AND join_code = $2 LIMIT 1",
      [orgId, code]
    );
    if (dup.rowCount === 0) break;
    if (i === 9) throw new Error("cannot generate unique join code");
  }

  const ins = await query(
    `INSERT INTO eventum.events
       (org_id, title, description, start_at, end_at, is_published, join_code, created_by)
     VALUES ($1,$2,$3,$4,$5,false,$6,$7)
     RETURNING *`,
    [orgId, title, description || null, start_at || null, end_at || null, code, userId]
  );
  return ins.rows[0];
}

export async function listEvents({ orgId, limit, offset }) {
  const { rows } = await query(
    `SELECT *
     FROM eventum.events
     WHERE org_id = $1
     ORDER BY created_at DESC
     LIMIT $2 OFFSET $3`,
    [orgId, limit, offset]
  );
  const { rows: c } = await query(
    `SELECT COUNT(*)::int AS count FROM eventum.events WHERE org_id = $1`,
    [orgId]
  );
  return { items: rows, total: c[0].count };
}

export async function getEvent({ orgId, id }) {
  const r = await query(
    `SELECT * FROM eventum.events WHERE id = $1 AND org_id = $2`,
    [id, orgId]
  );
  return r.rows[0] || null;
}

export async function updateEvent({ orgId, id, patch }) {
  const fields = [];
  const values = [];
  let idx = 1;

  for (const [k, v] of Object.entries(patch)) {
    fields.push(`${k} = $${++idx}`);
    values.push(v);
  }
  if (!fields.length) return getEvent({ orgId, id });

  values.unshift(id); // becomes $1
  values.push(orgId); // becomes last

  const sql = `
    UPDATE eventum.events
       SET ${fields.join(", ")}, updated_at = now()
     WHERE id = $1 AND org_id = $${values.length}
     RETURNING *`;
  const r = await query(sql, values);
  return r.rows[0] || null;
}

export async function removeEvent({ orgId, id }) {
  const r = await query(
    "DELETE FROM eventum.events WHERE id = $1 AND org_id = $2 RETURNING id",
    [id, orgId]
  );
  return r.rowCount === 1;
}

/* ----- timeline ----- */

export async function listTimeline({ orgId, eventId }) {
  const r = await query(
    `SELECT t.*
       FROM eventum.event_timeline t
       JOIN eventum.events e ON e.id = t.event_id
      WHERE t.event_id = $1 AND e.org_id = $2
      ORDER BY t.sort_order, coalesce(t.starts_at, t.created_at)`,
    [eventId, orgId]
  );
  return r.rows;
}

export async function addTimelineItem({ orgId, eventId, title, starts_at, ends_at, sort_order }) {
  // проверяем принадлежность события org'е
  const e = await getEvent({ orgId, id: eventId });
  if (!e) return null;

  const r = await query(
    `INSERT INTO eventum.event_timeline (event_id, title, starts_at, ends_at, sort_order)
     VALUES ($1,$2,$3,$4,$5)
     RETURNING *`,
    [eventId, title, starts_at || null, ends_at || null, sort_order ?? 0]
  );
  return r.rows[0];
}

export async function updateTimelineItem({ orgId, eventId, itemId, patch }) {
  const e = await getEvent({ orgId, id: eventId });
  if (!e) return null;

  const fields = [];
  const values = [];
  let idx = 1;

  for (const [k, v] of Object.entries(patch)) {
    fields.push(`${k} = $${++idx}`);
    values.push(v);
  }
  if (!fields.length) {
    const r = await query(`SELECT * FROM eventum.event_timeline WHERE id = $1 AND event_id = $2`, [itemId, eventId]);
    return r.rows[0] || null;
  }

  values.unshift(itemId); // $1
  values.push(eventId);   // last
  const sql = `
    UPDATE eventum.event_timeline
       SET ${fields.join(", ")}, created_at = created_at
     WHERE id = $1 AND event_id = $${values.length}
     RETURNING *`;
  const r = await query(sql, values);
  return r.rows[0] || null;
}

export async function removeTimelineItem({ orgId, eventId, itemId }) {
  const e = await getEvent({ orgId, id: eventId });
  if (!e) return false;
  const r = await query(
    `DELETE FROM eventum.event_timeline WHERE id = $1 AND event_id = $2`,
    [itemId, eventId]
  );
  return r.rowCount === 1;
}
