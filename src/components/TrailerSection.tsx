const trailerVideoId = "fYSqnzF3wEM";

export function TrailerSection() {
  return (
    <section className="section trailer-section" id="trailer">
      <div className="trailer-heading">
        <p className="eyebrow">THE SPENDY TRAILER</p>
        <div>
          <h2>Money makes sense.</h2>
          <p>See how Spendy turns everyday spending into a clearer picture.</p>
        </div>
      </div>

      <div className="trailer-player">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${trailerVideoId}?rel=0&modestbranding=1`}
          title="Spendy app trailer"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>

      <a
        className="text-link trailer-link"
        href={`https://youtu.be/${trailerVideoId}`}
        target="_blank"
        rel="noreferrer"
      >
        Watch on YouTube <span aria-hidden="true">↗</span>
      </a>
    </section>
  );
}
