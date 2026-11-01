import { Link, NavLink } from "react-router-dom";

import { useTheme } from "../Theme";

export function Header() {
  const { theme, toggleTheme } = useTheme();
  return (
    <>
      <header className="header product-header">
        <div className="product-header-bar">
          <Link to="/" className="product-brand" aria-label="Spendy home">
            <img
              src="/images/spendy-ios-icon-dark.png"
              alt=""
              width="56"
              height="56"
            />
            <span>Spendy</span>
          </Link>
          <div className="header-actions">
            <button className="theme-toggle" type="button" onClick={toggleTheme}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}>
              <span aria-hidden="true">{theme === "light" ? "☾" : "☀"}</span>
              <span>{theme === "light" ? "Dark" : "Light"}</span>
            </button>
          <a href="/#waitlist" className="header-waitlist">
            Join waitlist <span aria-hidden="true">↗</span>
          </a>
          </div>
        </div>
      </header>
      <nav className="product-nav" aria-label="Main navigation">
        <a href="/#story">OUR STORY</a>
        <a href="/#guides">THE APP</a>
        <a href="/#insights">INSIGHTS</a>
        <a href="/#siri">SHORTCUTS</a>
        <NavLink to="/updates">UPDATES</NavLink>
      </nav>
    </>
  );
}
