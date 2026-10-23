import { saveSignupToGoogleSheet } from "../server/googleSheetsWaitlist";
import { validateSignup, type Signup } from "../server/waitlist";

const jsonHeaders = {
  "Cache-Control": "no-store",
  "Content-Type": "application/json; charset=utf-8",
  "X-Content-Type-Options": "nosniff",
};

function json(message: string, status: number) {
  return new Response(JSON.stringify({ message }), {
    status,
    headers: jsonHeaders,
  });
}

export default {
  async fetch(request: Request) {
    if (request.method !== "POST") return json("Endpoint not found.", 404);

    const size = Number(request.headers.get("content-length") || 0);
    if (size > 2_048) return json("Request is too large.", 413);

    let body: Signup;
    try {
      body = (await request.json()) as Signup;
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
      await saveSignupToGoogleSheet(body.email as string);
      return json("You're on the list.", 200);
    } catch {
      return json("Could not save your signup. Please try again shortly.", 503);
    }
  },
};
