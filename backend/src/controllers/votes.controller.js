import * as VS from "../services/votes.service.js";

/** Организатор: создать опрос */
export async function create(req, res, next) {
  try {
    const { id: orgId, org_id } = req.user; // ORGANIZER
    const { eventId } = req.params;
    const { question, options, is_multiple } = req.body;

    // (опционально) проверить, что event принадлежит org_id

    const vote = await VS.createVote({
      eventId,
      question,
      options,
      isMultiple: is_multiple
    });
    res.status(201).json({ vote });
  } catch (e) { next(e); }
}

/** Организатор: список опросов события */
export async function list(req, res, next) {
  try {
    const { eventId } = req.params;
    const items = await VS.listVotesForEvent(eventId);
    res.json({ items });
  } catch (e) { next(e); }
}

/** Организатор: обновить опрос (в т.ч. закрыть) */
export async function update(req, res, next) {
  try {
    const { voteId } = req.params;
    const { question, options, is_multiple, status } = req.body;
    const vote = await VS.updateVote({
      voteId,
      question,
      options,
      isMultiple: is_multiple,
      status
    });
    res.json({ vote });
  } catch (e) { next(e); }
}

/** Организатор: удалить опрос */
export async function remove(req, res, next) {
  try {
    const { voteId } = req.params;
    const ok = await VS.deleteVote(voteId);
    if (!ok) return res.status(404).json({ error: "vote not found" });
    res.json({ ok: true });
  } catch (e) { next(e); }
}
