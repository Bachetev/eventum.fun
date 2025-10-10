import { query } from "../config/db.js";

export async function createVote({ eventId, question, options, isMultiple = false }) {
  if (!Array.isArray(options) || options.length < 2) {
    const e = new Error("options must be an array of at least 2 items");
    e.status = 400; throw e;
  }
  const r = await query(
    `INSERT INTO eventum.votes (event_id, question, options, is_multiple)
     VALUES ($1,$2,$3,$4)
     RETURNING id, event_id, question, options, is_multiple, status, created_at`,
    [eventId, question, JSON.stringify(options), !!isMultiple]
  );
  return r.rows[0];
}

export async function listVotesForEvent(eventId) {
  const r = await query(
    `SELECT id, event_id, question, options, is_multiple, status, created_at
       FROM eventum.votes
      WHERE event_id = $1
      ORDER BY created_at DESC`,
    [eventId]
  );
  return r.rows;
}

export async function updateVote({ voteId, question, options, isMultiple, status }) {
  const fields = [];
  const params = [];
  let i = 1;

  if (question !== undefined) { fields.push(`question = $${i++}`); params.push(question); }
  if (options  !== undefined) { 
    if (!Array.isArray(options) || options.length < 2) {
      const e = new Error("options must be array length >= 2");
      e.status = 400; throw e;
    }
    fields.push(`options = $${i++}`); params.push(JSON.stringify(options)); 
  }
  if (isMultiple !== undefined) { fields.push(`is_multiple = $${i++}`); params.push(!!isMultiple); }
  if (status     !== undefined) {
    if (!["open","closed"].includes(status)) { const e = new Error("bad status"); e.status = 400; throw e; }
    fields.push(`status = $${i++}`); params.push(status);
  }
  if (!fields.length) { const e = new Error("nothing to update"); e.status = 400; throw e; }

  params.push(voteId);
  const r = await query(
    `UPDATE eventum.votes SET ${fields.join(", ")}
      WHERE id = $${i}
      RETURNING id, event_id, question, options, is_multiple, status, created_at`,
    params
  );
  if (!r.rowCount) { const e = new Error("vote not found"); e.status = 404; throw e; }
  return r.rows[0];
}

export async function deleteVote(voteId) {
  const r = await query(`DELETE FROM eventum.votes WHERE id = $1`, [voteId]);
  return r.rowCount > 0;
}

/* Гостевые: результаты по voteId */
export async function aggregateResults(voteId) {
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
