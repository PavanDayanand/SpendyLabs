import { Link } from "react-router-dom";
import { appTermsURL, socialLinks } from "../data/links";
export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <p>
          MADE FOR iOS.
          <br />
          BUILT FOR YOUR EVERYDAY.
        </p>
        <a href="/#waitlist">GET IN EARLY</a>
      </div>
      <nav className="social-links" aria-label="Follow and support Spendy">
        {socialLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>{link.name}</span>
          </a>
        ))}
      </nav>
      <Link to="/" className="footer-wordmark" aria-label="Spendy home">
        SPENDY<span>©</span>
      </Link>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} SPENDY</span>
        <span>INDEPENDENT. IN DEVELOPMENT.</span>
        <div>
          <Link to="/privacy">PRIVACY</Link>
          <a href={appTermsURL} target="_blank" rel="noopener noreferrer" aria-label="Terms of Use for the app (Apple EULA)">TERMS OF USE</a>
          <Link to="/updates">BUILD NOTES</Link>
        </div>
      </div>
    </footer>
  );
}
