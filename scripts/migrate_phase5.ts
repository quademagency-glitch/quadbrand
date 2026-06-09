import { query } from "@/lib/db/client";
import * as fs from "fs";
import * as path from "path";

async function migrate() {
  try {
    const sql = fs.readFileSync(path.join(process.cwd(), "migrations", "005_growth.sql"), "utf8");
    await query(sql);
    console.log("Successfully ran 005_growth.sql migration!");
  } catch (err) {
    console.error("Migration failed:", err);
  }
}

migrate();
