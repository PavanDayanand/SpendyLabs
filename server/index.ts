import express from "express";
import rateLimit from "express-rate-limit";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { openWaitlist, saveSignup, validateSignup } from "./waitlist";
import { saveSignupToGoogleSheet } from "./googleSheetsWaitlist";

const app = express();
const port = Number(process.env.PORT || 3001);
const useGoogleSheets = Boolean(process.env.GOOGLE_SHEETS_WEB_APP_URL);
const database = useGoogleSheets
  ? null
  : openWaitlist(process.env.WAITLIST_DB_PATH || ".data/waitlist.sqlite");
app.disable("x-powered-by");
app.use(express.json({ limit: "2kb" }));
app.use((_request, response, next) => {
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  response.setHeader("X-Frame-Options", "DENY");
  next();
});
app.get("/api/health", (_request, response) => response.json({ ok: true }));
const signupLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: "A few too many attempts. Please try again in 15 minutes.",
  },
});
app.post("/api/waitlist", signupLimit, async (request, response) => {
  response.setHeader("Cache-Control", "no-store");
  if (
    !request.body ||
    typeof request.body !== "object" ||
    Array.isArray(request.body)
  ) {
    response
      .status(400)
      .json({ message: "Please enter your email and consent." });
    return;
  }
  // A hidden field catches basic bots. Never claim success without saving a real signup.
  if (request.body.website) {
    response
      .status(400)
      .json({ message: "Could not submit this form. Please try again." });
    return;
  }
  const error = validateSignup(request.body);
  if (error) {
    response.status(400).json({ message: error });
    return;
  }
  try {
    if (useGoogleSheets) {
      await saveSignupToGoogleSheet(request.body.email);
    } else {
      saveSignup(database!, request.body.email);
    }
    // The same response for duplicate emails avoids disclosing membership.
    response.status(200).json({ message: "You're on the list." });
  } catch {
    response.status(503).json({
      message: "Could not save your signup. Please try again shortly.",
    });
  }
});
app.use("/api", (_request, response) =>
  response.status(404).json({ message: "Endpoint not found." }),
);

// After npm run build, this same server also serves the React site.
const dist = resolve("dist");
if (existsSync(dist)) {
  app.use(express.static(dist));
  app.get("/{*path}", (_request, response) =>
    response.sendFile(resolve(dist, "index.html")),
  );
}
app.use(
  (
    error: { status?: number },
    _request: express.Request,
    response: express.Response,
    _next: express.NextFunction,
  ) => {
    response
      .status(error.status === 413 ? 413 : 400)
      .json({ message: "Could not read this request. Please try again." });
  },
);
const server = app.listen(port, process.env.HOST || "127.0.0.1", () =>
  console.log(`Spendy server: http://127.0.0.1:${port}`),
);
function stop() {
  server.close(() => {
    database?.close();
    process.exit(0);
  });
}
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
