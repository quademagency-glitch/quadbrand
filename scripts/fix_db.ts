import { query } from "@/lib/db/client";

async function fix() {
  try {
    await query("ALTER TABLE generations ALTER COLUMN brand_id DROP NOT NULL;");
    console.log("Successfully made brand_id nullable!");
  } catch (err) {
    console.error("Error:", err);
  }
}

fix();
