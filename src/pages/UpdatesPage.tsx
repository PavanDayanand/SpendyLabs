import { updates } from "../data/content";
export function UpdatesPage() {
  return (
    <article className="document-page">
      <p className="eyebrow">THE SPENDY BUILD NOTES</p>
      <h1>
        Getting a little
        <br />
        <span className="muted">better, every day.</span>
      </h1>
      <p className="document-intro">
        Small details, thoughtful changes, and the occasional big step forward.
        Follow along as Spendy takes shape.
      </p>
      <p className="release-status">
        <span className="status-dot" /> In development. Beta invitations are not
        available yet.
      </p>
      {updates.map((update) => (
        <article className="build-note" key={update.title}>
          <p className="eyebrow">
            {update.date} · {update.tag}
          </p>
          <h2>{update.title}</h2>
          <p>{update.text}</p>
          {update.tag === "UNDER THE HOOD" && (
            <ul>
              <li>
                Atomic local saves and recovery from a previous successful
                snapshot.
              </li>
              <li>Stricter checks before importing a JSON backup.</li>
              <li>
                Regression coverage for transactions, budgets, and
                subscriptions.
              </li>
            </ul>
          )}
        </article>
      ))}
      <a href="/#waitlist" className="button">
        Be part of what's next
      </a>
    </article>
  );
}
