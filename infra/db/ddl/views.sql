CREATE OR REPLACE VIEW eventum.v_event_public AS
SELECT e.id,
       e.title,
       e.description,
       e.start_at,
       e.end_at,
       e.join_code,
       (SELECT jsonb_agg(jsonb_build_object(
           'id', t.id, 'title', t.title, 'starts_at', t.starts_at,
           'ends_at', t.ends_at, 'status', t.status, 'sort_order', t.sort_order
        ) ORDER BY t.sort_order)
        FROM eventum.event_timeline t
        WHERE t.event_id = e.id) AS timeline
FROM eventum.events e
WHERE e.is_published = true;
