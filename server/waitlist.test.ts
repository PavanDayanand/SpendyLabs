import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { openWaitlist, saveSignup, validateSignup } from "./waitlist";

test("reject invalid email values and missing consent", () => {
  for (const email of [
    null,
    10,
    "",
    "bad-email",
    "a @b.com",
    "a@b",
    "a".repeat(255) + "@b.com",
  ]) {
    assert.ok(validateSignup({ email, consent: true }));
  }
  assert.ok(validateSignup({ email: "a@b.com", consent: false }));
  assert.ok(validateSignup({ email: "a@b.com", consent: "true" }));
  assert.equal(
    validateSignup({ email: " Hello@Example.com ", consent: true }),
    null,
  );
});

test("normalise, deduplicate, and retain signups across database reopen", () => {
  const folder = mkdtempSync(join(tmpdir(), "spendy-waitlist-"));
  const path = join(folder, "waitlist.sqlite");
  try {
    let db = openWaitlist(path);
    saveSignup(db, " Hello@Example.com ");
    saveSignup(db, "hello@example.com");
    db.close();
    db = openWaitlist(path);
    const entries = db.prepare("SELECT * FROM waitlist").all();
    assert.equal(entries.length, 1);
    assert.equal(entries[0].email, "hello@example.com");
    assert.equal(entries[0].consent_version, "2026-10-10");
    assert.ok(entries[0].consent_at);
    db.close();
  } finally {
    rmSync(folder, { recursive: true, force: true });
  }
});
