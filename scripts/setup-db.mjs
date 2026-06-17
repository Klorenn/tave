#!/usr/bin/env node
// Run with: node scripts/setup-db.mjs
// Requires SUPABASE_SERVICE_ROLE_KEY or SUPABASE_DB_PASSWORD env var

import { readFileSync } from "fs"
import { createClient } from "@supabase/supabase-js"
import { parse } from "dotenv"

// Load .env
const envRaw = readFileSync(".env", "utf-8")
const env = parse(envRaw)

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  console.error("❌ NEXT_PUBLIC_SUPABASE_URL not found in .env")
  process.exit(1)
}

const sql = `
CREATE TABLE IF NOT EXISTS newsletter (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  name text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE newsletter ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'newsletter' AND policyname = 'Anyone can insert newsletter') THEN
    CREATE POLICY "Anyone can insert newsletter" ON newsletter
      FOR INSERT TO anon WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'newsletter' AND policyname = 'Only admins can read newsletter') THEN
    CREATE POLICY "Only admins can read newsletter" ON newsletter
      FOR SELECT TO authenticated
      USING (auth.jwt() ->> 'is_admin' = 'true');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'contact_messages' AND policyname = 'Anyone can insert contact messages') THEN
    CREATE POLICY "Anyone can insert contact messages" ON contact_messages
      FOR INSERT TO anon WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'contact_messages' AND policyname = 'Only admins can read contact messages') THEN
    CREATE POLICY "Only admins can read contact messages" ON contact_messages
      FOR SELECT TO authenticated
      USING (auth.jwt() ->> 'is_admin' = 'true');
  END IF;
END $$;
`

async function main() {
  // Try service_role key first (easiest for server-side setup)
  if (serviceRoleKey) {
    console.log("🔑 Using service_role key...")
    const supabase = createClient(supabaseUrl, serviceRoleKey)
    const { error } = await supabase.rpc("exec_sql", { query: sql })
    if (error) {
      console.error("❌ exec_sql RPC failed:", error.message)
      console.log("   This RPC may not exist on the project.")
      process.exit(1)
    }
    console.log("✅ Tables created via service_role key!")
    process.exit(0)
  }

  // Try psql with DB password
  const dbPassword = env.SUPABASE_DB_PASSWORD || process.env.SUPABASE_DB_PASSWORD
  if (dbPassword) {
    const projectRef = supabaseUrl.match(/https:\/\/(.+)\.supabase\.co/)?.[1]
    const connString = `postgresql://postgres:${dbPassword}@db.${projectRef}.supabase.co:5432/postgres`
    console.log("🔌 Connecting via psql...")
    const { execSync } = await import("child_process")
    try {
      execSync(`psql "${connString}" -c "${sql.replace(/"/g, '\\"').replace(/\n/g, ' ')}"`, { stdio: "inherit" })
      console.log("✅ Tables created via psql!")
      process.exit(0)
    } catch (e) {
      console.error("❌ psql failed:", e.message)
    }
  }

  console.error(`
❌ Cannot create tables automatically.

You need either:
  1. Add SUPABASE_SERVICE_ROLE_KEY to .env (from Supabase Dashboard → Settings → API)
  2. Add SUPABASE_DB_PASSWORD to .env (from Supabase Dashboard → Project Settings → Database)
  3. OR run the SQL manually in Supabase Dashboard → SQL Editor:

Open: https://supabase.com/dashboard/project/${supabaseUrl.match(/https:\/\/(.+)\.supabase\.co/)?.[1]}/sql/new
And paste the SQL from supabase/migrations/20260616_newsletter.sql
`)
  process.exit(1)
}

main()
