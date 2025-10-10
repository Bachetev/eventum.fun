-- схема опросов
CREATE TABLE IF NOT EXISTS eventum.votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES eventum.events(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options JSONB NOT NULL CHECK (jsonb_typeof(options) = 'array'), -- ["Квиз","Танцы","Тосты"]
  is_multiple BOOLEAN NOT NULL DEFAULT FALSE,                      -- одиночный/множественный выбор
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ответы гостей
CREATE TABLE IF NOT EXISTS eventum.vote_answers (
  vote_id UUID NOT NULL REFERENCES eventum.votes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES eventum.users(id) ON DELETE CASCADE,
  option_idx INT NOT NULL CHECK (option_idx >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (vote_id, user_id, option_idx)
);

-- индекс на быстрый подсчёт результатов
CREATE INDEX IF NOT EXISTS vote_answers_vote_idx ON eventum.vote_answers (vote_id, option_idx);
