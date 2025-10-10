-- Guests linked to events
CREATE TABLE IF NOT EXISTS eventum.event_guests (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id   uuid NOT NULL REFERENCES eventum.events(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES eventum.users(id) ON DELETE CASCADE,
  nickname   text,
  joined_at  timestamptz NOT NULL DEFAULT now(),
  left_at    timestamptz
);

-- один гость не может присоединиться дважды к одному событию
CREATE UNIQUE INDEX IF NOT EXISTS uniq_event_guest ON eventum.event_guests(event_id, user_id);
