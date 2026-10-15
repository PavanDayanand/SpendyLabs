import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { widgetGuides, siriActions } from "../data/appFeatures";
import { Reveal } from "./Reveal";
import { FeaturePanel, FeatureTabs } from "./FeatureTabs";

const ids = ["siri", "receipt", "widgets", "extras"];

function SiriExample() {
  const [action, setAction] = useState(0);
  const [replay, setReplay] = useState(0);
  const reduce = useReducedMotion();
  const shortcut = siriActions[action];
  return (
    <div className="access-example siri-example">
      <div className="demo-topline">
        <span>ONE PHRASE. ONE USEFUL ACTION.</span>
        <span>EXAMPLE</span>
      </div>
      <div className="integration-icons">
        <div>
          <img
            className="siri-icon"
            src="/images/siri-orb.png"
            alt=""
            width="44"
            height="44"
          />
          <span>Siri</span>
        </div>
        <span className="integration-connector" aria-hidden="true">
          +
        </span>
        <div>
          <img
            src="/images/apple-shortcuts.png"
            alt=""
            width="44"
            height="44"
          />
          <span>Apple Shortcuts</span>
        </div>
      </div>
      <div
        className="motion-wave"
        key={`${action}-${replay}`}
        aria-hidden="true"
      >
        {[0.3, 0.55, 0.8, 0.4, 1, 0.7, 0.35, 0.85, 0.6, 0.35, 0.75, 0.45].map(
          (height, i) => (
            <motion.span
              key={i}
              style={{ height: `${height * 72}px` }}
              initial={false}
              whileInView={{ scaleY: reduce ? 1 : [0.3, 1, 0.4, 0.85, 0.5] }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{
                duration: reduce ? 0 : 1.8,
                delay: reduce ? 0 : i * 0.025,
              }}
            />
          ),
        )}
      </div>
      <motion.blockquote
        key={shortcut.name}
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.25 }}
      >
        “Siri,{" "}
        {shortcut.phrase.charAt(0).toLowerCase() + shortcut.phrase.slice(1)}.”
      </motion.blockquote>
      <label className="action-select">
        Explore all eight shortcuts
        <select
          value={action}
          onChange={(e) => setAction(Number(e.target.value))}
        >
          {siriActions.map((item, i) => (
            <option key={item.name} value={i}>
              {item.name}
            </option>
          ))}
        </select>
      </label>
      <p className="shortcut-result">{shortcut.result}</p>
      <div className="demo-footer">
        <span>Visual example · no microphone needed.</span>
        <button onClick={() => setReplay(replay + 1)}>
          Replay <span aria-hidden="true">↻</span>
        </button>
      </div>
    </div>
  );
}

function ReceiptExample() {
  const [replay, setReplay] = useState(0);
  const reduce = useReducedMotion();
  return (
    <div className="access-example scan-example">
      <div className="demo-topline">
        <span>PHOTO → REVIEW → RECORD</span>
        <span>EXAMPLE</span>
      </div>
      <div className="receipt-assist">
        <img
          src="/images/apple-intelligence.png"
          alt=""
          width="48"
          height="48"
        />
        <div>
          <strong>Apple Intelligence</strong>
          <span>Optional help with unclear totals on supported iPhones.</span>
        </div>
      </div>
      <div className="motion-receipt" key={replay}>
        <div className="sample-receipt">
          <span>THE EVERYDAY CAFÉ</span>
          <i />
          <i />
          <i />
          <div>
            <span>Total</span>
            <strong>₹750</strong>
          </div>
          <motion.div
            className="scan-line"
            aria-hidden="true"
            initial={{ top: "12%", opacity: 0 }}
            whileInView={{
              top: reduce ? "86%" : ["12%", "86%"],
              opacity: reduce ? 0 : [0, 1, 1, 0],
            }}
            viewport={{ once: true }}
            transition={{ duration: reduce ? 0 : 1.3 }}
          />
        </div>
        <motion.div
          className="scan-output"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: reduce ? 0 : 0.4, delay: reduce ? 0 : 1.1 }}
        >
          <span>Ready for your review</span>
          <strong>₹750</strong>
          <p>
            Category · Account
            <br />
            Note · Date
          </p>
        </motion.div>
      </div>
      <div className="demo-footer">
        <span>You check it before saving.</span>
        <button onClick={() => setReplay(replay + 1)}>
          Replay <span aria-hidden="true">↻</span>
        </button>
      </div>
    </div>
  );
}

function WidgetExample() {
  const [selected, setSelected] = useState(0);
  const reduce = useReducedMotion();
  return (
    <div className="access-example widget-example">
      <div className="demo-topline">
        <span>A LITTLE CLOSER TO YOUR DAY</span>
        <span>EXAMPLE</span>
      </div>
      <div className="widget-preview">
        <span>{widgetGuides[selected].name}</span>
        <strong>
          {selected === 1 ? "₹4,000" : selected === 2 ? "+  Scan  ↗" : "₹840"}
        </strong>
        <div className="widget-bars" aria-hidden="true">
          {[0.3, 0.65, 0.2, 0.8, 0.45, 0.96, 0.4].map((height, i) => (
            <motion.span
              key={i}
              initial={{ scaleY: reduce ? height : 0 }}
              animate={{ scaleY: height }}
              style={{ transformOrigin: "bottom" }}
              transition={{
                duration: reduce ? 0 : 0.5,
                delay: reduce ? 0 : i * 0.07,
              }}
            />
          ))}
        </div>
      </div>
      <label className="action-select">
        Choose a widget
        <select
          value={selected}
          onChange={(e) => setSelected(Number(e.target.value))}
        >
          {widgetGuides.map((widget, i) => (
            <option key={widget.name} value={i}>
              {widget.name} · {widget.size}
            </option>
          ))}
        </select>
      </label>
      <p className="shortcut-result">{widgetGuides[selected].description}</p>
    </div>
  );
}

const copy = [
  {
    title: "Say it. Or make it a shortcut.",
    text: "Log an expense or income, open Quick Add or the receipt camera, and ask for today’s spending, monthly spending, or budget room.",
    steps: [
      "Open Apple Shortcuts and find Spendy’s app shortcuts.",
      "Choose an action. Siri asks for missing details such as category and amount.",
      "Run it by voice or a tap. Supported actions can also be assigned to the Action Button, Control Center, or Lock Screen.",
    ],
    note: "App Intents are the connection between Spendy and Apple’s system. Quick Add and Scan open the app; spending and budget checks return recorded results. Availability depends on your device and system settings.",
  },
  {
    title: "Less typing. Still your call.",
    text: "A receipt photo or payment screenshot starts a draft. On-device text recognition looks for the total, merchant, and date. You choose the category and account and correct anything missed.",
    steps: [
      "Tap Scan beside Add on Home, or choose a receipt image from the add flow.",
      "Review the amount, date, note, category, and account before adding it.",
      "Keep the text clear. Different layouts and languages can need a manual correction.",
    ],
    note: "On supported iPhones, optional Apple Intelligence assistance selects from amounts already recognised on device. It does not invent a missing total. PhonePe, Paytm, Google Pay, and UPI layouts are supported patterns, with review still required.",
  },
  {
    title: "A glance before you even open it.",
    text: "Keep today’s total, a spending rhythm, budget room, or a category breakdown on your Home Screen. Quick Actions gives you Add, Scan, and Trends.",
    steps: [
      "Touch and hold the iPhone Home Screen, then add a widget.",
      "Search for Spendy and pick a layout and size.",
      "Edit a supported widget’s focus, or tap through to the relevant part of Spendy.",
    ],
    note: "Widgets use the records you keep in Spendy. A total shows recorded activity, rather than a live bank balance.",
  },
  {
    title: "Remember the dates. Keep a copy.",
    text: "Optional notifications cover subscription renewals, weekly spending summaries, and budget thresholds at 80% and 100%. Your accounts, categories, and currency help organise the ledger.",
    steps: [
      "Enable the reminders that are useful to you and allow notifications.",
      "Keep renewal dates and recorded payments up to date.",
      "Export a JSON backup from Settings when you want your own copy.",
    ],
    note: "Voice logging is available inside Spendy too: speak entries such as ‘Groceries 200 and Fuel 500’, then review before saving. Speech recognition depends on permissions and device capabilities; Apple speech services may be used when on-device recognition is unavailable.",
  },
];

export function EverydayTools() {
  const { hash } = useLocation();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(0);
  useEffect(() => {
    const index =
      hash === "#apple-intelligence" ? 1 : ids.indexOf(hash.slice(1));
    if (index >= 0) setSelected(index);
  }, [hash]);
  const topic = copy[selected];
  return (
    <section className="section access-explorer-section" id="access">
      <div className="access-anchors" aria-hidden="true">
        {ids.map((id) => (
          <span key={id} id={id} />
        ))}
        <span id="apple-intelligence" />
      </div>
      <Reveal className="section-heading compact-heading">
        <div>
          <p className="eyebrow">03 / A FEW WAYS IN</p>
          <h2>
            Less friction.
            <br />
            <span className="muted">More everyday.</span>
          </h2>
        </div>
        <p>
          A voice command, a receipt photo, or a tap on a widget. Explore the
          way that fits your day.
        </p>
      </Reveal>
      <FeatureTabs
        id="access-tool"
        label="Ways to use Spendy"
        items={["Siri & Shortcuts", "Scan a receipt", "Widgets", "More ways"]}
        icons={[
          ["/images/siri-orb.png", "/images/apple-shortcuts.png"],
          ["/images/apple-intelligence.png"],
          null,
          null,
        ]}
        selected={selected}
        onSelect={(index) => {
          setSelected(index);
          navigate(`#${ids[index]}`, {
            replace: true,
            state: { preserveScroll: true },
          });
        }}
      />
      <FeaturePanel id="access-tool" selected={selected}>
        <div className="access-explorer">
          <div className="access-art">
            {selected === 0 ? (
              <SiriExample />
            ) : selected === 1 ? (
              <ReceiptExample />
            ) : selected === 2 ? (
              <WidgetExample />
            ) : (
              <div className="access-example extras-example">
                <p className="eyebrow">THE QUIET, USEFUL THINGS</p>
                <div>
                  <span>01</span>
                  <h3>A timely nudge.</h3>
                  <p>Renewals · Weekly summary · Budget alerts</p>
                </div>
                <div>
                  <span>02</span>
                  <h3>Your own copy.</h3>
                  <p>Your entries → JSON backup</p>
                </div>
              </div>
            )}
          </div>
          <div className="access-story">
            <h3>{topic.title}</h3>
            <p>{topic.text}</p>
            <ol className="compact-steps">
              {topic.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <details className="more-details">
              <summary>
                {selected === 0
                  ? "How App Intents connect it"
                  : selected === 1
                    ? "Receipt assistance and accuracy"
                    : selected === 2
                      ? "What widget totals mean"
                      : "Voice logging, too"}
                <span className="disclosure" aria-hidden="true">
                  +
                </span>
              </summary>
              <p>{topic.note}</p>
            </details>
            {selected === 0 && (
              <button
                className="receipt-path"
                type="button"
                onClick={() => navigate("#receipt")}
              >
                <img
                  src="/images/apple-intelligence.png"
                  alt=""
                  width="44"
                  height="44"
                />
                <span>
                  <small>NEXT / RECEIPTS</small>
                  <strong>See how receipt review works</strong>
                  <small>Optional Apple Intelligence assistance</small>
                </span>
                <span className="receipt-path-arrow" aria-hidden="true">↗</span>
              </button>
            )}
          </div>
        </div>
      </FeaturePanel>
    </section>
  );
}
