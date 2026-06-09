import fs from 'fs';
import path from 'path';
import { pool } from '../src/lib/db/client';

async function runMigration() {
  const filePath = path.join(process.cwd(), 'migrations', '004_webhooks.sql');
  
  try {
    const sql = fs.readFileSync(filePath, 'utf8');
    console.log("Running Phase 4 migration: 004_webhooks.sql...");
    
    await pool.query(sql);
    console.log("✅ Successfully applied Phase 4 migration!");
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await pool.end();
  }
}

runMigration();
