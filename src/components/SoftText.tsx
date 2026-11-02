import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useSiteReducedMotion } from "../AnimationPreferences";

export function SoftText({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useSiteReducedMotion();
  useEffect(() => {
    if (!ref.current || reduce) return;
    const words = ref.current.querySelectorAll("span");
    const animation = gsap.fromTo(words, { opacity: 0, y: 10 },
      { opacity: 1, y: 0, stagger: .065, duration: .55, ease: "power3.out", clearProps: "opacity,transform" });
    return () => { animation.revert(); };
  }, [text, reduce]);
  return <span ref={ref} className={`soft-text ${className}`} aria-label={text}>
    {text.split(" ").map((word, index) => <span key={`${word}-${index}`} aria-hidden="true">{word}{"\u00a0"}</span>)}
  </span>;
}
