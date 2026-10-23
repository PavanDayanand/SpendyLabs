import { test } from "node:test";
import assert from "node:assert/strict";
import { saveSignupToGoogleSheet } from "./googleSheetsWaitlist";

test("sends a normalized signup without exposing configuration to the browser", async () => {
  let sentBody = "";
  const fetcher: typeof fetch = async (_input, init) => {
    sentBody = String(init?.body || "");
    return new Response(JSON.stringify({ ok: true, duplicate: false }));
  };

  const result = await saveSignupToGoogleSheet(" Hello@Example.com ", {
    url: "https://script.google.com/example",
    secret: "private-test-secret",
    fetcher,
  });

  assert.equal(result.ok, true);
  assert.deepEqual(JSON.parse(sentBody), {
    email: "hello@example.com",
    consentVersion: "2026-10-10",
    secret: "private-test-secret",
  });
});

test("fails closed when Apps Script does not confirm the save", async () => {
  const fetcher: typeof fetch = async () =>
    new Response(JSON.stringify({ ok: false }));

  await assert.rejects(() =>
    saveSignupToGoogleSheet("hello@example.com", {
      url: "https://script.google.com/example",
      secret: "private-test-secret",
      fetcher,
    }),
  );
});
