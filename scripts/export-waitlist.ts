import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
const path = process.env.WAITLIST_DB_PATH || ".data/waitlist.sqlite";
if (!existsSync(path))
  throw new Error(
    "No waitlist database yet. Start the server and submit the form first.",
  );
const db = new DatabaseSync(path, { readOnly: true });
const entries = db
  .prepare(
    "SELECT email, created_at, consent_at, consent_version FROM waitlist ORDER BY created_at",
  )
  .all();
// JSON preserves exact values without spreadsheet formula injection concerns.
writeFileSync(".data/waitlist-export.json", JSON.stringify(entries, null, 2));
db.close();
console.log(
  `Exported ${entries.length} signups to .data/waitlist-export.json. Keep this file private.`,
);
