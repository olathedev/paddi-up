// Applies one SQL file to DATABASE_URL: circle data (db/circles) or a manual script (db/manual).
// Schema migrations live in supabase/migrations and go through the Supabase CLI (pnpm db:push).
// Usage: pnpm db:apply db/circles/devfest-jos-2026.sql
import { readFile } from "node:fs/promises";
import postgres from "postgres";

const url = process.env.DATABASE_URL;
const file = process.argv[2];
if (!url || !file) {
  console.error(!url ? "DATABASE_URL is not set (add it to .env.local)" : "Usage: pnpm db:apply <file.sql>");
  process.exit(1);
}
const sql = postgres(url, { prepare: false, max: 1, onnotice: () => {} });
try {
  await sql.unsafe(await readFile(file, "utf8"));
  console.log(`Applied ${file}.`);
} finally {
  await sql.end();
}
