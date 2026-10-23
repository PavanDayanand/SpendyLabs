import { test } from "node:test";
import assert from "node:assert/strict";
import waitlistHandler from "../api/waitlist";

test("Vercel waitlist handler rejects unsupported methods", async () => {
  const response = await waitlistHandler(
    new Request("http://localhost/api/waitlist", {
      headers: { "x-forwarded-for": "203.0.113.10" },
    }),
  );

  assert.equal(response.status, 405);
  assert.deepEqual(await response.json(), { message: "Method not allowed." });
});

test("Vercel waitlist handler validates a POST before storage", async () => {
  const response = await waitlistHandler(
    new Request("http://localhost/api/waitlist", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": "203.0.113.11",
      },
      body: "{}",
    }),
  );

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    message: "Please enter a valid email address.",
  });
});
