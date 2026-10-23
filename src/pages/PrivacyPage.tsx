import policy from "../data/privacy-policy.json";

export function PrivacyPage() {
  return (
    <article className="document-page privacy-page">
      <p className="eyebrow">YOUR INFORMATION. IN PLAIN WORDS.</p>
      <h1>Privacy Policy</h1>
      <p className="document-intro">{policy.intro}</p>
      <p className="document-date">Last updated {policy.updated}</p>
      <nav className="privacy-contents" aria-label="Privacy policy contents">
        {policy.sections.map((section) => (
          <a key={section.id} href={`#${section.id}`}>{section.title}</a>
        ))}
        <a href="#contact">Contact</a>
      </nav>
      {policy.sections.map((section) => (
        <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`}>
          <h2 id={`${section.id}-title`}>{section.title}</h2>
          {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          {section.links?.map((link) => (
            <p key={link.url}><a className="text-link" href={link.url} rel="noopener noreferrer" target="_blank">{link.title}</a></p>
          ))}
        </section>
      ))}
      <section id="contact" aria-labelledby="contact-title">
        <h2 id="contact-title">Contact</h2>
        <p>Spendy is developed by {policy.developer}.</p>
        {policy.contactEmail ? (
          <p>For privacy questions, waitlist removal, or other privacy requests, email <a className="text-link" href={`mailto:${policy.contactEmail}`}>{policy.contactEmail}</a>.</p>
        ) : (
          <p>A dedicated privacy contact will be shown here whenever public contact details are unavailable.</p>
        )}
        <p>Please do not send banking passwords, full card numbers, or your complete financial ledger when asking a privacy question.</p>
      </section>
    </article>
  );
}
