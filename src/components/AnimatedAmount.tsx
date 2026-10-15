import { useEffect } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";

export const money = (value: number) =>
  `₹${Math.round(value).toLocaleString("en-IN")}`;

export function AnimatedAmount({ value }: { value: number }) {
  const reduce = useReducedMotion();
  const amount = useMotionValue(value);
  const display = useTransform(amount, money);
  useEffect(() => {
    if (reduce) {
      amount.set(value);
      return;
    }
    const animation = animate(amount, value, {
      duration: 0.45,
      ease: "easeOut",
    });
    return () => animation.stop();
  }, [value, amount, reduce]);
  return (
    <span>
      <span className="sr-only">{money(value)}</span>
      <motion.span aria-hidden="true">{display}</motion.span>
    </span>
  );
}
