import { Reveal } from "./Reveal";

export function OriginStory() {
  return (
    <section className="origin-story section" id="story">
      <Reveal className="origin-story-heading">
        <p className="eyebrow">From the web to your pocket</p>
        <h2>
          A small idea.
          <br />
          <span className="muted">Finding its home on iPhone.</span>
        </h2>
      </Reveal>
      <Reveal className="origin-story-copy">
        <p>
          Spendy began as a private web expense tracker. Apple Shortcuts sparked
          the move to a native iOS app. Same idea: make everyday money a little
          easier to understand.
        </p>
        <a
          className="text-link"
          href="https://spendygo.netlify.app/"
          target="_blank"
          rel="noreferrer"
        >
          Visit the original PWA ↗
        </a>
      </Reveal>
    </section>
  );
}
