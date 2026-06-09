import { query } from "@/lib/db/client";

async function test() {
  const { rows } = await query("SELECT id, email FROM user_profiles");
  console.log("Users in DB:", rows);
}

test();
