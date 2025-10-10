import { query } from "../config/db.js";
import { hash } from "bcrypt"; // не обязателен, но пусть будет для единообразия

export async function findEventByJoinCode(code) {
  const r = await query(
    `SELECT * FROM eventum.events
      WHERE join_code = $1 AND is_published = true
      LIMIT 1`,
    [code]
  );
  return r.rows[0] || null;
}

export async function createGuestUser({ orgId, display_name }) {
  const r = await query(
    `INSERT INTO eventum.users (org_id, role, display_name)
     VALUES ($1, 'GUEST', $2)
     RETURNING *`,
    [orgId, display_name]
  );
  return r.rows[0];
}

export async function linkGuestToEvent({ eventId, userId, nickname }) {
  const r = await query(
    `INSERT INTO eventum.event_guests (event_id, user_id, nickname)
     VALUES ($1, $2, $3)
     ON CONFLICT (event_id, user_id) DO UPDATE
       SET nickname = EXCLUDED.nickname
     RETURNING *`,
    [eventId, userId, nickname || null]
  );
  return r.rows[0];
}

export async function getGuestContext(userId) {
  // Берём последнее присоединение гостя (на случай, если будет много событий)
  const r = await query(
    `SELECT e.*, g.joined_at, g.left_at, g.nickname
       FROM eventum.event_guests g
       JOIN eventum.events e ON e.id = g.event_id
      WHERE g.user_id = $1
      ORDER BY g.joined_at DESC
      LIMIT 1`,
    [userId]
  );
  return r.rows[0] || null;
}

export async function leaveEvent(userId) {
  const r = await query(
    `UPDATE eventum.event_guests
        SET left_at = now()
      WHERE user_id = $1
        AND left_at IS NULL`,
    [userId]
  );
  return r.rowCount > 0;
}
