import { motion, useScroll, useSpring } from "motion/react";
import { useSiteReducedMotion } from "../AnimationPreferences";

export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 160, damping: 30 });
  const reduce = useSiteReducedMotion();
  return <motion.div className="reading-progress" aria-hidden="true"
    style={{ scaleX: reduce ? scrollYProgress : smoothProgress }} />;
}
