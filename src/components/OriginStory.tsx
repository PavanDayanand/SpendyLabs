import { Reveal } from "./Reveal";
import { PavanSignature } from "./PavanSignature";

export function OriginStory() {
  return (
    <section className="origin-story section" id="story">
      <Reveal className="origin-story-heading">
        <h2>Why I started Spendy.</h2>
      </Reveal>
      <Reveal className="origin-story-copy founder-story">
        <p>
          As a student, I wanted one app to keep my budget up to date, track
          spending insights, and explore my analytics. Finding all of that in
          an interface that felt modern, minimal, and accessible was harder
          than I expected.
        </p>
        <div className="founder-story-ending">
          <p>
            So I started building Spendy, bringing the everyday tools I wanted
            into an app I’d enjoy using. It began on the web. Now I’m bringing
            it to iPhone.
          </p>
          <PavanSignature />
          <a className="text-link" href="https://spendygo.netlify.app/" target="_blank" rel="noreferrer">
            Visit the original web app
          </a>
        </div>
      </Reveal>
    </section>
  );
}
