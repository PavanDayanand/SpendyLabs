import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import "./SpendyWidgetPreview.css";

// Example values follow SpendyWidgetSnapshot.preview in the iOS project.
const days = [
  { label: "M", amount: 24.5 },
  { label: "T", amount: 65 },
  { label: "W", amount: 18.2 },
  { label: "T", amount: 82 },
  { label: "F", amount: 45 },
  { label: "S", amount: 92.5 },
  { label: "S", amount: 34 },
];

type Glyph = "plus" | "camera" | "trend" | "cart" | "coffee" | "fuel";

function WidgetGlyph({ name }: { name: Glyph }) {
  const paths: Record<Glyph, ReactNode> = {
    plus: <path d="M12 4v16M4 12h16" />,
    camera: (
      <>
        <path d="M4 7h3l2-2h6l2 2h3v12H4z" />
        <circle cx="12" cy="13" r="3.2" />
      </>
    ),
    trend: (
      <>
        <path d="M5 18 19 4M9 4h10v10" />
      </>
    ),
    cart: (
      <>
        <path d="M3 5h2l2 11h11l2-8H6" />
        <circle cx="9" cy="20" r="1" />
        <circle cx="17" cy="20" r="1" />
      </>
    ),
    coffee: (
      <>
        <path d="M4 7h13v7a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM17 8h2a3 3 0 0 1 0 6h-2M3 21h16" />
      </>
    ),
    fuel: (
      <>
        <path d="M5 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16M4 21h13M7 7h7v5H7zM16 9h2l2 2v7a2 2 0 0 0 2 2" />
      </>
    ),
  };
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

function WeekBars({ tall = false }: { tall?: boolean }) {
  return (
    <div
      className={`ios-week ${tall ? "ios-week--tall" : ""}`}
      aria-hidden="true"
    >
      {days.map((day, index) => (
        <div className="ios-week-day" key={index}>
          <div className="ios-week-bar-space">
            <i
              className={index === 6 ? "is-today" : ""}
              style={{ height: `${Math.max(4, (day.amount / 92.5) * 100)}%` }}
            />
          </div>
          <span className={index === 6 ? "is-today" : ""}>{day.label}</span>
        </div>
      ))}
    </div>
  );
}

function BudgetRail() {
  return (
    <div className="ios-budget-rail" aria-hidden="true">
      <span style={{ width: "56%" }} />
    </div>
  );
}

function Actions({ compact = false }: { compact?: boolean }) {
  const actions: { label: string; glyph: Glyph }[] = [
    { label: "Add", glyph: "plus" },
    { label: "Scan", glyph: "camera" },
    { label: "Trends", glyph: "trend" },
  ];
  return (
    <div className={`ios-actions ${compact ? "ios-actions--compact" : ""}`}>
      {actions.map((action) => (
        <div key={action.label}>
          <WidgetGlyph name={action.glyph} />
          <span>{action.label}</span>
        </div>
      ))}
    </div>
  );
}

function TodaySmall() {
  return (
    <div className="ios-today-small ios-fill">
      <span className="ios-label">Today</span>
      <strong className="ios-amount">₹34</strong>
      <WeekBars />
    </div>
  );
}

function BudgetSmall() {
  return (
    <div className="ios-budget-small ios-fill">
      <div className="ios-title-row">
        <span className="ios-label">Budget room</span>
        <span className="ios-dotted" aria-hidden="true" />
      </div>
      <div className="ios-budget-figure">
        <strong className="ios-amount">₹655</strong>
        <span className="ios-subtitle">left this cycle</span>
      </div>
      <div>
        <BudgetRail />
        <span className="ios-subtitle">14 days left</span>
      </div>
    </div>
  );
}

function QuickActions({ medium }: { medium: boolean }) {
  return (
    <div className="ios-quick ios-fill">
      <span className="ios-label">Quick actions</span>
      {medium ? (
        <div className="ios-quick-medium">
          <div>
            <span className="ios-label">Spent today</span>
            <strong className="ios-amount">₹34</strong>
          </div>
          <Actions compact />
        </div>
      ) : (
        <Actions />
      )}
    </div>
  );
}

function Pulse() {
  return (
    <div className="ios-pulse ios-fill">
      <div className="ios-pulse-total">
        <span className="ios-label">Today</span>
        <strong className="ios-amount">₹34</strong>
        <span className="ios-subtitle">₹361 in 7 days</span>
      </div>
      <div className="ios-pulse-bars">
        <span className="ios-label">Last 7 days</span>
        <WeekBars tall />
      </div>
    </div>
  );
}

function Categories() {
  const rows: { name: string; amount: string; glyph: Glyph }[] = [
    { name: "Groceries", amount: "₹312", glyph: "cart" },
    { name: "Coffee & Cafés", amount: "₹148", glyph: "coffee" },
    { name: "Fuel", amount: "₹96", glyph: "fuel" },
  ];
  return (
    <div className="ios-categories ios-fill">
      <div className="ios-title-row">
        <span className="ios-label">Where it went</span>
        <span className="ios-subtitle">This month</span>
      </div>
      <div className="ios-category-rows">
        {rows.map((row) => (
          <div key={row.name}>
            <span className="ios-category-icon">
              <WidgetGlyph name={row.glyph} />
            </span>
            <span>{row.name}</span>
            <strong>{row.amount}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function MonthlyBrief() {
  return (
    <div className="ios-brief ios-fill">
      <div>
        <span className="ios-label">Monthly brief</span>
        <strong className="ios-amount">₹845</strong>
        <span className="ios-subtitle">↗ ₹125 more vs last month</span>
      </div>
      <div className="ios-brief-week">
        <div className="ios-title-row">
          <span className="ios-label">Last 7 days</span>
          <span className="ios-subtitle">₹361</span>
        </div>
        <WeekBars tall />
      </div>
      <div className="ios-brief-bottom">
        <div>
          <span className="ios-label">Top category</span>
          <strong>Groceries</strong>
          <span className="ios-subtitle">37% of spending</span>
        </div>
        <div>
          <span className="ios-label">Budget room</span>
          <strong>₹655</strong>
          <span className="ios-subtitle">14 days left</span>
        </div>
      </div>
    </div>
  );
}

function LockScreen({ size }: { size: string }) {
  if (size === "Circular")
    return (
      <div className="ios-lock-circle">
        <span>Today</span>
        <strong>₹34</strong>
      </div>
    );
  if (size === "Inline")
    return <div className="ios-lock-inline">↗ ₹34 today</div>;
  return (
    <div className="ios-lock-rectangle">
      <WidgetGlyph name="trend" />
      <div>
        <strong>Today ₹34</strong>
        <span>Spent this month · ₹845</span>
      </div>
    </div>
  );
}

export function SpendyWidgetPreview({
  name,
  size,
}: {
  name: string;
  size: string;
}) {
  const reduce = useReducedMotion();
  const shape =
    name === "Lock Screen" ? `lock-${size.toLowerCase()}` : size.toLowerCase();
  let content;
  if (name === "Today")
    content =
      size === "Small" ? (
        <TodaySmall />
      ) : size === "Medium" ? (
        <Pulse />
      ) : (
        <MonthlyBrief />
      );
  else if (name === "Budget room") content = <BudgetSmall />;
  else if (name === "Quick actions")
    content = <QuickActions medium={size === "Medium"} />;
  else if (name === "Spending Pulse") content = <Pulse />;
  else if (name === "Where It Went") content = <Categories />;
  else if (name === "Monthly Brief") content = <MonthlyBrief />;
  else content = <LockScreen size={size} />;
  return (
    <div className="widget-stage">
      <span className="widget-stage-caption">
        {size} {name === "Lock Screen" ? "Lock Screen" : "Home Screen"} widget ·
        example data
      </span>
      <motion.div
        key={`${name}-${size}`}
        className={`spendy-widget spendy-widget--${shape}`}
        role="img"
        aria-label={`Preview of the ${size.toLowerCase()} ${name} widget using example data`}
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.2 }}
      >
        <div aria-hidden="true">{content}</div>
      </motion.div>
    </div>
  );
}
