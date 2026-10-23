import { test } from "node:test";
import assert from "node:assert/strict";
import waitlistHandler from "../api/waitlist";

function responseRecorder() {
  let statusCode = 0;
  let payload: { message: string } | undefined;
  const response = {
    setHeader() {},
    status(code: number) {
      statusCode = code;
      return response;
    },
    json(body: { message: string }) {
      payload = body;
    },
  };
  return {
    response,
    result: () => ({ statusCode, payload }),
  };
}

test("Vercel waitlist handler rejects unsupported methods", async () => {
  const recorder = responseRecorder();
  await waitlistHandler(
    { method: "GET", headers: {} },
    recorder.response,
  );
  assert.deepEqual(recorder.result(), {
    statusCode: 405,
    payload: { message: "Method not allowed." },
  });
});

test("Vercel waitlist handler validates a POST before storage", async () => {
  const recorder = responseRecorder();
  await waitlistHandler(
    { method: "POST", headers: {}, body: {} },
    recorder.response,
  );
  assert.equal(recorder.result().statusCode, 400);
  assert.equal(
    recorder.result().payload?.message,
    "Please enter a valid email address.",
  );
});
