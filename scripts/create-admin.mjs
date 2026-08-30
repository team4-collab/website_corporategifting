// One-off admin bootstrap script.
// Usage: node scripts/create-admin.mjs
// Reads NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY, ADMIN_EMAIL, ADMIN_PASSWORD from .env.local.

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

function loadEnvLocal() {
  try {
    const content = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
    for (const line of content.split("\n")) {
      const match = line.match(/^([A-Z_]+)=(.*)$/);
      if (match) process.env[match[1]] ??= match[2].trim();
    }
  } catch {
    // .env.local not found — rely on already-exported environment variables
  }
}

loadEnvLocal();

const { NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

if (!NEXT_PUBLIC_SUPABASE_URL || !SUPABASE_SECRET_KEY || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("Missing required env vars. Check .env.local.");
  process.exit(1);
}

const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data: existing } = await supabase.auth.admin.listUsers();
const existingUser = existing?.users.find((u) => u.email === ADMIN_EMAIL);

if (existingUser) {
  const { error } = await supabase.auth.admin.updateUserById(existingUser.id, {
    password: ADMIN_PASSWORD,
  });
  if (error) {
    console.error("Failed to update admin password:", error.message);
    process.exit(1);
  }
  console.log(`Updated password for existing admin user: ${ADMIN_EMAIL}`);
} else {
  const { error } = await supabase.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    email_confirm: true,
  });
  if (error) {
    console.error("Failed to create admin user:", error.message);
    process.exit(1);
  }
  console.log(`Created admin user: ${ADMIN_EMAIL}`);
}
