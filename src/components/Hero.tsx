import { ArrowUpRight, ArrowDown } from "lucide-react";
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
              <p className="eyebrow">SPENDY FOR iOS</p>
              <a className="beta-banner" href="#waitlist">
                <span className="beta-banner-dot" aria-hidden="true" />
                In development · Join the waitlist
                <ArrowUpRight className="beta-banner-arrow" size={14} aria-hidden="true" />
              </a>
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
            <a className="button" href="#guides">
              Take a look <ArrowDown size={17} aria-hidden="true" />
            </a>
            <a className="text-link" href="#waitlist">
              Join the waitlist
            </a>
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
