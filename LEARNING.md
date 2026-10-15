# Learn React with this website

Read one small piece at a time. The page uses ordinary HTML, CSS, and a few React hooks.

## 1. Start at the entry point

`src/main.tsx` mounts React, adds the Redux Provider, and enables BrowserRouter. `src/App.tsx` chooses the page for the current URL. Read Header and Footer next: each component is a function returning JSX.

## 2. Data becomes a guide

`data/appGuides.ts` holds each guide’s name, description, steps, and note. `AppGuides.tsx` uses `.map()` to create the buttons and numbered steps. Each item has a stable `key` so React can identify it.

```tsx
const [selected, setSelected] = useState(0);
const guide = appGuides[selected];
```

Clicking a button calls `setSelected`. React renders the selected guide again. `aria-pressed` tells assistive technology which button is selected. No extra state library is needed for this local choice.

Try changing one budget step in the data file, then check the page.

## 3. The browser handles disclosures

Insights, widgets, Siri actions, and FAQs use `<details>` and `<summary>`. These elements already support opening, closing, and keyboard input. React only supplies their content. `data/insightGuides.ts` keeps the explanations together so they are easy to maintain.

## 4. Controlled form inputs

In `WaitlistForm.tsx`, the email’s `value` comes from state. `onChange` updates it. Consent works the same way. `preventDefault()` stops a form submission from reloading the page.

The browser checks the email and required consent. The server checks them again because client-side validation can be bypassed.

## 5. Async state with Redux

`waitlistSlice.ts` uses `fetch` and `await` to submit the form. Redux Toolkit tracks idle, loading, success, or error. `useAppDispatch` sends an action; `useAppSelector` reads the result. The site shows success only after the API succeeds.

This is a learning example of shared async state. The app guide’s selected button stays in local React state.

## 6. Routes and effects

`Link` changes pages without reloading the whole site. A plain `<a>` scrolls to a section. `App.tsx` uses `useEffect` to update the document title and scroll position when the route changes.

Try visiting `/privacy` directly and refreshing. The production server serves `index.html` for page routes.

## 7. Simple responsive CSS

`styles.css` starts with the neutral colour variables. Grid makes the two-column layouts. Media queries put them into one column on small screens. The logo keeps its original colours.

`:focus-visible` shows keyboard focus. `details[open]` styles an expanded explanation. No screenshot renderer, custom icon library, or Apple font files are needed.

## 8. One reusable animation

`Reveal.tsx` wraps content in `motion.div`. Its starting opacity and position change when it enters view. `useReducedMotion` respects the visitor’s accessibility preference. Guide switches and disclosures use ordinary React and browser behaviour.

## 9. The server

Express handles `/api` requests. `waitlist.ts` validates data and saves it in SQLite. A parameterised SQL statement keeps user input separate from SQL code. The database is private and ignored by Git.

Run `npm run build` for TypeScript and production checks, and `npm test` for validation and persistence tests.

## Small exercises

1. Edit the introductory text in `Hero.tsx`.
2. Add a FAQ in `data/content.ts`.
3. Change a guide’s steps in `data/appGuides.ts` and watch `.map()` render them.
4. Add a page route in `App.tsx` and test a direct refresh.
5. Read an API error path and follow how it reaches the form.

Official references: [React](https://react.dev/learn), [TypeScript](https://www.typescriptlang.org/docs/handbook/intro.html), [Redux Toolkit](https://redux-toolkit.js.org/usage/usage-with-typescript).

## 10. Graphics made from code

`SetupVisual.tsx` uses ordinary HTML for a budget bar, numbered flow, receipt example, and Siri waveform. CSS supplies lines, spacing, and neutral fills. The examples are labelled and use sample values. They are explanations, not screenshots or live financial records.

The waveform repeats a small animation and stops when reduced motion is requested. Widget action links point to the matching website guides. Try changing a diagram label, then inspect how the mobile media query rearranges it.
