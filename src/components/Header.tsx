import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, Plus } from "lucide-react";
import { gsap } from "gsap";
import { ThemeToggle } from "./ThemeToggle";
import { useSiteReducedMotion } from "../AnimationPreferences";
import "./site-header.css";

const menuItems = [
  { label: "Our story", link: "/#story" },
  { label: "Inside the app", link: "/#guides" },
  { label: "Insights", link: "/#insights" },
  { label: "Shortcuts", link: "/#siri" },
  { label: "Updates", link: "/updates" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const reduce = useSiteReducedMotion();
  const { pathname, hash } = useLocation();

  useEffect(() => { setMenuOpen(false); }, [pathname, hash]);
  useEffect(() => {
    if (!menuOpen) return;
    const closeOutside = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [menuOpen]);

  useLayoutEffect(() => {
    if (!panelRef.current) return;
    const animation = gsap.to(panelRef.current, {
      autoAlpha: menuOpen ? 1 : 0,
      y: menuOpen ? 0 : -8,
      scale: menuOpen ? 1 : .98,
      duration: reduce ? 0 : menuOpen ? .28 : .18,
      ease: "power3.out",
      overwrite: true,
    });
    return () => { animation.kill(); };
  }, [menuOpen, reduce]);

  return <header ref={headerRef} className="site-header" onKeyDown={(event) => {
    if (event.key === "Escape") { setMenuOpen(false); buttonRef.current?.focus(); }
  }}>
    <div className="site-header-inner">
      <Link to="/" className="site-brand" aria-label="Spendy home">
        <img src="/images/spendy-ios-icon-dark.png" alt="" width="44" height="44" /><span>Spendy</span>
      </Link>
      <div className="site-header-actions">
        <a href="/#waitlist" className="site-waitlist">Join waitlist <ArrowUpRight size={17} aria-hidden="true" /></a>
        <button ref={buttonRef} type="button" className="site-menu-button" aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen} aria-controls="site-navigation" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? "Close" : "Menu"}<Plus size={19} aria-hidden="true" />
        </button>
      </div>
    </div>
    <nav ref={panelRef} id="site-navigation" className="site-dropdown" aria-label="Main navigation" aria-hidden={!menuOpen} inert={!menuOpen}>
      <p className="site-dropdown-heading">A little look around</p>
      {menuItems.map((item) => <Link key={item.link} to={item.link} onClick={() => setMenuOpen(false)}>{item.label}</Link>)}
      <div className="site-dropdown-appearance"><span>Make yourself at home.</span><ThemeToggle showLabel /></div>
      <a className="site-dropdown-waitlist" href="/#waitlist" onClick={() => setMenuOpen(false)}>Join waitlist <ArrowUpRight size={17} aria-hidden="true" /></a>
    </nav>
  </header>;
}
