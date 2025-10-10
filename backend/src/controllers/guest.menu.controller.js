// backend/src/controllers/guest.menu.controller.js
import * as S from "../services/guestMenu.service.js";

/** Проверяем, что гость привязан к событию (event_id сидит в JWT после /guest/join) */
function ensureEventId(req, res) {
  const eventId = req.user?.event_id;
  if (!eventId) {
    res.status(400).json({ error: "guest is not linked to an event" });
    return null;
  }
  return eventId;
}

/* ---------- timeline ---------- */
export async function timeline(req, res, next) {
  try {
    const eid = ensureEventId(req, res); if (!eid) return;
    const items = await S.guestTimeline(eid);
    res.json({ items });
  } catch (e) { next(e); }
}

/* ---------- activities (placeholder) ---------- */
export async function activities(req, res, next) {
  try {
    const eid = ensureEventId(req, res); if (!eid) return;
    const items = await S.guestActivities(eid);
    res.json({ items });
  } catch (e) { next(e); }
}

/* ---------- votes ---------- */
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
    const results = await S.answerVote({ voteId, userId: req.user.id, optionsIdx: option_idx });
    res.status(201).json({ results });
  } catch (e) { next(e); }
}

/** Результаты опроса без отправки ответа гостем */
export async function voteResults(req, res, next) {
  try {
    const eid = ensureEventId(req, res); if (!eid) return;
    const { voteId } = req.params;
    const items = await S.voteResults(voteId);
    res.json({ items });
  } catch (e) { next(e); }
}

/* ---------- privileges ---------- */
/**
 * Принимаем { type, payload?, amount? } и формируем message:
 * - song:   "Artist — Title"
 * - toast:  payload.message
 * - custom: payload.text
 */
export async function createPrivilege(req, res, next) {
  try {
    const eid = ensureEventId(req, res); if (!eid) return;

    const { type, payload, amount } = req.body || {};
    let message = null;

    if (type === "song") {
      const artist = payload?.artist?.toString().trim();
      const title  = payload?.title?.toString().trim();
      if (artist || title) message = [artist, title].filter(Boolean).join(" — ");
    } else if (type === "toast") {
      message = payload?.message?.toString().trim() || null;
    } else if (type === "custom") {
      message = payload?.text?.toString().trim() || null;
    }

    const item = await S.createPrivilege({
      eventId: eid,
      userId: req.user.id,
      type,
      message,
      amount: typeof amount === "number" ? amount : null,
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
