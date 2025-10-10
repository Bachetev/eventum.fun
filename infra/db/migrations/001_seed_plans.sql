INSERT INTO eventum.plans (code, name, max_staff, max_events_pm, max_activities, price_cents, currency)
VALUES
  ('BASIC','Базовый', 5, 10, 3, 190000, 'RUB'),
  ('PRO','Продвинутый', 10, 20, 6, 390000, 'RUB'),
  ('POWER','Мощный', NULL, NULL, NULL, 690000, 'RUB')
ON CONFLICT (code) DO NOTHING;
