// backend/src/controllers/guest.menu.controller.js
import * as S from "../services/guestMenu.service.js";

function ensureEventId(req, res) {
  const eventId = req.user?.event_id;
  if (!eventId) { res.status(400).json({ error: "guest is not linked to an event" }); return null; }
  return eventId;
}

/* timeline */
export async function timeline(req, res, next) {
  try {
    const eid = ensureEventId(req, res); if (!eid) return;
    const items = await S.guestTimeline(eid);
    res.json({ items });
  } catch (e) { next(e); }
}

/* activities (placeholder) */
export async function activities(req, res, next) {
  try {
    const eid = ensureEventId(req, res); if (!eid) return;
    const items = await S.guestActivities(eid);
    res.json({ items });
  } catch (e) { next(e); }
}

/* votes */
export async function listVotes(req, res, next) {
  try {
    const eid = ensureEventId(req, res); if (!eid) return;
    const items = await S.listVotes(eid);
    res.json({ items });
  } catch (e) { next(e); }
}

export async function answerVote(req, res, next) {
  try {
    const eid = ensureEventId(req, res); if (!eid) return;
    const { voteId } = req.params;
    const { option_idx } = req.body; // number | number[]
    const result = await S.answerVote({ voteId, userId: req.user.id, optionsIdx: option_idx });
    res.status(201).json({ results: result });
  } catch (e) { next(e); }
}

/* NEW: результаты опроса без голосования */
export async function voteResults(req, res, next) {
  try {
    const eid = ensureEventId(req, res); if (!eid) return;
    const { voteId } = req.params;
    const items = await S.voteResults(voteId);
    res.json({ items });
  } catch (e) { next(e); }
}

/* privileges */
export async function createPrivilege(req, res, next) {
  try {
    const eid = ensureEventId(req, res); if (!eid) return;

    // payload -> message
    const { type, payload, amount } = req.body;
    let message = null;
    if (type === "song" && payload?.artist && payload?.title) {
      message = `${payload.artist} — ${payload.title}`;
    } else if (type === "toast" && typeof payload?.message === "string") {
      message = payload.message;
    } else if (type === "custom" && typeof payload?.text === "string") {
      message = payload.text;
    }

    const item = await S.createPrivilege({
      eventId: eid,
      userId: req.user.id,
      type,
      message,
      amount,
    });

    res.status(201).json({ item });
  } catch (e) { next(e); }
}

export async function myPrivileges(req, res, next) {
  try {
    const eid = ensureEventId(req, res); if (!eid) return;
    const items = await S.listPrivileges(eid, req.user.id);
    res.json({ items });
  } catch (e) { next(e); }
}
