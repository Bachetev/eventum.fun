// backend/src/services/guest.menu.service.js
import { query } from "../config/db.js";

/* ---------- timeline ---------- */
export async function guestTimeline(eventId) {
  const r = await query(
    `SELECT id, event_id, title, starts_at, ends_at, status, sort_order, created_at
       FROM eventum.event_timeline
      WHERE event_id = $1
      ORDER BY sort_order, COALESCE(starts_at, created_at)`,
    [eventId]
  );
  return r.rows;
}

/* ---------- activities (placeholder) ---------- */
export async function guestActivities(_eventId) {
  return [
    { id: "quiz-1", type: "quiz",  title: "Блиц-викторина",     url: null, status: "upcoming" },
    { id: "game-1", type: "game",  title: "Мини-игра: Эрудит",  url: null, status: "upcoming" },
  ];
}

/* ---------- votes ---------- */
export async function listVotes(eventId) {
  const r = await query(
    `SELECT id, question, options, is_multiple, status, created_at
       FROM eventum.votes
      WHERE event_id = $1 AND status = 'open'
      ORDER BY created_at DESC`,
    [eventId]
  );
  return r.rows;
}

export async function answerVote({ voteId, userId, optionsIdx }) {
  const v = await query(
    `SELECT id, is_multiple, jsonb_array_length(options) AS cnt
       FROM eventum.votes
      WHERE id = $1 AND status = 'open'`,
    [voteId]
  );
  if (!v.rowCount) { const e = new Error("vote not found or closed"); e.status = 404; throw e; }
  const { is_multiple, cnt } = v.rows[0];

  const indexes = Array.isArray(optionsIdx) ? optionsIdx : [optionsIdx];
  if (!indexes.length) { const e = new Error("option index required"); e.status = 400; throw e; }
  if (!is_multiple && indexes.length > 1) { const e = new Error("multiple answers not allowed"); e.status = 400; throw e; }
  if (indexes.some(i => typeof i !== "number" || i < 0 || i >= cnt)) { const e = new Error("invalid option index"); e.status = 400; throw e; }

  if (!is_multiple) {
    await query(`DELETE FROM eventum.vote_answers WHERE vote_id = $1 AND user_id = $2`, [voteId, userId]);
  }

  for (const idx of indexes) {
    await query(
      `INSERT INTO eventum.vote_answers (vote_id, user_id, option_idx)
       VALUES ($1, $2, $3)
       ON CONFLICT (vote_id, user_id, option_idx) DO NOTHING`,
      [voteId, userId, idx]
    );
  }

  const agg = await query(
    `SELECT option_idx, COUNT(*)::int AS votes
       FROM eventum.vote_answers
      WHERE vote_id = $1
      GROUP BY option_idx
      ORDER BY option_idx`,
    [voteId]
  );
  return agg.rows;
}

/* NEW: получить результаты без голосования */
export async function voteResults(voteId) {
  const r = await query(
    `SELECT option_idx, COUNT(*)::int AS votes
       FROM eventum.vote_answers
      WHERE vote_id = $1
      GROUP BY option_idx
      ORDER BY option_idx`,
    [voteId]
  );
  return r.rows;
}

/* ---------- privileges ---------- */
export async function createPrivilege({ eventId, userId, type, message, amount }) {
  const r = await query(
    `INSERT INTO eventum.privilege_requests (event_id, user_id, type, message, amount)
     VALUES ($1,$2,$3,$4,$5)
     RETURNING id, event_id, user_id, type, message, amount, status, created_at`,
    [eventId, userId, type, message || null, amount || null]
  );
  return r.rows[0];
}

export async function listPrivileges(eventId, userId) {
  const r = await query(
    `SELECT id, type, message, amount, status, created_at
       FROM eventum.privilege_requests
      WHERE event_id = $1 AND user_id = $2
      ORDER BY created_at DESC`,
    [eventId, userId]
  );
  return r.rows;
}
