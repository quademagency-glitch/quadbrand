import fs from "fs";
const env = fs.readFileSync(".env.local", "utf-8");
env.split("\\n").forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) process.env[match[1]] = match[2];
});
import { pool } from "../src/lib/db/client";

async function runMigration() {
  try {
    const sql = fs.readFileSync("migrations/006_supabase_auth_sync.sql", "utf-8");
    await pool.query(sql);
    console.log("Migration 006 successful!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    process.exit(0);
  }
}

runMigration();
