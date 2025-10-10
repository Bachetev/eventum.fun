-- ===== Extensions (safe to run multiple times)
CREATE EXTENSION IF NOT EXISTS pgcrypto;        -- gen_random_uuid(), digest()
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";     -- uuid_generate_v4()
CREATE EXTENSION IF NOT EXISTS citext;          -- case-insensitive text

-- ===== Schema
CREATE SCHEMA IF NOT EXISTS eventum;

-- ===== Enums
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role') THEN
    CREATE TYPE eventum.role AS ENUM ('GUEST','ORGANIZER','STAFF','ADMIN');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'activity_type') THEN
    CREATE TYPE eventum.activity_type AS ENUM ('QUIZ','WHAT_WHERE_WHEN','JOKE_SHOW','JEOPARDY','MUSLOTO','EXTERNAL');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_status') THEN
    CREATE TYPE eventum.subscription_status AS ENUM ('ACTIVE','PAST_DUE','CANCELED','INCOMPLETE');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'plan_code') THEN
    CREATE TYPE eventum.plan_code AS ENUM ('BASIC','PRO','POWER');
  END IF;
END$$;

-- ===== Organizations
CREATE TABLE IF NOT EXISTS eventum.organizations (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  owner_user_id uuid,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- ===== Users
CREATE TABLE IF NOT EXISTS eventum.users (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id           uuid REFERENCES eventum.organizations(id) ON DELETE SET NULL,
  phone            text UNIQUE,
  email            citext UNIQUE,
  password_hash    text,                           -- bcrypt hash
  role             eventum.role NOT NULL DEFAULT 'GUEST',
  display_name     text,
  locale           text NOT NULL DEFAULT 'ru',
  is_active        boolean NOT NULL DEFAULT true,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

-- link owner after users table exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'organizations_owner_fk'
  ) THEN
    ALTER TABLE eventum.organizations
      ADD CONSTRAINT organizations_owner_fk
      FOREIGN KEY (owner_user_id) REFERENCES eventum.users(id) ON DELETE SET NULL DEFERRABLE INITIALLY DEFERRED;
  END IF;
END$$;

-- ===== Events
CREATE TABLE IF NOT EXISTS eventum.events (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        uuid NOT NULL REFERENCES eventum.organizations(id) ON DELETE CASCADE,
  title         text NOT NULL,
  description   text,
  start_at      timestamptz,
  end_at        timestamptz,
  is_published  boolean NOT NULL DEFAULT false,
  join_code     text NOT NULL,
  created_by    uuid REFERENCES eventum.users(id) ON DELETE SET NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE(org_id, join_code)
);

-- ===== Event timeline (timing)
CREATE TABLE IF NOT EXISTS eventum.event_timeline (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id      uuid NOT NULL REFERENCES eventum.events(id) ON DELETE CASCADE,
  title         text NOT NULL,
  starts_at     timestamptz,
  ends_at       timestamptz,
  status        text NOT NULL DEFAULT 'scheduled', -- scheduled|live|done
  sort_order    int NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- ===== Staff
CREATE TABLE IF NOT EXISTS eventum.staff (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id     uuid NOT NULL REFERENCES eventum.organizations(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES eventum.users(id) ON DELETE CASCADE,
  role_note  text,
  UNIQUE(org_id, user_id)
);

CREATE TABLE IF NOT EXISTS eventum.event_staff (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id  uuid NOT NULL REFERENCES eventum.events(id) ON DELETE CASCADE,
  user_id   uuid NOT NULL REFERENCES eventum.users(id) ON DELETE CASCADE,
  UNIQUE(event_id, user_id)
);

-- ===== Guests (participants by join code)
CREATE TABLE IF NOT EXISTS eventum.guests (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id     uuid NOT NULL REFERENCES eventum.events(id) ON DELETE CASCADE,
  user_id      uuid REFERENCES eventum.users(id) ON DELETE SET NULL,
  nickname     text NOT NULL,
  joined_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE(event_id, nickname)
);

-- ===== Activities (games/quizzes)
CREATE TABLE IF NOT EXISTS eventum.activities (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        uuid NOT NULL REFERENCES eventum.organizations(id) ON DELETE CASCADE,
  event_id      uuid REFERENCES eventum.events(id) ON DELETE CASCADE,
  title         text NOT NULL,
  type          eventum.activity_type NOT NULL,
  config        jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_active     boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- ===== Polls / voting
CREATE TABLE IF NOT EXISTS eventum.polls (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id   uuid NOT NULL REFERENCES eventum.events(id) ON DELETE CASCADE,
  title      text NOT NULL,
  created_by uuid REFERENCES eventum.users(id) ON DELETE SET NULL,
  is_open    boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS eventum.poll_options (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id   uuid NOT NULL REFERENCES eventum.polls(id) ON DELETE CASCADE,
  label     text NOT NULL,
  sort_order int NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS eventum.poll_votes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id     uuid NOT NULL REFERENCES eventum.polls(id) ON DELETE CASCADE,
  option_id   uuid NOT NULL REFERENCES eventum.poll_options(id) ON DELETE CASCADE,
  voter_id    uuid,         -- users.id or NULL
  guest_nickname text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE(poll_id, voter_id, guest_nickname)
);

-- ===== Privileges (priority actions: song/toast etc.)
CREATE TABLE IF NOT EXISTS eventum.privileges (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id      uuid NOT NULL REFERENCES eventum.organizations(id) ON DELETE CASCADE,
  event_id    uuid NOT NULL REFERENCES eventum.events(id) ON DELETE CASCADE,
  title       text NOT NULL,
  description text,
  price_cents int NOT NULL DEFAULT 0,
  currency    text NOT NULL DEFAULT 'RUB',
  is_active   boolean NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS eventum.privilege_orders (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  privilege_id  uuid NOT NULL REFERENCES eventum.privileges(id) ON DELETE CASCADE,
  event_id      uuid NOT NULL REFERENCES eventum.events(id) ON DELETE CASCADE,
  ordered_by    uuid REFERENCES eventum.users(id) ON DELETE SET NULL,
  guest_nickname text,
  status        text NOT NULL DEFAULT 'pending', -- pending|paid|fulfilled|canceled
  notes         text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- ===== Billing (plans/subscriptions/payments)
CREATE TABLE IF NOT EXISTS eventum.plans (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code          eventum.plan_code UNIQUE NOT NULL,
  name          text NOT NULL,
  max_staff     int,
  max_events_pm int,
  max_activities int,
  price_cents   int NOT NULL,
  currency      text NOT NULL DEFAULT 'RUB',
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS eventum.subscriptions (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id             uuid NOT NULL REFERENCES eventum.organizations(id) ON DELETE CASCADE,
  plan_id            uuid NOT NULL REFERENCES eventum.plans(id),
  provider           text NOT NULL,            -- stripe|yookassa
  provider_sub_id    text,
  status             eventum.subscription_status NOT NULL DEFAULT 'ACTIVE',
  current_period_end timestamptz,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS eventum.payments (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        uuid NOT NULL REFERENCES eventum.organizations(id) ON DELETE CASCADE,
  amount_cents  int NOT NULL,
  currency      text NOT NULL DEFAULT 'RUB',
  provider      text NOT NULL,
  provider_id   text,
  status        text NOT NULL, -- succeeded|pending|canceled|failed
  meta          jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- ===== Sessions & audit
CREATE TABLE IF NOT EXISTS eventum.sessions (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES eventum.users(id) ON DELETE CASCADE,
  ip         inet,
  ua         text,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz
);

CREATE TABLE IF NOT EXISTS eventum.audit_logs (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id     uuid,
  user_id    uuid,
  action     text NOT NULL,
  entity     text,
  entity_id  uuid,
  meta       jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ===== Essential indexes (more in DDL files)
CREATE INDEX IF NOT EXISTS idx_events_org ON eventum.events(org_id);
CREATE INDEX IF NOT EXISTS idx_users_org ON eventum.users(org_id);
CREATE INDEX IF NOT EXISTS idx_activities_event ON eventum.activities(event_id);
CREATE INDEX IF NOT EXISTS idx_polls_event ON eventum.polls(event_id);

-- ===== RLS (row level security)
ALTER TABLE eventum.users            ENABLE ROW LEVEL SECURITY;
ALTER TABLE eventum.organizations    ENABLE ROW LEVEL SECURITY;
ALTER TABLE eventum.events           ENABLE ROW LEVEL SECURITY;
ALTER TABLE eventum.activities       ENABLE ROW LEVEL SECURITY;
ALTER TABLE eventum.privileges       ENABLE ROW LEVEL SECURITY;
ALTER TABLE eventum.privilege_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE eventum.polls            ENABLE ROW LEVEL SECURITY;
ALTER TABLE eventum.poll_options     ENABLE ROW LEVEL SECURITY;
ALTER TABLE eventum.poll_votes       ENABLE ROW LEVEL SECURITY;

-- Session helpers
CREATE OR REPLACE FUNCTION eventum.current_org() RETURNS uuid
LANGUAGE sql STABLE AS $$ SELECT current_setting('eventum.org_id', true)::uuid $$;

CREATE OR REPLACE FUNCTION eventum.is_admin() RETURNS boolean
LANGUAGE sql STABLE AS $$ SELECT current_setting('eventum.is_admin', true) = '1' $$;

-- Basic policies (org-scoped)
CREATE POLICY events_by_org ON eventum.events
  USING (org_id = eventum.current_org() OR eventum.is_admin());

CREATE POLICY acts_by_org ON eventum.activities
  USING (org_id = eventum.current_org() OR eventum.is_admin());

CREATE POLICY priv_by_org ON eventum.privileges
  USING (org_id = eventum.current_org() OR eventum.is_admin());

CREATE POLICY priv_orders_by_event_org ON eventum.privilege_orders
  USING (event_id IN (SELECT id FROM eventum.events WHERE org_id = eventum.current_org()) OR eventum.is_admin());

CREATE POLICY users_by_org ON eventum.users
  USING (org_id = eventum.current_org() OR eventum.is_admin());
