import bcrypt from "bcrypt";
import { query } from "../config/db.js";

export async function register({ role, phone, email, password, display_name }) {
  if (!phone && !email) {
    const e = new Error("phone or email is required");
    e.status = 400; throw e;
  }

  // дубликаты
  const dup = await query(
    `SELECT id FROM eventum.users
     WHERE (phone = $1 AND $1 IS NOT NULL) OR (email = $2 AND $2 IS NOT NULL)`,
    [phone || null, email || null]
  );
  if (dup.rowCount) { const e = new Error("user already exists"); e.status = 409; throw e; }

  const password_hash = await bcrypt.hash(password, 10);

  // если ORGANIZER  создаём организацию
  let orgId = null;
  if (role === "ORGANIZER") {
    const org = await query(
      `INSERT INTO eventum.organizations (name) VALUES ($1) RETURNING id`,
      [display_name || phone || email || "Organization"]
    );
    orgId = org.rows[0].id;
  }

  const ins = await query(
    `INSERT INTO eventum.users (org_id, phone, email, password_hash, role, display_name)
     VALUES ($1,$2,$3,$4,$5,$6)
     RETURNING id, org_id, role, display_name`,
    [orgId, phone || null, email || null, password_hash, role, display_name || null]
  );

  if (orgId) {
    await query(
      `UPDATE eventum.organizations SET owner_user_id = $1 WHERE id = $2`,
      [ins.rows[0].id, orgId]
    );
  }

  return { user: ins.rows[0] };
}

export async function login({ phone, email, password }) {
  const u = await query(
    `SELECT id, org_id, role, display_name, password_hash
     FROM eventum.users
     WHERE (phone = $1 AND $1 IS NOT NULL) OR (email = $2 AND $2 IS NOT NULL)
     LIMIT 1`,
    [phone || null, email || null]
  );
  if (!u.rowCount) { const e = new Error("invalid credentials"); e.status = 401; throw e; }

  const user = u.rows[0];
  const ok = await bcrypt.compare(password, user.password_hash || "");
  if (!ok) { const e = new Error("invalid credentials"); e.status = 401; throw e; }

  delete user.password_hash;
  return { user };
}
