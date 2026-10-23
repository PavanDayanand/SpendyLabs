import { SpendyInsightsLogo } from "./SpendyInsightsLogo";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { insightGuides } from "../data/insightGuides";
import { Reveal } from "./Reveal";
import { FeaturePanel, FeatureTabs } from "./FeatureTabs";
import { AnimatedAmount, money } from "./AnimatedAmount";

const topics = [
  {
    name: "Spending",
    title: "Start with what you record.",
    text: "Expense entries in your selected dates, accounts, and categories make up spending. Income is separate. Transfers between your own accounts do not increase spending. Future expenses wait until their date.",
    formula: "Spending = included expense entries",
    places: [
      "Home · a quick overview",
      "Analytics · totals and date ranges",
      "Categories · a focused breakdown",
    ],
  },
  {
    name: "Comparisons",
    title: "Compare the same slice of time.",
    text: "Half a month should not be compared with a whole month. Spendy matches the elapsed part of an ongoing period, including the time of day. Completed periods use completed comparison ranges.",
    formula: "Change % = (current − previous) ÷ previous × 100",
    places: [
      "Analytics · changes over time",
      "Categories · what changed in a category",
    ],
  },
  {
    name: "Budget room",
    title: "Your limit, with room to adjust.",
    text: "Spendy follows your weekly or monthly budget cycle. Recorded expenses reduce the room left; daily room spreads the remainder across the days left. A projection extends your average pace so far, rather than predicting individual purchases.",
    formula: "Daily room = remaining budget ÷ days left",
    places: [
      "Budget · remaining room and pace",
      "Home · attention near or over the limit",
    ],
  },
  {
    name: "Renewals",
    title: "Expected is different from paid.",
    text: "Active subscriptions supply renewal dates and expected commitments. Linked recorded payments help identify what still needs a check. Paused or cancelled subscriptions are excluded, and trials are excluded from paid commitment estimates.",
    formula: "Monthly estimate = monthly prices + yearly ÷ 12 + weekly × 4.33",
    places: [
      "Subscriptions · dates and commitments",
      "Home · renewals today and payment checks",
    ],
  },
];

function InsightCalculator({ selected }: { selected: number }) {
  const reduce = useReducedMotion();
  const [entries, setEntries] = useState([true, true, true]);
  const [current, setCurrent] = useState(3000);
  const [spent, setSpent] = useState(6000);
  const [annual, setAnnual] = useState(1200);
  const total = (entries[0] ? 240 : 0) + (entries[1] ? 600 : 0);
  const change = ((current - 2400) / 2400) * 100;
  const remaining = 10000 - spent;
  const transition = { duration: reduce ? 0 : 0.45 };
  return (
    <div className="insight-calculator">
      <p className="eyebrow">TRY THE NUMBERS · ILLUSTRATIVE EXAMPLE</p>
      {selected === 0 && (
        <>
          <div className="calculator-value">
            <span>Recorded spending</span>
            <strong>
              <AnimatedAmount value={total} />
            </strong>
          </div>
          <div className="example-entries">
            {[
              { name: "Coffee", amount: 240, kind: "Expense" },
              { name: "Groceries", amount: 600, kind: "Expense" },
              { name: "Between accounts", amount: 2000, kind: "Transfer" },
            ].map((entry, index) => (
              <button
                key={entry.name}
                aria-pressed={entries[index]}
                onClick={() =>
                  setEntries(entries.map((on, i) => (i === index ? !on : on)))
                }
              >
                <span className="entry-check" aria-hidden="true">
                  {entries[index] ? "✓" : "+"}
                </span>
                <span>
                  {entry.name}
                  <small>
                    {entry.kind}
                    {index === 2 ? " · excluded from spending" : ""}
                  </small>
                </span>
                <strong>{money(entry.amount)}</strong>
              </button>
            ))}
          </div>
          <p className="calculator-hint">
            Tap an entry to include or remove it. A transfer never adds to
            spending.
          </p>
        </>
      )}
      {selected === 1 && (
        <>
          <div className="calculator-value">
            <span>Compared with the same point last month</span>
            <strong>
              {Math.abs(change).toFixed(0)}%{" "}
              <span className="value-suffix">
                {change > 0 ? "higher" : change < 0 ? "lower" : "change"}
              </span>
            </strong>
          </div>
          <div
            className="comparison-bars"
            role="img"
            aria-label={`Previous ${money(2400)}, current ${money(current)}`}
          >
            {[
              { value: 2400, name: "Previous" },
              { value: current, name: "Current" },
            ].map((bar, i) => (
              <div key={bar.name}>
                <strong>{money(bar.value)}</strong>
                <div>
                  <motion.span
                    animate={{ scaleY: bar.value / 4800 }}
                    transition={transition}
                    className={i === 0 ? "baseline-bar" : ""}
                  />
                </div>
                <small>{bar.name}</small>
              </div>
            ))}
          </div>
          <label className="demo-slider">
            Current spending <span>{money(current)}</span>
            <input
              type="range"
              min="1200"
              max="4800"
              step="300"
              value={current}
              onChange={(e) => setCurrent(Number(e.target.value))}
            />
          </label>
        </>
      )}
      {selected === 2 && (
        <>
          <div className="calculator-value">
            <span>
              {remaining >= 0 ? "Budget room left" : "Over the limit"}
            </span>
            <strong>
              <AnimatedAmount value={Math.abs(remaining)} />
            </strong>
          </div>
          <div
            className="interactive-budget-track"
            role="img"
            aria-label={`${money(spent)} recorded of a ${money(10000)} budget`}
          >
            <motion.span
              animate={{ scaleX: Math.min(spent / 10000, 1) }}
              transition={transition}
            />
          </div>
          <div className="calculator-pair">
            <span>10 days left</span>
            <strong>
              <AnimatedAmount value={Math.max(0, remaining) / 10} /> / day
            </strong>
          </div>
          <label className="demo-slider">
            Recorded expenses <span>{money(spent)}</span>
            <input
              type="range"
              min="0"
              max="12000"
              step="500"
              value={spent}
              onChange={(e) => setSpent(Number(e.target.value))}
            />
          </label>
          <p className="calculator-hint">
            Example limit: ₹10,000. Daily room stays at zero once the budget is
            used up.
          </p>
        </>
      )}
      {selected === 3 && (
        <>
          <div className="calculator-value">
            <span>Estimated monthly commitment</span>
            <strong>
              <AnimatedAmount value={199 + annual / 12} />
            </strong>
          </div>
          <div className="renewal-equation">
            <span>
              ₹199 <small>monthly plan</small>
            </span>
            <b>+</b>
            <span>
              {money(annual / 12)}
              <small>{money(annual)} yearly ÷ 12</small>
            </span>
          </div>
          <label className="demo-slider">
            Yearly plan price <span>{money(annual)}</span>
            <input
              type="range"
              min="1200"
              max="6000"
              step="1200"
              value={annual}
              onChange={(e) => setAnnual(Number(e.target.value))}
            />
          </label>
          <p className="calculator-hint">
            This estimate spreads a yearly price across months. The full yearly
            bill still follows its renewal date.
          </p>
        </>
      )}
    </div>
  );
}

export function InsightsSection() {
  const [selected, setSelected] = useState(0);
  const topic = topics[selected];
  return (
    <section className="insights-section" id="insights">
      <div className="section">
        <Reveal className="section-heading compact-heading">
          <div>
            <div className="insights-brand">
              <SpendyInsightsLogo />
              <p className="eyebrow">02 / SPENDY INSIGHTS</p>
            </div>
            <h2>
              The numbers.
              <br />
              <span>The reason behind them.</span>
            </h2>
          </div>
          <p>
            Calculated on your iPhone from your records. Explore the maths, then
            see where each insight lives in the app.
          </p>
        </Reveal>
        <FeatureTabs
          id="insight"
          label="How Insights works"
          items={topics.map((topic) => topic.name)}
          selected={selected}
          onSelect={setSelected}
        />
        <FeaturePanel id="insight" selected={selected}>
          <div className="insight-explorer">
            <InsightCalculator selected={selected} />
            <div className="insight-story">
              <h3>{topic.title}</h3>
              <p>{topic.text}</p>
              <p className="calculation-formula">{topic.formula}</p>
              <div className="insight-locations">
                <p className="eyebrow">WHERE YOU’LL SEE IT</p>
                {topic.places.map((place) => (
                  <p key={place}>
                    <span aria-hidden="true">↗</span>
                    {place}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </FeaturePanel>
        <details className="more-details calculation-details">
          <summary>
            A closer look at the rules
            <span className="disclosure" aria-hidden="true">
              +
            </span>
          </summary>
          <div className="method-notes">
            {insightGuides.map((guide) => (
              <div key={guide.title}>
                <h4>{guide.title}</h4>
                <p>{guide.text}</p>
                <p className="method-example">{guide.example}</p>
              </div>
            ))}
          </div>
        </details>
        <p className="insights-footer">
          Your records set the context. Missing entries affect the result;
          comparisons need suitable history. These are calculations and rules,
          not generative AI answers.
        </p>
      </div>
    </section>
  );
}
