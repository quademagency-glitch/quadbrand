import fs from 'fs';
import path from 'path';
import { pool } from '../src/lib/db/client';

async function runMigrations() {
  const migrationsDir = path.join(process.cwd(), 'migrations');
  
  try {
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql') && !f.startsWith('._'))
      .sort(); // Run in alphabetical order

    for (const file of files) {
      console.log(`Running migration: ${file}...`);
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      await pool.query(sql);
      console.log(`✅ Completed: ${file}`);
    }

    // Now run Phase 3 which adds the is_winner column
    console.log(`Running Phase 3 migration...`);
    await pool.query(`
      ALTER TABLE generations 
      ADD COLUMN IF NOT EXISTS is_winner BOOLEAN DEFAULT false;
    `);
    console.log(`✅ Completed: Phase 3 migration`);

    console.log('🎉 All migrations successfully applied!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await pool.end();
  }
}

runMigrations();
