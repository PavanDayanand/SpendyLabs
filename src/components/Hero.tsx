import { lazy, Suspense } from "react";
import "./refracted-wordmark.css";
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
              <p className="hero-identity-note">
                Minimal by design.
                <br />
                Easy for the everyday.
              </p>
            </div>
          </div>
          <h1>
            your money.
            <br />
            <span className="muted">a little clearer.</span>
          </h1>
          <p className="hero-description">
            A private place for everyday spending. Made for iPhone. No bank
            login.
          </p>
          <div className="hero-actions">
            <a className="button" href="#guides">
              Take a look <span aria-hidden="true">↓</span>
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
