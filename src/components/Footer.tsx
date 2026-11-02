import { motion } from "motion/react";
import { useSiteReducedMotion } from "../AnimationPreferences";
import { useAnimationPreferences } from "../AnimationPreferences";
import { Link } from "react-router-dom";
import { appTermsURL, socialLinks } from "../data/links";
export function Footer() {
  const reduce = useSiteReducedMotion();
  const { paused, toggle } = useAnimationPreferences();
  return (
    <footer className="footer">
      <div className="footer-top">
        <p>
          Made for iOS.
          <br />
          Built for your everyday.
        </p>
        <a href="/#waitlist">Get in early</a>
      </div>
      <motion.button whileHover={reduce ? undefined : { y: -1 }} whileTap={reduce ? undefined : { scale: .97 }} type="button" className="footer-animation-toggle" aria-pressed={paused} onClick={toggle}>
        {paused ? "Resume all animations" : "Pause all animations"}
      </motion.button>
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
        Spendy<span>©</span>
      </Link>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Spendy</span>
        <span>Independent. In development.</span>
        <div>
          <Link to="/privacy">Privacy</Link>
          <a href={appTermsURL} target="_blank" rel="noopener noreferrer" aria-label="Terms of Use for the app (Apple EULA)">Terms of use</a>
          <Link to="/updates">Build notes</Link>
        </div>
      </div>
    </footer>
  );
}
