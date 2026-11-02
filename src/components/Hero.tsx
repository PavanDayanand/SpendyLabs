import { motion } from "motion/react";
import { useSiteReducedMotion } from "../AnimationPreferences";
import { ArrowDown } from "lucide-react";
import { lazy, Suspense } from "react";
import "./refracted-wordmark.css";
import { SoftText } from "./SoftText";
import { Reveal } from "./Reveal";
import { SpendyMascot } from "./SpendyMascot";

const RefractedWordmark = lazy(() =>
  import("./RefractedWordmark").then((module) => ({
    default: module.RefractedWordmark,
  })),
);

export function Hero() {
  const reduce = useSiteReducedMotion();
  return (
    <>
      <Suspense
        fallback={
          <div className="refracted-wordmark" aria-hidden="true">
            <div className="refracted-wordmark__canvas">
              <div className="refracted-wordmark__placeholder" />
            </div>
          </div>
        }
      >
        <RefractedWordmark />
      </Suspense>
      <section className="hero section">
        <Reveal className="hero-copy">
          <div className="hero-identity">
            <div>
              <p className="eyebrow">Spendy for iOS</p>
              <p className="beta-banner">
                <span className="beta-banner-dot" aria-hidden="true" />
                In development
              </p>
            </div>
          </div>
          <h1>
            <SoftText text="your money." />
            <br />
            <SoftText text="a little clearer." className="muted" />
          </h1>
          <p className="hero-description">
            Track spending, budgets, and subscriptions in one private iPhone app.
            No bank login.
          </p>
          <div className="hero-actions">
            <motion.a whileHover={reduce ? undefined : { y: -2 }} whileTap={reduce ? undefined : { scale: .97 }} className="button" href="#guides">
              Take a look <ArrowDown size={17} aria-hidden="true" />
            </motion.a>
          </div>
          <div className="hero-notes">
            <span>Everyday essentials stay free</span>
            <span>No bank login</span>
            <span>Siri shortcuts</span>
          </div>
        </Reveal>
        <Reveal className="hero-mascot">
          <SpendyMascot />
          <p className="hero-mascot-hint">Tap for a coffee break.</p>
        </Reveal>
      </section>
    </>
  );
}
