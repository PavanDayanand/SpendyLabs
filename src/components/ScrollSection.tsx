import type { ComponentProps } from "react";
import { motion } from "motion/react";
import { useSiteReducedMotion } from "../AnimationPreferences";

// Each section settles into view once. No scroll-linked work or page transitions.
export function ScrollSection({ children, ...props }: Omit<ComponentProps<"section">, "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd">) {
  const reduce = useSiteReducedMotion();
  return <motion.section {...props}
    initial={reduce ? false : { opacity: 0, y: 14 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: .08 }}
    transition={{ duration: reduce ? 0 : .45, ease: [.22, 1, .36, 1] }}>
    {children}
  </motion.section>;
}
