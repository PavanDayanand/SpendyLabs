import { Reveal } from "./Reveal";
import { LedgerDemo } from "./LedgerDemo";

export function Hero() {
  return (
    <>
      <section className="hero section">
        <Reveal className="hero-copy">
          <div className="hero-identity">
            <img
              src="/images/app-icon.png"
              alt="Spendy’s coffee character"
              width="112"
              height="128"
            />
            <div>
              <p className="eyebrow">SPENDY FOR IPHONE</p>
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
            Scan a receipt. Log an expense. See where your money goes. A minimal
            iPhone app that keeps everyday money simple.
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
            <span>Budgets &amp; renewals</span>
            <span>No bank login</span>
            <span>Siri shortcuts</span>
          </div>
        </Reveal>
        <LedgerDemo />
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
            text: "The numbers and how we read them",
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
