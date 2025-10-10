-- Privilege requests from guests (song/toast/other)
CREATE TABLE IF NOT EXISTS eventum.privilege_requests (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id   uuid NOT NULL REFERENCES eventum.events(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES eventum.users(id) ON DELETE CASCADE,
  type       text NOT NULL CHECK (type IN ('song','toast','custom')),
  message    text,
  amount     numeric(12,2),
  status     text NOT NULL DEFAULT 'pending', -- pending|approved|rejected|done
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_priv_req_event ON eventum.privilege_requests(event_id);
CREATE INDEX IF NOT EXISTS idx_priv_req_status ON eventum.privilege_requests(status);
