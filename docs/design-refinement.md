# Spendy design refinement

This pass applies Hallmark and better-typography within the existing monochrome design. It keeps the approved brand wordmark, mascot, floating islands, real screenshots, routes, signup API and ticket. No new product claims, screenshots, testimonials or metrics were introduced.

## Changes

- Shared type and spacing tokens in `src/tokens.css`; refinements in `src/design-refinements.css`.
- The original system font stays. Body and supporting text have more consistent sizes, readable line heights, deliberate wrapping and untracked labels.
- The compact brand stage leaves the headline, description and main action visible at 1280 × 800.
- Repeated section labels were replaced with direct headings: Inside Spendy, Spending insights, Siri and Shortcuts, See Spendy in action, and Join the Spendy waitlist.
- Insights and Shortcuts retain their shared desktop row, with less surrounding surface treatment and larger captures.
- Inputs use 16px text to avoid iOS Safari form zoom.
- The reduced-motion trailer shows the real existing video's poster and one YouTube action.
- Mobile hero facts have a deliberate three-row arrangement.
- The honeypot no longer extends off-screen. Its field and signup behavior remain unchanged.
- FAQ transitions use opacity and position rather than animated height.
- Local `.hallmark/` render artifacts are gitignored.

## Verification

- Production build and `git diff --check` pass.
- Twelve typography/layout cases across 320, 390, 768, 1280, 1440 and 1920px in both themes. Checked first-screen CTA placement, image switching, input sizing, horizontal fit and enlarged text.
- Six menu/FAQ/motion cases and six ticket cases pass. Signup responses were mocked; no test emails were added.
- Hallmark rendered five reference screenshots. The final scoped static audit reports 0 FAIL and 2 WARN. Both warnings assume the first image in a component is the page LCP; the gallery and trailer are below the hero, so they intentionally remain lazy-loaded.
- Fresh-context visual review identified three defects: empty paused trailer, repeated trailer action and awkward mobile proof-point wrapping. All three were fixed and visually confirmed.

This was a polish of active page surfaces, not a certification of every legacy component or third-party shader in the repository. No deployment or commit was performed.
