import { useSiteReducedMotion } from "../AnimationPreferences";
import { motion } from "motion/react";

// These are website diagrams, not screenshots of the app.
export function SetupVisual({ topic }: { topic: string }) {
  const reduce = useSiteReducedMotion();
  if (topic === "Budgets") {
    return (
      <figure className="setup-visual budget-visual">
        <figcaption>EXAMPLE · A ₹10,000 BUDGET</figcaption>
        <div className="budget-values">
          <div>
            <small>Recorded</small>
            <strong>₹6,000</strong>
          </div>
          <div>
            <small>Room left</small>
            <strong>₹4,000</strong>
          </div>
        </div>
        <div
          className="budget-track"
          role="img"
          aria-label="60 percent recorded, 40 percent remaining"
        >
          <motion.span
            initial={{ scaleX: reduce ? 1 : 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            style={{ transformOrigin: "left" }}
            transition={{ duration: reduce ? 0 : 0.7 }}
          />
        </div>
        <div className="visual-foot">
          <span>10 days remaining</span>
          <strong>₹400 / day</strong>
        </div>
      </figure>
    );
  }
  const stages =
    topic === "Subscriptions"
      ? ["Renewal date", "Check payment", "Record expense"]
      : topic === "Analytics"
        ? ["Choose period", "Filter records", "Read the pattern"]
        : ["Amount", "Category & account", "Recorded entry"];
  return (
    <figure className="setup-visual">
      <figcaption>
        {topic === "Subscriptions"
          ? "EXPECTED IS DIFFERENT FROM PAID"
          : "HOW THE PIECES CONNECT"}
      </figcaption>
      <ol className="visual-path">
        {stages.map((stage, index) => (
          <motion.li
            key={stage}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: reduce ? 0 : 0.35,
              delay: reduce ? 0 : index * 0.12,
            }}
          >
            <span>0{index + 1}</span>
            <strong>{stage}</strong>
          </motion.li>
        ))}
      </ol>
    </figure>
  );
}
