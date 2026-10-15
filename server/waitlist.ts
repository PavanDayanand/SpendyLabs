import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

export type Signup = { email?: unknown; consent?: unknown; website?: unknown };

export function validateSignup(body: Signup) {
  if (typeof body.email !== "string")
    return "Please enter a valid email address.";
  const email = body.email.trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Please enter a valid email address.";
  }
  if (body.consent !== true)
    return "Please agree to receive beta and launch emails.";
  return null;
}

// SQLite keeps signups across server restarts. It also enforces unique emails.
export function openWaitlist(path: string) {
  if (path !== ":memory:") mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path);
  db.exec(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS waitlist (
      email TEXT PRIMARY KEY,
      created_at TEXT NOT NULL,
      consent_at TEXT NOT NULL,
      consent_version TEXT NOT NULL
    );
  `);
  return db;
}

export function saveSignup(db: DatabaseSync, email: string) {
  const now = new Date().toISOString();
  db.prepare(
    "INSERT OR IGNORE INTO waitlist (email, created_at, consent_at, consent_version) VALUES (?, ?, ?, ?)",
  ).run(email.trim().toLowerCase(), now, now, "2026-10-10");
}
