import { Reveal } from "./Reveal";
import { LedgerDemo } from "./LedgerDemo";

export function SpendingStory() {
  return (
    <section
      className="spending-story section"
      aria-labelledby="spending-story-title"
    >
      <Reveal className="spending-story-copy">
        <p className="eyebrow">THE LITTLE THINGS ADD UP</p>
        <h2 id="spending-story-title">
          Little entries.
          <br />A clearer picture.
        </h2>
        <p>
          From a coffee to the weekly shop, every entry helps you see where your
          money is going. Transfers stay separate, so the picture stays clear.
        </p>
        <a className="text-link" href="#insights">
          Explore spending insights <span aria-hidden="true">↗</span>
        </a>
      </Reveal>
      <LedgerDemo />
    </section>
  );
}
