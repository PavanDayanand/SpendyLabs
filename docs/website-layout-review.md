# Compact showcase review

## What changed

Insights and Shortcuts share a row above 700px, and stack below it. Insights is removed from the fan so its screenshot appears once. The three large Siri phrase blocks are removed. A two-button preview switch shows either the supplied iPhone expense confirmation or the theme-matched Apple Shortcuts actions. Hover gently lifts screenshots; keyboard focus is visible. Reduced motion disables those transitions.

## Verification

- Production build passed.
- Twelve actual Chrome browser cases: 320, 390, 700, 701, 1024 and 1440px, in both light and dark mode. Checked no horizontal overflow, one Insights image, desktop row alignment and keyboard activation of the preview switch.
- `node scripts/check-showcase-layout.mjs` ran 100,000 seeded synthetic layout scenarios with no failed modeled constraints. This is a mathematical width model, not 100,000 people or browser sessions. It cannot establish desirability, conversion, comprehension, text wrapping or accessibility.

## Design judgment, not user findings

The current direction prioritizes authentic app evidence, brief explanations and a visible route to the waitlist. Repeated screenshots, large command lists and separate widget panels add length without adding much evidence. These decisions follow the user's feedback; no preference percentages are claimed.

To learn what visitors actually want, observe a few people trying to explain the product and find the waitlist, then ask what was unclear. With consent and an agreed measurement setup, compare guide engagement and waitlist completion across the old and compact layouts. No tracking or external user study was installed as part of this change.
