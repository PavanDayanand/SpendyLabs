import { motion } from "motion/react";
import { useSiteReducedMotion } from "../AnimationPreferences";

// A short, once-only word reveal inspired by React Bits' Blur Text.
export function SoftText({ text, className = "" }: { text: string; className?: string }) {
  const reduce = useSiteReducedMotion();
  return <span className={`soft-text ${className}`} aria-label={text}>
    {text.split(" ").map((word, index) => <motion.span key={`${word}-${index}`} aria-hidden="true"
      initial={reduce ? false : { opacity: 0, y: 10, filter: "blur(5px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: .5 }}
      transition={{ duration: reduce ? 0 : .45, delay: reduce ? 0 : index * .065 }}>
      {word}{"\u00a0"}
    </motion.span>)}
  </span>;
}
