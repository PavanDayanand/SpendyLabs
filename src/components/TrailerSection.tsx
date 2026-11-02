import { ScrollSection } from "./ScrollSection";
import { useSiteReducedMotion } from "../AnimationPreferences";
const trailerVideoId = "0umZcuX-WW4";

export function TrailerSection() {
  const paused = useSiteReducedMotion();
  return (
    <ScrollSection className="section trailer-section" id="trailer">
      <div className="trailer-heading">
        <p className="eyebrow">The Spendy trailer</p>
        <div>
          <h2>Money makes sense.</h2>
          <p>
            A quick look at the friendly iOS app bringing expenses, budgets,
            subscriptions, and insights together.
          </p>
        </div>
      </div>

      <div className="trailer-player">
        {paused ? <div className="trailer-paused"><p>Trailer paused</p><a href={`https://youtu.be/${trailerVideoId}`} target="_blank" rel="noreferrer">Watch on YouTube ↗</a></div> : <iframe
          src={`https://www.youtube-nocookie.com/embed/${trailerVideoId}?rel=0&modestbranding=1`}
          title="Spendy app trailer"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />}
      </div>

      <a
        className="text-link trailer-link"
        href={`https://youtu.be/${trailerVideoId}`}
        target="_blank"
        rel="noreferrer"
      >
        Watch on YouTube <span aria-hidden="true">↗</span>
      </a>
    </ScrollSection>
  );
}
