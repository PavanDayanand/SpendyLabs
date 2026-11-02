import { updates } from "../data/content";
export function UpdatesPage() {
  return (
    <article className="document-page">
      <p className="eyebrow">The Spendy build notes</p>
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
            {update.date} · {update.tag.charAt(0) + update.tag.slice(1).toLowerCase()}
          </p>
          <h2>{update.title}</h2>
          <p>{update.text}</p>
          {update.tag === "UNDER THE HOOD" && (
            <ul>
              <li>Safer saves, with a recent copy ready if something goes wrong.</li>
              <li>Extra checks before bringing in a backup.</li>
              <li>More testing across transactions, budgets, and subscriptions.</li>
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
