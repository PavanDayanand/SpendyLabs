# Website review and next validation

Reviewed on 3 November 2026. This is an engineering review, not a study of real users.

## Implemented

The hero now explains the practical outcome: know what you spent, what remains in your budget, and what renews next. The gallery introduction names spending, budgets, and subscriptions together. No sections were added.

## Verification

- Production build and all six existing backend tests passed.
- Chromium at 390px and 1440px: actual local signup saved into an isolated temporary SQLite database; repeat signup succeeded without adding a second record for the same email.
- Ticket displayed the submitted email, supported keyboard tearing, button dismissal and Escape.
- Simulated HTTP 503 showed an error without a success ticket, retained the email, and allowed a successful retry.
- No browser runtime errors or horizontal overflow during these flows.
- These checks do not establish deployed Google Sheets persistence or real-device performance.

## Budget capture still needed

Replace the add-entry gallery screen with a genuine budget capture, in both light and dark mode. Keep the gallery at four screens. No existing budget asset was found. The installed simulator runtime is unavailable, so no mock or mislabeled screenshot was added.

## Real-user sessions

Recruit 5–8 people who track their spending, including students, privacy-conscious users and people new to budgeting. Let them use their own phone. Do not explain the product first.

Ask each participant to:

1. Look at the first screen, then explain what Spendy does and who it is for.
2. Find how it helps with budgets and upcoming subscriptions.
3. Explain whether it connects to a bank and where records are stored.
4. Find Siri actions and describe a use they would have for them.
5. Join the waitlist using a designated test environment, then close the ticket.

Record completion, hesitation, misunderstood claims, and exact comments. Ask what information was missing and which section they would remove. Do not infer preference from synthetic viewport tests or invent participant counts.

Before deployment acceptance, verify one designated test signup through the deployed endpoint into its actual storage, repeat it to check deduplication, and confirm failure behavior. No real subscriber data should be altered during testing.
