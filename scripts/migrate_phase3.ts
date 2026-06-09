import { pool } from "../src/lib/db/client";

async function runMigration() {
  console.log("Starting Phase 3 Migration...");
  
  try {
    // Add is_winner to generations
    await pool.query(`
      ALTER TABLE generations 
      ADD COLUMN IF NOT EXISTS is_winner BOOLEAN DEFAULT false;
    `);
    console.log("✅ Added is_winner column to generations table");

    console.log("Migration completed successfully.");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await pool.end();
  }
}

runMigration();
