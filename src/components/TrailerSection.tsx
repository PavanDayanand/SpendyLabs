import { ScrollSection } from "./ScrollSection";
import { useSiteReducedMotion } from "../AnimationPreferences";
const trailerVideoId = "0umZcuX-WW4";

export function TrailerSection() {
  const paused = useSiteReducedMotion();
  return (
    <ScrollSection className="section trailer-section" id="trailer">
      <div className="trailer-heading">
        <div>
          <h2>See Spendy in action.</h2>
          <p>
            A quick look at the friendly iOS app bringing expenses, budgets,
            subscriptions, and insights together.
          </p>
        </div>
      </div>

      <div className="trailer-player">
        {paused ? <a className="trailer-poster" href={`https://youtu.be/${trailerVideoId}`} target="_blank" rel="noreferrer">
          <img src={`https://i.ytimg.com/vi/${trailerVideoId}/maxresdefault.jpg`} alt="Spendy trailer preview" width="1280" height="720" loading="lazy" />
          <span>Watch on YouTube</span>
        </a> : <iframe
          src={`https://www.youtube-nocookie.com/embed/${trailerVideoId}?rel=0&modestbranding=1`}
          title="Spendy app trailer"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />}
      </div>

      {!paused && <a
        className="text-link trailer-link"
        href={`https://youtu.be/${trailerVideoId}`}
        target="_blank"
        rel="noreferrer"
      >
        Watch on YouTube <span aria-hidden="true">↗</span>
      </a>}
    </ScrollSection>
  );
}
