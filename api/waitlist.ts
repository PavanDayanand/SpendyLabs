type WaitlistBody = {
  email?: unknown;
  consent?: unknown;
  website?: unknown;
};

type AttemptWindow = { count: number; resetsAt: number };
const attempts = new Map<string, AttemptWindow>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1_000;
const RATE_LIMIT_MAX = 10;
const CONSENT_VERSION = "2026-10-10";

function json(message: string, status: number) {
  return Response.json(
    { message },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    },
  );
}

function isRateLimited(request: Request) {
  const now = Date.now();
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const key = ip || "unknown";
  const current = attempts.get(key);
  if (!current || current.resetsAt <= now) {
    attempts.set(key, { count: 1, resetsAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  current.count += 1;
  return current.count > RATE_LIMIT_MAX;
}

function validateSignup(body: WaitlistBody) {
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

async function saveSignup(email: string) {
  const url = process.env.GOOGLE_SHEETS_WEB_APP_URL;
  const secret = process.env.GOOGLE_SHEETS_WAITLIST_SECRET;
  if (!url || !secret) throw new Error("Waitlist storage is not configured.");

  const response = await fetch(url, {
    method: "POST",
    redirect: "follow",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
      consentVersion: CONSENT_VERSION,
      secret,
    }),
    signal: AbortSignal.timeout(8_000),
  });
  const text = await response.text();
  let result: { ok?: boolean };
  try {
    result = JSON.parse(text) as { ok?: boolean };
  } catch {
    throw new Error("Waitlist storage returned an unreadable response.");
  }
  if (!response.ok || result.ok !== true) {
    throw new Error("Waitlist storage did not confirm the save.");
  }
}

export default async function handler(request: Request) {
  if (request.method !== "POST") return json("Method not allowed.", 405);
  if (isRateLimited(request)) {
    return json(
      "A few too many attempts. Please try again in 15 minutes.",
      429,
    );
  }

  const size = Number(request.headers.get("content-length") || 0);
  if (size > 2_048) return json("Request is too large.", 413);

  let body: WaitlistBody;
  try {
    body = (await request.json()) as WaitlistBody;
  } catch {
    return json("Please enter your email and consent.", 400);
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return json("Please enter your email and consent.", 400);
  }
  if (body.website) {
    return json("Could not submit this form. Please try again.", 400);
  }
  const error = validateSignup(body);
  if (error) return json(error, 400);

  try {
    await saveSignup(body.email as string);
    return json("You're on the list.", 200);
  } catch {
    return json("Could not save your signup. Please try again shortly.", 503);
  }
}
