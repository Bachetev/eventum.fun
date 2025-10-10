-- Votes for an event
CREATE TABLE IF NOT EXISTS eventum.votes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id    uuid NOT NULL REFERENCES eventum.events(id) ON DELETE CASCADE,
  question    text NOT NULL,
  options     jsonb NOT NULL,          -- ["A","B","C"]
  is_multiple boolean NOT NULL DEFAULT false,
  status      text NOT NULL DEFAULT 'open', -- open|closed
  created_by  uuid REFERENCES eventum.users(id),
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Answers from users
CREATE TABLE IF NOT EXISTS eventum.vote_answers (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vote_id    uuid NOT NULL REFERENCES eventum.votes(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES eventum.users(id) ON DELETE CASCADE,
  option_idx int  NOT NULL CHECK (option_idx >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Один и тот же пользователь не может выбрать один и тот же вариант дважды
CREATE UNIQUE INDEX IF NOT EXISTS uniq_vote_answer ON eventum.vote_answers(vote_id, user_id, option_idx);

CREATE INDEX IF NOT EXISTS idx_votes_event ON eventum.votes(event_id);
