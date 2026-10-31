# Spendy waitlist handoff

This file explains the complete waitlist setup in simple language. It is safe to keep in GitHub because it does not contain the private Google Sheet link or the shared secret.

## Current status

- Website: https://spendy-ebon.vercel.app/
- GitHub repository: https://github.com/PavanDayanand/SpendyLabs
- Production branch: `main`
- Hosting: Vercel
- Storage: a private Google Sheet owned by Pavan Labs
- Status: the production waitlist is working

When somebody enters an email, accepts the consent checkbox, and submits the form, the website sends the request to `/api/waitlist`. The Vercel server checks the request and then sends the email to the private Google Apps Script. Apps Script adds it to the private Sheet.

```text
Website form
    ↓
Vercel /api/waitlist
    ↓
Google Apps Script web app
    ↓
Private Google Sheet → Waitlist tab
```

The Google Sheet is not shown to website visitors.

## Correct project folder

The website project is:

```text
/Users/pavand/work/My Projects/SpendyWebsite
```

Do not make these website changes inside the iOS project or the older website folder:

```text
/Users/pavand/work/My Projects/SpendyIOS
/Users/pavand/work/My Projects/Spendy/website
```

Important waitlist files:

```text
api/waitlist.ts                       Production Vercel API
google-apps-script/Code.gs            Code pasted into Google Apps Script
src/components/WaitlistForm.tsx       Website form
src/store/waitlistSlice.ts             Browser request and form state
server/googleSheetsWaitlist.ts        Google Sheets helper and tests
server/vercelWaitlist.test.ts          Vercel route tests
```

## What was set up

### 1. Private Google Sheet

A private Google Sheet was prepared with a tab named `Waitlist`.

It stores four columns:

| Column | Meaning |
| --- | --- |
| Email | Normalised visitor email address |
| Joined at (UTC) | Time the signup was saved |
| Consent at (UTC) | Time the visitor agreed to receive emails |
| Consent version | Version of the consent text used by the website |

The Sheet remains private. Share it only with people who are allowed to manage customer email addresses.

### 2. Google Apps Script

The code in `google-apps-script/Code.gs` was pasted into an Apps Script project named **Spendy Waitlist**.

The script:

- checks the shared secret;
- validates the email again;
- prevents duplicate email rows;
- safely handles simultaneous signups;
- writes the timestamps and consent version;
- protects the Sheet from formula injection.

Apps Script project settings contain this script property:

```text
Property: WAITLIST_SECRET
Value: <PRIVATE_SHARED_SECRET>
```

The Apps Script deployment is a **Web app** with these settings:

```text
Execute as: Me
Who has access: Anyone
```

Its `/exec` URL is private configuration. Do not put it in frontend code or public documentation.

### 3. Vercel environment variables

The Vercel project contains these server-side variables:

```text
GOOGLE_SHEETS_WEB_APP_URL=<PRIVATE_APPS_SCRIPT_EXEC_URL>
GOOGLE_SHEETS_WAITLIST_SECRET=<PRIVATE_SHARED_SECRET>
```

Both variables are enabled for:

- Production
- Preview
- Development

`GOOGLE_SHEETS_WAITLIST_SECRET` must exactly match Apps Script's `WAITLIST_SECRET`. Use only the raw value: no quotation marks, no spaces, and no `KEY=` prefix.

Never rename either variable with a `VITE_` prefix. Vite variables are included in browser code and would expose the secret.

After changing a Vercel variable, redeploy the latest deployment. Existing deployments continue using their old environment values.

### 4. Vercel API

`api/waitlist.ts` is the production serverless route. It uses Vercel's Web Standard export:

```ts
export default { fetch: handler };
```

The API:

- accepts only `POST` requests;
- validates email and explicit consent;
- rejects the hidden bot field;
- limits the request body size;
- rate-limits repeated attempts;
- keeps Google configuration on the server;
- sends a generic error instead of exposing private details.

## How deployment works

GitHub is connected to Vercel. A push to `main` automatically starts a production deployment.

```sh
cd "/Users/pavand/work/My Projects/SpendyWebsite"
npm test
npm run build
git add <only-the-files-you-changed>
git commit -m "Describe the change"
git push origin main
```

Wait for the new Vercel deployment to show **Ready** and **Production**.

Do not manually upload the `dist` folder. Vercel runs the build from GitHub. Do not commit `dist`, `.env.local`, database files, exports, or secrets.

## Local development

Requirements: Node.js 22.13 or newer.

```sh
cd "/Users/pavand/work/My Projects/SpendyWebsite"
npm install
npm run dev
```

Open http://127.0.0.1:5173.

Before pushing changes:

```sh
npm test
npm run build
```

The local Express setup can use SQLite. Production uses the private Google Sheet through the Vercel function.

## Testing the live waitlist

1. Open https://spendy-ebon.vercel.app/.
2. Enter a real email address.
3. Select the consent checkbox.
4. Submit the form.
5. Confirm the website shows success.
6. Open the private Sheet and confirm one row was added to `Waitlist`.
7. Submit the same email again and confirm a duplicate row is not added.

Do not use another person's email for testing without their permission. Remove temporary test rows after checking them.

## Common errors

### `404 NOT_FOUND` for `/api/waitlist`

The Vercel function was not included in the deployment or Vercel was deploying the wrong project/root. Confirm `api/waitlist.ts` is in the repository root and redeploy from GitHub.

### `FUNCTION_INVOCATION_FAILED`

The function export or a server import crashed. Keep the self-contained Web Standard handler and this export:

```ts
export default { fetch: handler };
```

### `503 Could not save your signup`

Check all of these:

1. `GOOGLE_SHEETS_WEB_APP_URL` contains the Apps Script `/exec` URL.
2. Vercel's `GOOGLE_SHEETS_WAITLIST_SECRET` exactly matches Apps Script's `WAITLIST_SECRET`.
3. The variables are enabled for Production.
4. Vercel was redeployed after changing its variables.
5. Apps Script is deployed as a Web app, runs as the owner, and allows `Anyone`.

### Google says “Unable to open the file at present”

Check the Apps Script deployment and account permissions. Do not use the Apps Script editor URL as the environment value; use the Web app URL ending in `/exec`.

### Environment variable changed but production still fails

Go to **Vercel → Deployments → latest deployment → ⋯ → Redeploy**. Wait until it is marked **Ready** and **Production**.

## What to share with another developer

Share only what they need:

- GitHub repository access;
- Vercel project access;
- the correct local folder name, `SpendyWebsite`;
- this handoff file;
- Google Sheet editor access only if they manage waitlist data;
- Apps Script editor access only if they maintain the integration.

Share the private Sheet URL, Apps Script `/exec` URL, and shared secret through a secure password manager or another private channel. Do not send them in a public issue, commit, screenshot, or chat room.

Never share or commit:

- `.env.local`;
- `WAITLIST_SECRET` or `GOOGLE_SHEETS_WAITLIST_SECRET` values;
- waitlist exports containing customer emails;
- downloaded CSV files containing customer emails;
- Vercel, Google, GitHub, or ElevenLabs tokens.

When somebody no longer needs access, remove them from GitHub, Vercel, the Google Sheet, and Apps Script. Rotate the waitlist secret if it may have been exposed.

## Sending emails later

The current website collects consented email addresses but does not send email automatically.

When the beta is ready:

1. Open the private `Waitlist` tab.
2. Download it as CSV or import the addresses into the chosen email provider.
3. Send only the emails users agreed to receive.
4. Provide a clear unsubscribe option and a way to request deletion.
5. Keep the privacy page accurate when the email provider or retention policy changes.

## Safe secret rotation

If the secret must be changed:

1. Generate a new value locally:

   ```sh
   openssl rand -hex 32 | pbcopy
   ```

2. Paste it into Apps Script's `WAITLIST_SECRET` property.
3. Paste the exact same value into Vercel's `GOOGLE_SHEETS_WAITLIST_SECRET` for all three environments.
4. Redeploy Vercel.
5. Test one signup and confirm the Sheet receives it.

Do not write the generated value in this file.
