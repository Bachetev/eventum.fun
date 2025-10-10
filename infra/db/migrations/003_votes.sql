-- infra/db/migrations/003_votes.sql

-- Голосования по событию
CREATE TABLE IF NOT EXISTS eventum.votes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id    uuid NOT NULL REFERENCES eventum.events(id) ON DELETE CASCADE,
  question    text NOT NULL,
  options     jsonb NOT NULL CHECK (jsonb_typeof(options) = 'array'),
  is_multiple boolean NOT NULL DEFAULT false,
  status      text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_votes_event ON eventum.votes(event_id);

-- Ответы гостей на голосование
CREATE TABLE IF NOT EXISTS eventum.vote_answers (
  vote_id     uuid NOT NULL REFERENCES eventum.votes(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES eventum.users(id) ON DELETE CASCADE,
  option_idx  integer NOT NULL CHECK (option_idx >= 0),
  created_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (vote_id, user_id, option_idx)
);

CREATE INDEX IF NOT EXISTS idx_vote_answers_vote ON eventum.vote_answers(vote_id);
CREATE INDEX IF NOT EXISTS idx_vote_answers_user ON eventum.vote_answers(user_id);
