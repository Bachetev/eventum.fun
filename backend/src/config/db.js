import dotenv from "dotenv";
import { Pool } from "pg";
dotenv.config();

const pool = new Pool({
  host: process.env.PGHOST || "localhost",
  port: Number(process.env.PGPORT || 5432),
  database: process.env.PGDATABASE || "eventum",
  user: process.env.PGUSER || "postgres",
  password: process.env.PGPASSWORD || "",
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000
});

// helpers to use in services later
export async function query(text, params) {
  return pool.query(text, params);
}
export async function getClient() {
  return pool.connect();
}

// optional: set RLS session vars when you need org scoping
export async function withOrg(orgId, isAdmin = false) {
  const client = await pool.connect();
  try {
    await client.query(`SET LOCAL "eventum.org_id" = $1`, [orgId]);
    await client.query(`SET LOCAL "eventum.is_admin" = $1`, [isAdmin ? "1" : "0"]);
    return client;
  } catch (e) {
    client.release();
    throw e;
  }
}

process.on("SIGINT", async () => {
  await pool.end();
  process.exit(0);
});

export default pool;
