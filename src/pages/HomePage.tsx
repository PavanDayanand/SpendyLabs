import { Link } from "react-router-dom";
import { Hero } from "../components/Hero";
import { TrailerSection } from "../components/TrailerSection";
import { SpendingStory } from "../components/SpendingStory";
import { InsightsSection } from "../components/InsightsSection";
import { AppGuides } from "../components/AppGuides";
import { EverydayTools } from "../components/EverydayTools";
import { WaitlistForm } from "../components/WaitlistForm";
import { faqs } from "../data/content";

export function HomePage() {
  return (
    <div className="compact-home">
      <Hero />
      <TrailerSection />
      <AppGuides />
      <SpendingStory />
      <InsightsSection />
      <EverydayTools />
      <section className="privacy-strip section">
        <p className="eyebrow">PERSONAL FINANCE. EMPHASIS ON PERSONAL.</p>
        <div>
          <h3>Your money is your business.</h3>
          <p>
            Your ledger stays on your iPhone. No bank login. A JSON backup when
            you want your own copy.
          </p>
        </div>
        <Link to="/privacy" className="text-link">
          Privacy Policy <span aria-hidden="true">↗</span>
        </Link>
      </section>
      <section className="waitlist section" id="waitlist">
        <div className="waitlist-copy">
          <p className="eyebrow">
            <span className="status-dot" /> YOUR NEXT LITTLE GOOD HABIT
          </p>
          <h2>
            Be here
            <br />
            <span>before the buzz.</span>
          </h2>
          <p>
            Leave your email for beta invitations and launch updates, when
            they’re ready.
          </p>
          <div className="waitlist-platform">
            <img
              src="/images/spendy-ios-icon-dark.png"
              alt="Spendy app icon"
              width="52"
              height="52"
            />
            <div>
              <strong>Spendy for iOS</strong>
              <span>In development · Beta coming later</span>
            </div>
          </div>
        </div>
        <WaitlistForm />
      </section>
      <section className="section compact-faq">
        <details className="faq-collection">
          <summary>
            <h3>A few good questions.</h3>
            <span className="disclosure" aria-hidden="true">
              +
            </span>
          </summary>
          <div className="faq">
            {faqs.map((faq) => (
              <details key={faq.question}>
                <summary>
                  {faq.question}
                  <span className="disclosure" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </details>
        <Link className="text-link" to="/updates">
          See what we’re building <span aria-hidden="true">↗</span>
        </Link>
      </section>
    </div>
  );
}
