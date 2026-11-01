# App screenshot showcase

`src/components/AppShowcase.tsx` keeps screenshots in plain arrays and renders them with `map`. It has no dialog, zoom state, store or async calls. The existing reduced-motion hook selects a static gallery when motion is disabled.

The installed ReactDrops Fan Gallery retains spring entrances, hover fitting, keyboard controls and responsive layout. Its card aspect ratio now matches the actual 402 × 874 screenshots. There is no blurred duplicate or padded backdrop around a card.

`src/useMediaProtection.ts` prevents media context menus and dragging across routes. CSS suppresses the iOS image-save callout. Ordinary text selection and text context menus still work. These measures deter casual saving; publicly displayed media remains obtainable through browser tools, direct asset URLs or screen capture.

## Real captures

The original PNGs in `public/images/app/` are unretouched simulator captures. `home-widget-crop.png` and `lock-widget-crop.png` are crops of those originals, showing only Quick Actions and the installed rectangular and circular Lock Screen widgets. The rectangular widget uses a compact Month label and scales its text to avoid truncation; the Lock Screen was recaptured after that native fix. The Insights capture shows the initial sheet opened from Home, without dragging it upward. The app screens use an isolated temporary ledger with synthetic purchases, accounts and subscriptions.

- `home-widgets.png` shows the real medium Quick Actions widget installed through SpringBoard's widget picker on an iPhone 17 Simulator Home Screen.
- `lock-widgets.png` shows the real circular and rectangular Spendy widgets installed and saved through the system Lock Screen editor.
- `shortcuts.png` shows all eight registered actions in the native Apple Shortcuts app.
- `siri-request.png` shows a real Siri request in the simulator. It is a request capture, not proof of a completed Siri response.
- The remaining images show actual Home, Analytics, Subscriptions, add-entry and spending-insights screens.

The earlier custom widget preview host and its image were removed. Home and Lock Screen images are actual system screenshots, not constructed previews.

## Recapture

First install Spendy's medium Quick Actions widget on the simulator Home Screen, and its circular and rectangular widgets on the Lock Screen. Use a simulator build signed ad hoc (`CODE_SIGNING_ALLOWED=YES CODE_SIGN_IDENTITY=-`); disabling signing prevents the existing App Group entitlements from sharing the sample ledger with the widget extension.

The debug-only `SPENDY_CAPTURE_SYSTEM_WIDGET_DATA=1` app environment publishes the isolated screenshot ledger through the existing widget data manager and requests real WidgetKit timeline reloads. It does not create a preview UI.

The `WebsiteSystemCaptureUITests` helper is opt-in and skipped by normal test runs. From the SpendyIOS checkout:

```sh
TEST_RUNNER_SPENDY_CAPTURE_SYSTEM_UI=1 xcodebuild test \
  -project Spendy.xcodeproj -scheme Spendy \
  -destination 'platform=iOS Simulator,name=iPhone 17' \
  -only-testing:SpendyUITests/WebsiteSystemCaptureUITests \
  -resultBundlePath /tmp/SpendySystemScreens.xcresult \
  CODE_SIGNING_ALLOWED=YES CODE_SIGN_IDENTITY=-
```

Export attachments with `xcrun xcresulttool export attachments --path <result.xcresult> --output-path <directory>`. Review every image before replacing website assets. Siri request capture does not assert successful intent execution.

Use `WebsiteScreenshotUITests` for ordinary app screens. Automatic light/dark screenshot switching remains deferred.

## Light and dark mode

`src/Theme.tsx` shares a small React state through context. It starts from the saved `spendy-theme` preference or the device color scheme. The header button saves an explicit choice. Until that choice is made, device preference changes update the page. Storage is optional: switching still works if browser storage is blocked.

`src/theme.css` supplies dark palette variables for text, surfaces, fields and borders. `index.html` sets the initial theme before paint. The brand animation retains its existing dark presentation.

`themedScreenshot()` selects the original PNG in light mode and the `-dark.png` sibling in dark mode. Gallery, Insights, installed widget crops, Siri request and Apple Shortcuts all have real dark simulator captures. Images are not inverted or recolored. Screenshot captions reflect the selected theme. The Siri capture demonstrates a submitted request, not a completed expense.

To recapture the app in dark mode, set `TEST_RUNNER_SPENDY_CAPTURE_APPEARANCE=dark` when running the screenshot tests. XCTest exposes this as `SPENDY_CAPTURE_APPEARANCE` inside the runner. Set Simulator appearance to dark with `simctl ui <device> appearance dark` for system surfaces. Use the same crop coordinates as the light originals for the widget variants.


## User-provided iPhone capture

The Siri/Shortcuts example now uses `shortcut-logged-iphone.png`, copied from the supplied `IMG_1637.PNG`. It shows the real Groceries expense confirmation on the user's iPhone. CSS clips the lower wallpaper and dock, without changing the screenshot pixels. This supplied dark capture stays authentic in both website themes; no light variant was supplied. Apple Shortcuts and the other app screenshots still follow the theme. The Lock Screen widget display has been removed from the website. The other two supplied images were not needed for this compact section.

The separate Home Screen widget panel was also removed to reduce repetition and page height. Widgets remain visible in the supplied iPhone shortcut capture. The remaining Insights panel uses a compact side-by-side layout on desktop.
