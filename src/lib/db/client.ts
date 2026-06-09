import { Pool } from "pg";

// Using a singleton pattern to avoid creating multiple connection pools in development
// when Next.js reloads API routes.

const globalForPg = global as unknown as {
  pgPool: Pool | undefined;
};

export const pool =
  globalForPg.pgPool ||
  new Pool({
    connectionString: process.env.DATABASE_URL?.includes('pgbouncer=true') 
      ? process.env.DATABASE_URL 
      : `${process.env.DATABASE_URL}${process.env.DATABASE_URL?.includes('?') ? '&' : '?'}pgbouncer=true`,
    max: 2, // Vercel spins up many functions; keep per-function pool tiny
    idleTimeoutMillis: 3000, // Close idle connections quickly
    connectionTimeoutMillis: 10000, // Error out fast if pooler is hanging
    allowExitOnIdle: true, // Allow Node to exit if pool is idle
    ssl: {
      rejectUnauthorized: false
    }
  });

if (process.env.NODE_ENV !== "production") {
  globalForPg.pgPool = pool;
}

/**
 * Helper to run a query.
 * Usage: const { rows } = await query('SELECT * FROM users WHERE id = $1', [userId]);
 */
export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log("Executed query", { text, duration, rows: res.rowCount });
    return res;
  } catch (err) {
    console.error("Query error", { text, err });
    throw err;
  }
}
