import * as S from "../services/events.service.js";
import { pageParams } from "../utils/pagination.js";

export async function create(req, res, next) {
  try {
    const { title, description, start_at, end_at } = req.body;
    if (!title) return res.status(400).json({ error: "title is required" });

    const ev = await S.createEvent({
      orgId: req.user.org_id,
      userId: req.user.id,
      title, description, start_at, end_at
    });
    res.status(201).json({ event: ev });
  } catch (e) { next(e); }
}

export async function list(req, res, next) {
  try {
    const { limit, offset } = pageParams(req.query);
    const data = await S.listEvents({ orgId: req.user.org_id, limit, offset });
    res.json(data);
  } catch (e) { next(e); }
}

export async function get(req, res, next) {
  try {
    const ev = await S.getEvent({ orgId: req.user.org_id, id: req.params.id });
    if (!ev) return res.status(404).json({ error: "not found" });
    res.json({ event: ev });
  } catch (e) { next(e); }
}

export async function patch(req, res, next) {
  try {
    const { title, description, start_at, end_at, is_published } = req.body;
    const patch = {};
    if (title !== undefined) patch.title = title;
    if (description !== undefined) patch.description = description;
    if (start_at !== undefined) patch.start_at = start_at;
    if (end_at !== undefined) patch.end_at = end_at;
    if (is_published !== undefined) patch.is_published = is_published;

    const ev = await S.updateEvent({ orgId: req.user.org_id, id: req.params.id, patch });
    if (!ev) return res.status(404).json({ error: "not found" });
    res.json({ event: ev });
  } catch (e) { next(e); }
}

export async function remove(req, res, next) {
  try {
    const ok = await S.removeEvent({ orgId: req.user.org_id, id: req.params.id });
    if (!ok) return res.status(404).json({ error: "not found" });
    res.json({ ok: true });
  } catch (e) { next(e); }
}

/* timeline */

export async function listTimeline(req, res, next) {
  try {
    const items = await S.listTimeline({ orgId: req.user.org_id, eventId: req.params.id });
    res.json({ items });
  } catch (e) { next(e); }
}

export async function addTimelineItem(req, res, next) {
  try {
    const { title, starts_at, ends_at, sort_order } = req.body;
    if (!title) return res.status(400).json({ error: "title is required" });
    const item = await S.addTimelineItem({
      orgId: req.user.org_id,
      eventId: req.params.id,
      title, starts_at, ends_at, sort_order
    });
    if (!item) return res.status(404).json({ error: "event not found" });
    res.status(201).json({ item });
  } catch (e) { next(e); }
}

export async function updateTimelineItem(req, res, next) {
  try {
    const { title, starts_at, ends_at, status, sort_order } = req.body;
    const patch = {};
    if (title !== undefined) patch.title = title;
    if (starts_at !== undefined) patch.starts_at = starts_at;
    if (ends_at !== undefined) patch.ends_at = ends_at;
    if (status !== undefined) patch.status = status;
    if (sort_order !== undefined) patch.sort_order = sort_order;

    const item = await S.updateTimelineItem({
      orgId: req.user.org_id,
      eventId: req.params.id,
      itemId: req.params.itemId,
      patch
    });
    if (!item) return res.status(404).json({ error: "not found" });
    res.json({ item });
  } catch (e) { next(e); }
}

export async function removeTimelineItem(req, res, next) {
  try {
    const ok = await S.removeTimelineItem({
      orgId: req.user.org_id,
      eventId: req.params.id,
      itemId: req.params.itemId
    });
    if (!ok) return res.status(404).json({ error: "not found" });
    res.json({ ok: true });
  } catch (e) { next(e); }
}
