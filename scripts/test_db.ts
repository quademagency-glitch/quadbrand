import { pool } from "../src/lib/db/client";

async function checkDb() {
  try {
    const { rows } = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log("Tables in database:");
    rows.forEach(r => console.log("- " + r.table_name));
    
    // Test connection success
    console.log("Successfully connected to Supabase!");
  } catch (err) {
    console.error("Failed to connect:", err);
  } finally {
    await pool.end();
  }
}

checkDb();
