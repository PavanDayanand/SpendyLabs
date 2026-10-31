import { useSiteReducedMotion } from "../AnimationPreferences";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import "./app-logo-intro.css";

const LiquidGlassLogo = lazy(() => import("./liquid-glass-logo").then(module => ({ default: module.LiquidGlassLogo })));
const logo = "/mascot/spendy-coffee.svg";

export function AppLogoIntro() {
  const host = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const reduce = useSiteReducedMotion();
  useEffect(() => {
    if (!host.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
      if (entry.isIntersecting) setLoaded(true);
    });
    observer.observe(host.current);
    const sync = () => setPageVisible(!document.hidden);
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", sync); };
  }, []);
  const fallback = <div className="app-logo-intro__fallback"><img src={logo} alt="Spendy coffee character" width="88" height="88" /></div>;
  return (
    <div className="app-logo-intro" ref={host}>
      <div className="app-logo-intro__stage">
        {loaded && !reduce ? <Suspense fallback={fallback}>
          <LiquidGlassLogo logo={logo} ending="logo" logoColor="original" tileColor="#ffffff"
            background="#f3f3f3" speed={0.5} loop={true} logoScale={1} finalLogoScale={1}
            paused={!visible || !pageVisible} style={{ height: "100%" }} aria-label="Spendy coffee character" />
        </Suspense> : fallback}

      </div>
      <p>Choose what you want to do and see how Spendy makes it feel simple.</p>
    </div>
  );
}
