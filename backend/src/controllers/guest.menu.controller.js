import * as S from "../services/guestMenu.service.js";

/* Требует req.user.event_id (в JWT после /guest/join он есть) */
function ensureEventId(req, res) {
  const eventId = req.user?.event_id;
  if (!eventId) {
    res.status(400).json({ error: "guest is not linked to an event" });
    return null;
  }
  return eventId;
}

/* timeline */
export async function timeline(req, res, next) {
  try {
    const eventId = ensureEventId(req, res); if (!eventId) return;
    const items = await S.guestTimeline(eventId);
    res.json({ items });
  } catch (e) { next(e); }
}

/* activities (placeholder) */
export async function activities(req, res, next) {
  try {
    const eventId = ensureEventId(req, res); if (!eventId) return;
    const items = await S.guestActivities(eventId);
    res.json({ items });
  } catch (e) { next(e); }
}

/* votes */
export async function listVotes(req, res, next) {
  try {
    const eventId = ensureEventId(req, res); if (!eventId) return;
    const items = await S.listVotes(eventId);
    res.json({ items });
  } catch (e) { next(e); }
}

export async function answerVote(req, res, next) {
  try {
    const eventId = ensureEventId(req, res); if (!eventId) return;
    const { voteId } = req.params;
    const { option_idx } = req.body; // number | number[]
    const result = await S.answerVote({ voteId, userId: req.user.id, optionsIdx: option_idx });
    res.status(201).json({ results: result });
  } catch (e) { next(e); }
}

/* privileges */
export async function createPrivilege(req, res, next) {
  try {
    const eventId = ensureEventId(req, res); if (!eventId) return;
    const { type, payload } = req.body;

    if (!["song", "toast", "custom"].includes(type)) {
      return res.status(400).json({ error: "unsupported type" });
    }

    const item = await S.createPrivilege({
      eventId,
      userId: req.user.id,
      type,
      payload: payload || {},
    });

    res.status(201).json({ item });
  } catch (e) { next(e); }
}

export async function myPrivileges(req, res, next) {
  try {
    const eventId = ensureEventId(req, res); if (!eventId) return;
    const items = await S.listPrivileges(eventId, req.user.id);
    res.json({ items });
  } catch (e) { next(e); }
}
