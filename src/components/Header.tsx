import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useSiteReducedMotion } from "../AnimationPreferences";
import { ArrowUpRight, Plus } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const reduce = useSiteReducedMotion();
  const headerRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    function closeOutside(event: PointerEvent) {
      if (!headerRef.current?.contains(event.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [menuOpen]);

  return (
    <header ref={headerRef} className="header product-header" onKeyDown={(event) => {
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
          <div className="desktop-theme-control"><ThemeToggle /></div>
          <a href="/#waitlist" className="header-waitlist">Join waitlist <ArrowUpRight size={18} aria-hidden="true" /></a>
          <motion.button whileTap={reduce ? undefined : { scale: .95 }} id="mobile-menu-button" className="mobile-header-control mobile-menu-control" type="button"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen}
            aria-controls="main-navigation" onClick={() => setMenuOpen(!menuOpen)}>
            <span>{menuOpen ? "Close" : "Menu"}</span><Plus size={19} aria-hidden="true" />
          </motion.button>
        </div>
      </div>
      <nav className="product-nav desktop-main-navigation" aria-label="Main navigation">
        <a href="/#story">Our story</a><a href="/#guides">Inside the app</a>
        <a href="/#insights">Insights</a><a href="/#siri">Shortcuts</a><NavLink to="/updates">Updates</NavLink>
      </nav>
      <AnimatePresence initial={false}>
      {menuOpen && <motion.nav id="main-navigation" className="product-nav mobile-main-navigation" aria-label="Main navigation" data-open="true"
        initial={reduce ? false : { opacity: 0, y: -10, scale: .97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: reduce ? 0 : -8, scale: reduce ? 1 : .98 }}
        transition={{ duration: reduce ? 0 : .22, ease: [.22, 1, .36, 1] }}
        onClick={(event) => { if ((event.target as HTMLElement).closest("a")) setMenuOpen(false); }}>
        <p className="mobile-nav-heading">A little look around</p>
        <a href="/#story">Our story</a>
        <a href="/#guides">Inside the app</a>
        <a href="/#insights">Insights</a>
        <a href="/#siri">Shortcuts</a>
        <NavLink to="/updates">Updates</NavLink>
        <div className="mobile-nav-appearance">
          <span>Make yourself at home.</span>
          <ThemeToggle showLabel />
        </div>
        <a className="mobile-nav-waitlist" href="/#waitlist">Join waitlist <ArrowUpRight size={16} aria-hidden="true" /></a>
      </motion.nav>}
      </AnimatePresence>
    </header>
  );
}
