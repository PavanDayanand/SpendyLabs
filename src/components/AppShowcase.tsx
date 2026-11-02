import { ScrollSection } from "./ScrollSection";
import { AnimatePresence, motion } from "motion/react";
import { MotionSwitch } from "./MotionSwitch";
import { useState } from "react";
import { FanGallery, type FanGalleryItem } from "./fan-gallery";
import { useSiteReducedMotion } from "../AnimationPreferences";
import "./app-showcase.css";
import { themedScreenshot, useTheme } from "../Theme";

// These are real simulator captures, using a separate synthetic ledger.
const screenshots: FanGalleryItem[] = [
  {
    src: "/images/app/subscriptions.png",
    alt: "Spendy subscriptions with upcoming Music, Cloud storage and Film club renewals",
  },
  {
    src: "/images/app/analytics.png",
    alt: "Spendy Analytics with spending trends and category breakdowns",
  },
  {
    src: "/images/app/home.png",
    alt: "Spendy Home with spending summary and recent entries",
  },
  { src: "/images/app/entry.png", alt: "The native Spendy add-entry screen" },
];

const insightScreenshot: FanGalleryItem = {
  src: "/images/app/insights.png",
  alt: "Spendy Insights sheet with spending patterns and upcoming renewals",
};
const shortcutsScreenshot: FanGalleryItem = {
  src: "/images/app/shortcuts.png",
  alt: "Spendy's eight registered actions in Apple's Shortcuts app",
};

export function AppShowcase() {
  const reduceMotion = useSiteReducedMotion();
  const { theme } = useTheme();
  const [shortcutView, setShortcutView] = useState<"result" | "actions">("result");
  const gallery = screenshots.map((image) => ({
    ...image,
    src: themedScreenshot(image.src, theme),
    alt: `${image.alt}, ${theme} mode`,
  }));

  return (
    <ScrollSection
      className="app-showcase section"
      id="guides"
      aria-labelledby="app-showcase-title"
    >
      <div className="showcase-heading">
        <p className="eyebrow">A little look inside</p>
        <h2 id="app-showcase-title">
          Meet Spendy.
          <br />
          <span className="muted">From the inside.</span>
        </h2>
        <p>Your entries. Your patterns. A little more clarity.</p>
      </div>
      {reduceMotion ? (
        <div className="screenshot-static-gallery">
          {gallery.map((image) => (
            <figure key={image.src}>
              <img src={image.src} alt={image.alt} loading="lazy" />
            </figure>
          ))}
        </div>
      ) : (
        <FanGallery
          items={gallery}
          cardWidth={162}
          aspectRatio={402 / 874}
          spacing={0.69}
          curve={0.14}
          tilt={14.5}
          lift={42}
          spread={0.2}
          stackFrom="left"
          speed={0.7}
          stagger={0.09}
          bounce={0.35}
          hoverSpeed={0.28}
          radius={18}
          entrance="stack"
          trigger="scroll"
          viewportStart={75}
          once={true}
          showTitle={false}
          ariaLabel="Real Spendy app screenshots"
          className="spendy-screenshot-fan"
        />
      )}
      <p className="showcase-caption">
        A few screens from Spendy in {theme} mode.
        <br />
        Real captures. Sample entries.
      </p>
      <div className="screenshot-features">
        <article id="insights">
          <div className="screenshot-feature-copy">
            <p className="eyebrow">Spending insights</p>
            <h3>A little perspective.</h3>
            <p>Patterns and upcoming renewals, from your own entries.</p>
          </div>
          <figure className="screenshot-frame">
            <img
              src={themedScreenshot(insightScreenshot.src, theme)}
              alt={insightScreenshot.alt}
              loading="lazy"
              width="402"
              height="874"
            />
          </figure>
        </article>
      <article className="shortcuts-peek" id="siri">
        <div className="shortcuts-copy">
          <p className="eyebrow">Siri & Shortcuts</p>
          <h3>
            A few words.
            <br />A little less tapping.
          </h3>
          <p>Add an expense, scan a receipt, or check your spending.</p>
        </div>
        <div className="shortcut-view-switch">
          <MotionSwitch value={shortcutView} label="Shortcut preview"
            options={[{ value: "result", label: "On iPhone" }, { value: "actions", label: "Available actions" }]}
            onChange={(value) => setShortcutView(value as "result" | "actions")} />
        </div>
        <div className="shortcuts-screen">
          <AnimatePresence mode="wait" initial={false}>
          <motion.div className="shortcuts-system-images" key={shortcutView}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduceMotion ? 0 : -6 }} transition={{ duration: reduceMotion ? 0 : .16 }}>
            {shortcutView === "result" ? <figure className="siri-system-frame iphone-shortcut-capture">
              <div className="iphone-shortcut-crop">
              <img
                src="/images/app/shortcut-logged-iphone.png"
                alt="Spendy shortcut on iPhone confirming a Groceries expense was logged"
                loading="lazy"
                width="1206"
                height="2622"
              />
              </div>
              <figcaption>Expense logged on iPhone</figcaption>
            </figure>
            : <figure className="screenshot-frame">
              <img
                src={themedScreenshot(shortcutsScreenshot.src, theme)}
                alt={shortcutsScreenshot.alt}
                loading="lazy"
                width="402"
                height="874"
              />
            </figure>}
          </motion.div>
          </AnimatePresence>
        </div>
      </article>
      </div>
    </ScrollSection>
  );
}
