# Spendy website

A React + TypeScript landing page for the Spendy iPhone app. Black and white, simple typography, practical app guides, and no pasted screenshots or website glass effects.

## Run it

Requires Node 22.13 or newer (SQLite is built into Node).

```sh
npm install
npm run dev
```

Open **http://127.0.0.1:5173**. This starts two processes:

- Vite serves React on port 5173.
- Express accepts waitlist requests on port 3001. Vite forwards `/api` requests to it.

```sh
npm run build       # TypeScript checks + production bundle
npm test            # Validation and database persistence tests
npm start           # Serve the built site + API on port 3001
npm run waitlist:export
```

The export is a private JSON file, `.data/waitlist-export.json`. No invitation emails are sent by this project.

## Where to start reading

See [LEARNING.md](./LEARNING.md) for a guided walkthrough.

```text
src/
  main.tsx                  React root, Redux Provider, BrowserRouter
  App.tsx                   Routes and page title/scroll effect
  components/
    Header.tsx              Shared navigation
    Footer.tsx              Shared footer
    Hero.tsx                Plain introduction and the original brand artwork
    Reveal.tsx              Small scroll-entry Motion component
    SetupVisual.tsx         Original budget, receipt, and Siri setup diagrams
    InsightsSection.tsx     Plain-language calculation explanations
    AppGuides.tsx           Transaction, budget, subscription and analytics guides
    EverydayTools.tsx       Receipt, widgets, and Siri feature walkthroughs
    WaitlistForm.tsx        Controlled fields + Redux async action
  pages/
    HomePage.tsx            Landing page sections
    UpdatesPage.tsx         Development notes
    PrivacyPage.tsx         Current privacy description
  data/
    appGuides.ts            Steps for using the app
    insightGuides.ts        How the insight calculations work
    appFeatures.ts          Widgets and registered Siri actions
    content.ts              Editable FAQ and update copy
  store/
    store.ts                Redux store and typed hooks
    waitlistSlice.ts         Async fetch + loading/success/error state
  styles.css                Plain responsive CSS
server/
  index.ts                  Express routes and production static hosting
  waitlist.ts               Validation and SQLite storage
  waitlist.test.ts          Meaningful storage/validation checks
scripts/
  export-waitlist.ts         Private export for future email integration
```

## Brand and product explanations

The only displayed image is the original Spendy character (`public/images/app-icon.png`). Feature screenshots and their renderer have been removed. The page explains the real app using short steps, worked examples, and expandable details.

Copy is checked against the native app’s budget editor, receipt scanner and amount parser, `InsightFactsExtractor`, `InsightComparison`, `BudgetPacingRule`, `CategoryTrendRule`, `InsightDecisionEngine`, and `HomeAttentionInsights`. Insights are deterministic and on-device. The optional Apple Intelligence receipt fallback is described separately.

SF Symbols are not bundled: Apple’s [Xcode licence, section 2.10](https://www.apple.com/legal/sla/docs/xcode.pdf) limits system-provided images to applications on Apple platforms. The cross-platform website uses text controls and native HTML disclosures, with no external icon library.

Social and support destinations in `data/links.ts` follow the native app. Development notes describe the current build, not a promised release date.

## Motion

`Reveal.tsx` gently introduces a section once. `useReducedMotion` and the CSS media query respect reduced-motion preferences. Scrolling and expandable explanations use native browser behaviour.

## Waitlist behaviour

The API validates email and explicit consent, normalises the address, deduplicates it, and saves signup/consent timestamps. It has a hidden bot field, a small request-body limit, and 10 requests per IP per 15 minutes. Database failure produces an error, not a success screen. Emails are never written to application logs or exposed by an API read endpoint.

Local development defaults to `.data/waitlist.sqlite`, ignored by Git. Production can instead save to the owner's private Google Sheet through a protected Apps Script web app. The Sheet is never linked from the public site and the Apps Script secret stays in server-side environment variables.

### Private Google Sheet setup

1. In the private **Spendy Waitlist** spreadsheet, open **Extensions → Apps Script**.
2. Replace the editor contents with `google-apps-script/Code.gs`, then save.
3. In **Project Settings → Script properties**, add `WAITLIST_SECRET` with a long random value.
4. Choose **Deploy → New deployment → Web app**. Set **Execute as** to yourself and access to **Anyone**. Copy the `/exec` URL.
5. In Vercel, add `GOOGLE_SHEETS_WEB_APP_URL` and `GOOGLE_SHEETS_WAITLIST_SECRET`. The secret must exactly match the script property.
6. Redeploy and submit one test address. The script creates a private `Waitlist` tab with email, signup time, consent time, and consent version. Duplicate addresses are not added twice.

Do not publish the Sheet or put the Apps Script URL or secret in Vite `VITE_` variables. To export later, use **File → Download → Comma Separated Values (.csv)** while viewing the `Waitlist` tab.

## Before public hosting

This is a local project; it has not been deployed.

1. Configure the private Google Sheet bridge above before enabling the public waitlist. Vercel deploys `api/waitlist.ts` as the server-side waitlist function.
2. Set `HOST` to your host's bind address (for example `0.0.0.0` in a container), `PORT`, and `WAITLIST_DB_PATH` on a persistent disk.
3. Configure HTTPS and, when behind a proxy, Express's `trust proxy` to the precise proxy topology so rate limiting uses the real client IP. Do not blindly set it to `true`.
4. Add your public contact/deletion-request address and a working unsubscribe process. Update the Privacy page to describe the actual host, retention, email provider, and process before collecting public signups.
5. Connect an email provider or import the private export when the beta is ready. Consent for beta/launch messages is stored; this site does not authenticate ownership of an email. Add double opt-in if required by the provider or chosen signup policy.
6. Confirm the beta requirements and product copy, review the artwork license for the intended use, and set absolute production Open Graph URLs/images.

Typography uses the platform’s system font; no Apple font or external font files are bundled.

## Design direction

The home page is a short interactive product story. Motion for React animates a finite ledger sequence, shared tab indicators, changing totals, comparison charts, and receipt and Siri examples. App guides, calculation rules, and access options stay available through keyboard-accessible tabs and expandable detail instead of several long sections. Insights examples explain spending, period comparisons, budget room, and renewal commitments, alongside the exact app surfaces where they appear. Siri exposes all eight registered shortcuts in a selector. All figures are labelled illustrative examples; the website does not capture audio or run app shortcuts. Reduced motion shows the final state immediately, and replay controls restart the finite demos. No new dependency, backend, or signup behaviour is introduced.

The supplied Thonik HTML reference informed the more spacious opening, lowercase lead headline, and direct links into Scanning, Shortcuts, and Insights. Its source, typeface, graphics, and scripts are not copied into this project. The In Development and Traffic references informed the typographic grid; Motion’s official layout, presence, and reduced-motion documentation informs the interactive transitions. Normal page scrolling is preserved.


## Shared privacy policy

The `/privacy` page now describes the current iOS app and this website, including receipt processing, Apple speech services, exchange-rate requests, widgets, local backups, and the waitlist. Its canonical content is `src/data/privacy-policy.json`.

Spendy Settings → Legal → Privacy Policy reads a bundled copy while no public policy URL is configured. The app uses an external website link once `privacyPolicyURL` is set to the published HTTPS `/privacy` page. The confirmed privacy and support inbox is `hello.pavanlabs@gmail.com`, under the Pavan Labs brand.

After editing the policy, sync the native resource before building the app:

```sh
node scripts/sync-privacy-policy.mjs '../SpendyIOS/Spendy/Resources/privacy-policy.json'
```

The site is still unpublished. The public URL, hosting details, and waitlist removal/unsubscribe process must be resolved before public collection. Configuring these fields does not deploy the site or update App Store Connect automatically.

The website footer and Settings → Legal also link directly to Apple’s standard app EULA at https://www.apple.com/legal/internet-services/itunes/dev/stdeula/. That link is for the App Store app; it is not a separate set of website terms. No App Store Connect licence settings were changed.
