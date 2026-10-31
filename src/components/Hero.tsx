import { lazy, Suspense } from "react";
import "./refracted-wordmark.css";
import { Reveal } from "./Reveal";
import { SpendyMascot } from "./SpendyMascot";

const RefractedWordmark = lazy(() =>
  import("./RefractedWordmark").then(module => ({ default: module.RefractedWordmark })),
);

export function Hero() {
  return (
    <>
      <Suspense fallback={
        <div className="refracted-wordmark">
          <div className="refracted-wordmark__canvas">
            <span className="refracted-wordmark__placeholder">SPENDY</span>
          </div>
        </div>
      }>
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
            Expenses, budgets, subscriptions, and helpful insights in one
            friendly iOS app. No bank login. Just a clearer way to stay on top
            of everyday money.
          </p>
          <div className="hero-actions">
            <a className="button" href="#guides">
              Get to know Spendy <span aria-hidden="true">↓</span>
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
      <nav className="start-links section" aria-label="Explore Spendy">
        {[
          {
            number: "01",
            title: "scan a receipt",
            text: "From a photo to a reviewed entry",
            href: "#receipt",
          },
          {
            number: "02",
            title: "take a shortcut",
            text: "Siri, voice, and eight quick actions",
            href: "#siri",
          },
          {
            number: "03",
            title: "understand your spending",
            text: "Helpful context from the entries you add",
            href: "#insights",
          },
        ].map((item) => (
          <a key={item.href} href={item.href}>
            <span className="start-link-number">{item.number}</span>
            <span className="start-link-arrow" aria-hidden="true">
              ↗
            </span>
            <strong>{item.title}</strong>
            <span className="start-link-description">{item.text}</span>
          </a>
        ))}
      </nav>
    </>
  );
}
