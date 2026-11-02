import { useEffect, useState } from "react";
import { Sun, Moon, ArrowUpRight, Menu, X } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { MotionSwitch } from "./MotionSwitch";
import { useTheme } from "../Theme";

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <header className="header product-header" onKeyDown={(event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        document.getElementById("mobile-menu-button")?.focus();
      }
    }}>
      <div className="product-header-bar">
        <Link to="/" className="product-brand" aria-label="Spendy home" onClick={() => setMenuOpen(false)}>
          <img src="/images/spendy-ios-icon-dark.png" alt="" width="56" height="56" />
          <span>Spendy</span>
        </Link>
        <div className="header-actions">
          <div className="desktop-theme-control">
            <MotionSwitch value={theme} label="Website appearance"
              options={[{ value: "light", label: "Light", icon: <Sun size={18} strokeWidth={1.8} aria-hidden="true" /> }, { value: "dark", label: "Dark", icon: <Moon size={18} strokeWidth={1.8} aria-hidden="true" /> }]}
              onChange={(value) => { if (value !== theme) toggleTheme(); }} />
          </div>
          <button className="mobile-header-control mobile-theme-control" type="button" onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}>
            {theme === "light" ? <Moon size={20} aria-hidden="true" /> : <Sun size={20} aria-hidden="true" />}
          </button>
          <a href="/#waitlist" className="header-waitlist">Join waitlist <ArrowUpRight size={18} aria-hidden="true" /></a>
          <button id="mobile-menu-button" className="mobile-header-control mobile-menu-control" type="button"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen}
            aria-controls="main-navigation" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={21} aria-hidden="true" /> : <Menu size={21} aria-hidden="true" />}
          </button>
        </div>
      </div>
      <nav id="main-navigation" className="product-nav" aria-label="Main navigation" data-open={menuOpen}
        onClick={() => setMenuOpen(false)}>
        <a href="/#story">Our story</a>
        <a href="/#guides">Inside the app</a>
        <a href="/#insights">Insights</a>
        <a href="/#siri">Shortcuts</a>
        <NavLink to="/updates">Updates</NavLink>
        <a className="mobile-nav-waitlist" href="/#waitlist">Join waitlist <ArrowUpRight size={16} aria-hidden="true" /></a>
      </nav>
    </header>
  );
}
