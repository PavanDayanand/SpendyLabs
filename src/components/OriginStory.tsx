import { Reveal } from "./Reveal";

const storyPoints = [
  {
    number: "01",
    title: "First, a PWA",
    text: "The original Spendy brought simple, private expense tracking to the mobile web, with no account and no server holding your records.",
  },
  {
    number: "02",
    title: "Shortcuts changed the direction",
    text: "Apple Shortcuts showed how much easier adding an expense or checking a total could feel when Spendy worked closely with iPhone.",
  },
  {
    number: "03",
    title: "Now, a native iOS app",
    text: "The same private idea has grown into one place for expenses, budgets, subscriptions, insights, widgets, Siri, and receipt scanning.",
  },
];

export function OriginStory() {
  return (
    <section className="origin-story section" id="story">
      <Reveal className="origin-story-heading">
        <p className="eyebrow">HOW SPENDY STARTED</p>
        <h2>
          It started on the web.
          <br />
          <span className="muted">Then found its home on iPhone.</span>
        </h2>
      </Reveal>

      <Reveal className="origin-story-copy">
        <p>
          Spendy first began as a Progressive Web App: a private expense
          tracker that could run from a phone without asking for an account or
          sending financial records to a server.
        </p>
        <p>
          As the idea grew, Apple Shortcuts opened a more natural way to add
          expenses and check spending. That became the step into a full iOS
          app, designed around the features people already use on their iPhone.
        </p>
        <a
          className="text-link origin-story-link"
          href="https://spendygo.netlify.app/"
          target="_blank"
          rel="noreferrer"
        >
          Visit the original PWA <span aria-hidden="true">↗</span>
        </a>
      </Reveal>

      <div className="origin-story-points">
        {storyPoints.map((point) => (
          <Reveal className="origin-story-point" key={point.number}>
            <span>{point.number}</span>
            <h3>{point.title}</h3>
            <p>{point.text}</p>
          </Reveal>
        ))}
      </div>

      <p className="origin-story-closing">
        The platform changed, but the idea stayed simple: keep everyday money
        private, useful, and easy to understand.
      </p>
    </section>
  );
}
