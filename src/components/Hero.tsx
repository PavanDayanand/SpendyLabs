import { motion } from "motion/react";
import { useSiteReducedMotion } from "../AnimationPreferences";
import { ArrowDown } from "lucide-react";
import { RefractedWordmark } from "./RefractedWordmark";
import "./refracted-wordmark.css";
import { SoftText } from "./SoftText";
import { Reveal } from "./Reveal";
import { SpendyMascot } from "./SpendyMascot";

export function Hero() {
  const reduce = useSiteReducedMotion();
  return (
    <>
      <RefractedWordmark />
      <section className="hero section">
        <Reveal className="hero-copy">
          <p className="hero-identity-note">Spendy for iOS. In development.</p>
          <h1 className="hero-gradient-title">
            <SoftText text="Your money," />
            <br />
            <SoftText text="a little clearer." />
          </h1>
          <p className="hero-description">
            Know what you’ve spent, what’s left in your budget, and what renews next. Privately on your iPhone.
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
