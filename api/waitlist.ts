import { saveSignupToGoogleSheet } from "../server/googleSheetsWaitlist";

type WaitlistBody = {
  email?: unknown;
  consent?: unknown;
  website?: unknown;
};

type VercelRequest = {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
};

type VercelResponse = {
  setHeader(name: string, value: string): void;
  status(code: number): VercelResponse;
  json(body: { message: string }): void;
};

type AttemptWindow = { count: number; resetsAt: number };
const attempts = new Map<string, AttemptWindow>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1_000;
const RATE_LIMIT_MAX = 10;

function requestIp(request: VercelRequest) {
  const forwarded = request.headers["x-forwarded-for"];
  const value = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return value?.split(",")[0]?.trim() || "unknown";
}

function isRateLimited(request: VercelRequest) {
  const now = Date.now();
  const ip = requestIp(request);
  const current = attempts.get(ip);
  if (!current || current.resetsAt <= now) {
    attempts.set(ip, { count: 1, resetsAt: now + RATE_LIMIT_WINDOW_MS });
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

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("X-Content-Type-Options", "nosniff");

  if (request.method !== "POST") {
    response.status(405).json({ message: "Method not allowed." });
    return;
  }
  if (isRateLimited(request)) {
    response.status(429).json({
      message: "A few too many attempts. Please try again in 15 minutes.",
    });
    return;
  }

  const rawSize = request.headers["content-length"];
  const size = Number(Array.isArray(rawSize) ? rawSize[0] : rawSize || 0);
  if (size > 2_048) {
    response.status(413).json({ message: "Request is too large." });
    return;
  }

  let body = request.body as WaitlistBody;
  if (typeof request.body === "string") {
    try {
      body = JSON.parse(request.body) as WaitlistBody;
    } catch {
      response
        .status(400)
        .json({ message: "Please enter your email and consent." });
      return;
    }
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    response
      .status(400)
      .json({ message: "Please enter your email and consent." });
    return;
  }
  if (body.website) {
    response
      .status(400)
      .json({ message: "Could not submit this form. Please try again." });
    return;
  }
  const error = validateSignup(body);
  if (error) {
    response.status(400).json({ message: error });
    return;
  }

  try {
    await saveSignupToGoogleSheet(body.email as string);
    response.status(200).json({ message: "You're on the list." });
  } catch {
    response.status(503).json({
      message: "Could not save your signup. Please try again shortly.",
    });
  }
}
