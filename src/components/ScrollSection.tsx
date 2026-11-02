import { useEffect, useRef, type ComponentProps } from "react";
import { gsap } from "gsap";
import { useSiteReducedMotion } from "../AnimationPreferences";

// Reveal each section once. Content is visible before JavaScript; GSAP owns
// only this wrapper's opacity and transform, so it never fights child Motion UI.
export function ScrollSection({ children, ...props }: ComponentProps<"section">) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useSiteReducedMotion();
  useEffect(() => {
    const section = ref.current;
    if (!section || reduce) return;
    let animation: gsap.core.Tween | undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      animation = gsap.fromTo(section, { opacity: .4, y: 18 },
        { opacity: 1, y: 0, duration: .65, ease: "power3.out", clearProps: "opacity,transform" });
      observer.disconnect();
    }, { threshold: .08 });
    observer.observe(section);
    return () => { observer.disconnect(); animation?.revert(); };
  }, [reduce]);
  return <section ref={ref} {...props}>{children}</section>;
}
