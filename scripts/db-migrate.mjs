// Applies every migration in db/ in order (or only the SQL file given as an argument) to DATABASE_URL.
// Usage: pnpm db:migrate · pnpm db:apply db/circles/<circle>.sql
// Not included: quest-07b/07c (fill in emails first) and quest-cron.sql (run in the Supabase SQL editor).
import { readFile } from "node:fs/promises";
import postgres from "postgres";

const MIGRATIONS = [
  "quest-00-schema.sql",
  "quest-stages.sql",
  "quest-01-active.sql",
  "quest-02-hidden.sql",
  "quest-03-slug.sql",
  "quest-04-celebrations.sql",
  "quest-06-partner-profiles.sql",
  "quest-07-circles-roles.sql",
  "quest-08-circle-event.sql",
];

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set (add it to .env.local)");
  process.exit(1);
}
const sql = postgres(url, { prepare: false, max: 1, onnotice: () => {} });
try {
  const file = process.argv[2];
  if (file) {
    await sql.unsafe(await readFile(file, "utf8"));
    console.log(`Applied ${file}.`);
  } else {
    for (const name of MIGRATIONS) await sql.unsafe(await readFile(new URL(`../db/${name}`, import.meta.url), "utf8"));
    console.log("Database schema is up to date.");
  }
} finally {
  await sql.end();
}
