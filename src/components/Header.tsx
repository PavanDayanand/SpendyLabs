import { Link, NavLink } from "react-router-dom";

export function Header() {
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
          <a href="/#waitlist" className="header-waitlist">
            Join waitlist <span aria-hidden="true">↗</span>
          </a>
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
