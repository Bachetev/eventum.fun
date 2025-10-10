CREATE INDEX IF NOT EXISTS idx_event_timeline_event ON eventum.event_timeline(event_id);
CREATE INDEX IF NOT EXISTS idx_staff_org ON eventum.staff(org_id);
CREATE INDEX IF NOT EXISTS idx_event_staff_event ON eventum.event_staff(event_id);
CREATE INDEX IF NOT EXISTS idx_guests_event ON eventum.guests(event_id);
CREATE INDEX IF NOT EXISTS idx_priv_orders_event ON eventum.privilege_orders(event_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_org ON eventum.subscriptions(org_id);
CREATE INDEX IF NOT EXISTS idx_payments_org ON eventum.payments(org_id);
