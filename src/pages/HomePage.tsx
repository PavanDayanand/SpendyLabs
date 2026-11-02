import { Question } from "../components/Question";
import { ScrollSection } from "../components/ScrollSection";
import { AppShowcase } from "../components/AppShowcase";
import { Link } from "react-router-dom";
import { Hero } from "../components/Hero";
import { TrailerSection } from "../components/TrailerSection";
import { OriginStory } from "../components/OriginStory";
import { WaitlistForm } from "../components/WaitlistForm";
import { faqs } from "../data/content";

export function HomePage() {
  return (
    <div className="compact-home">
      <Hero />
      <AppShowcase />
      <TrailerSection />
      <OriginStory />
      <ScrollSection className="privacy-strip section">
        <div>
          <h3>Your money is your business.</h3>
          <p>
            Your records stay on your iPhone. No bank login. Export a backup
            whenever you want your own copy.
          </p>
        </div>
        <Link to="/privacy" className="text-link">
          Privacy Policy <span aria-hidden="true">↗</span>
        </Link>
      </ScrollSection>
      <ScrollSection className="waitlist section" id="waitlist">
        <div className="waitlist-copy">
          <h2>Join the Spendy waitlist.</h2>
          <p>
            Leave your email and we’ll let you know when beta invitations and
            launch news are ready.
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
              <span>In development. Beta coming later.</span>
            </div>
          </div>
        </div>
        <WaitlistForm />
      </ScrollSection>
      <ScrollSection className="section compact-faq">
        <Question title="A few good questions.">
          <div className="faq">
            {faqs.map((faq) => <Question key={faq.question} title={faq.question}><p>{faq.answer}</p></Question>)}
          </div>
        </Question>
        <Link className="text-link" to="/updates">
          See what we’re building <span aria-hidden="true">↗</span>
        </Link>
      </ScrollSection>
    </div>
  );
}
