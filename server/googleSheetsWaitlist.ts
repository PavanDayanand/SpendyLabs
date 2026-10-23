const CONSENT_VERSION = "2026-10-10";

type GoogleSheetsResult = {
  ok?: boolean;
  duplicate?: boolean;
};

type SaveOptions = {
  url?: string;
  secret?: string;
  fetcher?: typeof fetch;
};

export async function saveSignupToGoogleSheet(
  email: string,
  options: SaveOptions = {},
) {
  const url = options.url || process.env.GOOGLE_SHEETS_WEB_APP_URL;
  const secret = options.secret || process.env.GOOGLE_SHEETS_WAITLIST_SECRET;
  if (!url || !secret) {
    throw new Error("Google Sheets waitlist is not configured.");
  }

  const response = await (options.fetcher || fetch)(url, {
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
  let result: GoogleSheetsResult;
  try {
    result = JSON.parse(text) as GoogleSheetsResult;
  } catch {
    throw new Error("Google Sheets returned an unreadable response.");
  }
  if (!response.ok || result.ok !== true) {
    throw new Error("Google Sheets did not save the signup.");
  }
  return result;
}
