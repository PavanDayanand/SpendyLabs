import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { MotionConfig, useReducedMotion } from "motion/react";

const AnimationContext = createContext({ paused: false, toggle: () => {} });
const storageKey = "spendy-animations-paused";

export function AnimationPreferences({ children }: { children: ReactNode }) {
  const [paused, setPaused] = useState(() => {
    try { return localStorage.getItem(storageKey) === "true"; } catch { return false; }
  });
  const reduced = useReducedMotion();
  const disabled = paused || !!reduced;
  useEffect(() => {
    try { localStorage.setItem(storageKey, String(paused)); } catch { /* Storage may be unavailable. */ }
  }, [paused]);
  useEffect(() => {
    document.documentElement.toggleAttribute("data-animations-paused", disabled);
    // Stop in-flight Web Animations as well as subsequent React/CSS motion.
    const running = disabled ? document.getAnimations().filter(animation => animation.playState === "running") : [];
    running.forEach(animation => animation.pause());
    return () => {
      document.documentElement.removeAttribute("data-animations-paused");
      running.forEach(animation => { if (animation.playState === "paused") animation.play(); });
    };
  }, [disabled]);
  return (
    <AnimationContext.Provider value={{ paused, toggle: () => setPaused(value => !value) }}>
      <MotionConfig reducedMotion={disabled ? "always" : "user"} transition={disabled ? { duration: 0 } : undefined}>
        {children}
      </MotionConfig>
    </AnimationContext.Provider>
  );
}

export const useAnimationPreferences = () => useContext(AnimationContext);
export function useSiteReducedMotion() {
  const { paused } = useAnimationPreferences();
  const reduced = useReducedMotion();
  return paused || !!reduced;
}
