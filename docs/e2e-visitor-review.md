# Spendy visitor-flow review — 3 November 2026

## Setup and scope

Initialized the requested `e2e` framework (0.22.0) and its web engine (0.15.4). Tests live in `tests/visitor-flows.e2e.ts`, with four browser targets in `e2e.config.ts`. No AI gateway or credentials are required for these deterministic tests.

The framework supports Node 22.22.3+ on the Node 22 line, or Node 24.8+. The installed Node 23 was rejected, so this review used a temporary Node 24 runtime. Do not interpret that as a website runtime failure.

All signup writes went to `/tmp/spendy-e2e-20261103.sqlite`, with the Google Sheets variables explicitly removed. Production storage was not tested. Failure/retry testing uses HTTP stubs; the separate signup/duplicate test uses the actual local backend.

## Coverage

Seven flows run on each target: 390px light with motion, 320px dark with reduced motion, and 1440px desktop in both configurations.

1. Product and availability copy present; signup reachable through the appropriate navigation.
2. Menu opening, Escape and focus return, persistent theme, Updates and Privacy routes.
3. Screenshot decoding, one Insights image, keyboard preview switching, no horizontal overflow.
4. FAQ answers for availability, free essentials, and bank access.
5. Actual local signup, submitted email on ticket, keyboard tearing, dismissal, duplicate signup.
6. HTTP 503 without false success, retained email, then recovery using a stubbed success.
7. Browser validation for malformed email and missing consent.

These assertions establish functional behavior. They do not establish comprehension or whether visitors like the page.

## Observed improvement opportunities

| Priority | Evidence | Suggested improvement |
| --- | --- | --- |
| High | The iPhone shortcut PNG is 5,057,146 bytes. The Rive WASM is 2,004,858 bytes before HTTP compression. The entry PNG is 1,254,305 bytes. | Resize and encode screenshot assets for their display size; profile the animated hero on a real phone and mobile data. These are asset sizes, not measured cellular load times. |
| Medium | At 320px and 390px, the gallery's measured first image was approximately 155px and 200px wide after animation settled. Screens overlap in the fan. | Let visitors open a readable screenshot detail or provide a larger mobile preview. Keep the gallery compact; do not add more repeated images. |
| Medium | The header's direct waitlist action is hidden at widths up to 700px. The hero action leads to screenshots. Signup is available through the menu and farther down the page. | Consider making the existing hero action or mobile header provide a clear signup route. Validate discoverability before redesigning the header again. |
| Medium | Standalone text links measured about 16–21px high; main menu and form controls are larger. | Review hit areas and spacing on a physical phone. A small text box alone does not establish an accessibility violation; inline-link and spacing exceptions need assessment. |
| Medium | Copy promises budgets, while the gallery contains subscriptions, analytics, home and entry. | Replace entry with a genuine light/dark budget capture when available; retain four gallery screens. |

Additional rendering checks at 320, 390, 768 and 1440px found no page JavaScript errors or horizontal overflow. Settled mobile screenshots were inspected. The trailer depends on YouTube; playback was not verified by this suite.

## What real visitors still need to tell us

These are questions to validate, not invented user feedback:

- Can someone explain what Spendy does after seeing the hero?
- Can they find signup on a phone without being prompted to open the menu?
- Can they read enough of the screenshots to understand the product?
- Do they understand manual entry, local records, free essentials, and current beta availability?
- Is budget evidence missing from their decision?

Ask 5–8 target visitors to use their own phones. Observe these tasks before asking what they would change. No real-user study or preference percentages were produced here. More sections or animation are not justified by this review.

## Re-running locally

Use supported Node 24.8+ (or supported Node 22), then:

```sh
npm install
npx @e2e-dev/web install chromium
npm run build
```

Start a dedicated server in one terminal:

```sh
env -u GOOGLE_SHEETS_WEB_APP_URL -u GOOGLE_SHEETS_WAITLIST_SECRET \
  PORT=3013 WAITLIST_DB_PATH=/tmp/spendy-e2e.sqlite npm start
```

In another terminal:

```sh
E2E_TELEMETRY_DISABLED=1 npm run test:e2e
```

Do not rebuild `dist/` during a run. Restart the dedicated server between full runs because the suite deliberately tests eight actual signup requests and the API rate limit is ten requests per fifteen minutes. Preserve the rate limit in application code.

The first run had two test-selector failures from using the desktop-only CTA on phones; the tests now follow the mobile menu. A later run saw one Privacy HTTP 400 while a concurrent build replaced served files; the final run uses stable files. Test artifacts are under the gitignored `.e2e/` directory.

## Final verification

- e2e run `01a1a0e0-c278-7921-8a8d-3ed171eacb2e`: 28/28 passed across four targets, 41.03 seconds.
- Production build passed; Vite reports the main JavaScript chunk exceeds its 500kB warning threshold.
- Six existing backend tests passed.
- New test/config TypeScript checking passed with strict mode and Node types.
- `git diff --check` passed.
- Existing Hero/AppShowcase copy changes were preserved. No production UI redesign, deployment, commit, or live subscriber writes were performed.

VERDICT: PASS
