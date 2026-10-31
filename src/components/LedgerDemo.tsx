import { useSiteReducedMotion } from "../AnimationPreferences";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { AnimatedAmount } from "./AnimatedAmount";

export function LedgerDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const reduce = useSiteReducedMotion();
  const [step, setStep] = useState(0);
  const [replay, setReplay] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setStep(3);
      return;
    }
    setStep(0);
    const timers = [500, 1100, 1700].map((delay, index) =>
      setTimeout(() => setStep(index + 1), delay),
    );
    return () => timers.forEach(clearTimeout);
  }, [inView, replay, reduce]);
  const total = step >= 2 ? 840 : step >= 1 ? 240 : 0;
  return (
    <div className="ledger-demo" ref={ref}>
      <div className="demo-topline">
        <span>YOUR DAY, TAKING SHAPE</span>
        <span>EXAMPLE</span>
      </div>
      <div className="ledger-total">
        <span>Recorded spending</span>
        <strong>
          <AnimatedAmount value={total} />
        </strong>
      </div>
      <div className="ledger-entries">
        {[
          { icon: "↗", name: "Coffee", amount: "₹240", type: "Expense" },
          { icon: "↗", name: "Groceries", amount: "₹600", type: "Expense" },
          {
            icon: "⇄",
            name: "Between accounts",
            amount: "₹2,000",
            type: "Transfer · kept separate",
          },
        ].map((entry, i) => (
          <motion.div
            className="ledger-entry"
            key={entry.name}
            animate={{ opacity: step > i ? 1 : 0.2, x: step > i ? 0 : 10 }}
            transition={{ duration: reduce ? 0 : 0.35 }}
          >
            <span className="ledger-entry-icon" aria-hidden="true">
              {entry.icon}
            </span>
            <div>
              <strong>{entry.name}</strong>
              <small>{entry.type}</small>
            </div>
            <span>{entry.amount}</span>
          </motion.div>
        ))}
      </div>
      <div className="ledger-graphic" aria-hidden="true">
        {[29, 48, 22, 70, 42, 100, 59].map((height, i) => (
          <motion.span
            key={i}
            animate={{ scaleY: step >= 2 ? height / 100 : 0.06 }}
            style={{ transformOrigin: "bottom" }}
            transition={{
              duration: reduce ? 0 : 0.5,
              delay: reduce ? 0 : i * 0.045,
            }}
          />
        ))}
      </div>
      <div className="demo-footer">
        <span>Entries become a clearer picture.</span>
        <button
          type="button"
          onClick={() => setReplay(replay + 1)}
          disabled={step < 3}
        >
          Replay <span aria-hidden="true">↻</span>
        </button>
      </div>
    </div>
  );
}
