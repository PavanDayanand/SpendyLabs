# App screenshot showcase

`src/components/AppShowcase.tsx` owns the homepage showcase. The screenshot list is plain data; change its paths and descriptions to change the gallery. The Fan Gallery props match the requested ReactDrops configuration.

The only React state is `selectedImage`: `null` means the preview is closed, and an image means it is open. A ref points to the native `<dialog>`. A small effect opens or closes it after state changes. The browser handles keyboard focus and Escape. No store, routing layer or async request is needed for this interaction.

The six `fan-*` / `viewport-playback` files are installed ReactDrops component internals. Keep their spring, layout, keyboard and playback behavior together. The only integration addition is an optional `onSelect` callback on a card button. Site-specific styling stays in `app-showcase.css`.

## Image source

The PNG files in `public/images/app/` are unretouched iPhone 17 simulator captures of the native Spendy app. They use the debug-only `website-screenshots` fixture in the SpendyIOS checkout, which creates an isolated temporary ledger with synthetic purchases, accounts and subscriptions. The five images show Home (light and dark), Analytics, Subscriptions and adding an entry. The website labels the images as development screenshots with sample data.

To recapture from the SpendyIOS checkout, run `WebsiteScreenshotUITests/testCaptureWebsiteScreens` and `WebsiteScreenshotUITests/testCaptureCompletedMonth` on an available iPhone simulator. Export their attachments with `xcrun xcresulttool export attachments --path <result.xcresult> --output-path <directory>`. Use the completed-month Analytics attachment for `analytics.png`.

The gallery preserves the full screenshot inside each card rather than cropping it. Selecting a card opens a larger version. With reduced motion or the site's pause control enabled, a static horizontal screenshot list replaces the fan.

The homepage no longer mounts the extended AppGuides, SpendingStory, InsightsSection or EverydayTools tours. Their source remains available for future use.
