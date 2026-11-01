# App screenshot showcase

`src/components/AppShowcase.tsx` keeps the app screenshots in a plain array. The ReactDrops Fan Gallery preserves spring entrances, responsive fitting and keyboard controls. Reduced motion uses a static gallery. No screenshot zoom is enabled.

## Active images

`public/images/app/` contains Home, Analytics, Subscriptions, add-entry, Insights and Apple Shortcuts captures, plus their `-dark.png` variants. The app captures use an isolated synthetic ledger. Insights shows the sheet at its initial height when opened from Home.

`shortcut-logged-iphone.png` is the supplied `IMG_1637.PNG`: a real iPhone shortcut expense confirmation. CSS clips the lower wallpaper and dock without modifying the pixels. This supplied image stays unchanged across themes; the other app screenshots switch with the theme.

Insights appears once, outside the fan. Shortcuts has an On iPhone / Available actions selector. Separate Home and Lock Screen widget sections were removed, and their unused captures and crops have been removed from public assets. The replaced simulator Siri request captures were also removed.

## Theme and media behavior

`src/Theme.tsx` shares theme state through React context. The site follows the device preference until a manual choice is saved. `themedScreenshot()` selects the `-dark.png` sibling in dark mode. `index.html` sets the theme before paint.

`src/useMediaProtection.ts` prevents media context menus and dragging. CSS suppresses the iOS image-save callout. These measures deter casual saving; publicly rendered media remains obtainable through browser tools, direct URLs or screenshots.

## Recapture

The native checkout's `WebsiteScreenshotUITests` captures ordinary app screens. Set `TEST_RUNNER_SPENDY_CAPTURE_APPEARANCE=dark` for dark app variants; XCTest exposes this as `SPENDY_CAPTURE_APPEARANCE` in the runner. Set the simulator's system appearance with `simctl ui <device> appearance dark` for Apple Shortcuts.

Use a signed simulator build when capturing real installed widgets. Review exported screenshots before adding assets, and keep only captures that are used by the website.
