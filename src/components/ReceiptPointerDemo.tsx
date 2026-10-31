import { useSiteReducedMotion } from "../AnimationPreferences";
import { useEffect, useRef, useState } from "react";
import { ShowcasePointer, type CursorConfig } from "./showcase-pointer";
import "./receipt-pointer-demo.css";

const cursors: CursorConfig[] = [{
  id: "receipt-guide", name: "You", color: "#171717",
  start: { x: "12%", y: "80%" },
  script: [
    { action: "enter" },
    { action: "hover", target: "[data-demo-receipt]" },
    { action: "say", text: "Check total", duration: 1400 },
    { action: "hover", target: { target: "[data-demo-category]", x: 0.2 } },
    { action: "click", target: { target: "[data-demo-category]", x: 0.2 } },
    { action: "wait", duration: 900 },
    { action: "hover", target: { target: "[data-demo-add]", x: 0.2 } },
    { action: "click", target: { target: "[data-demo-add]", x: 0.2 } },
    { action: "say", text: "Added", duration: 1600 },
    { action: "wait", duration: 1600 },
    { action: "leave" },
  ],
}];

export default function ReceiptPointerDemo() {
  const [category, setCategory] = useState(false);
  const [added, setAdded] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [visible, setVisible] = useState(false);
  const [replay, setReplay] = useState(0);
  const host = useRef<HTMLDivElement>(null);
  const reduce = useSiteReducedMotion();
  useEffect(() => {
    if (!host.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
      if (entry.isIntersecting) { setCategory(false); setAdded(false); }
    });
    observer.observe(host.current);
    return () => observer.disconnect();
  }, []);
  const reset = () => { setCategory(false); setAdded(false); };
  const preview = (
    <div className="receipt-demo-stage">
      <div className="sample-receipt" data-demo-receipt>
        <span>THE EVERYDAY CAFÉ</span>
        <i /><i /><i />
        <div><span>Total</span><strong>₹750</strong></div>
      </div>
      <div className="receipt-demo-review">
        <span>Review expense</span>
        <strong>₹750</strong>
        <button type="button" data-demo-category aria-pressed={category}
          onClick={() => { setCategory(value => !value); setAdded(false); }}>
          <span>Category</span><strong>{category ? "Food & drink" : "Choose category"}</strong>
        </button>
        <p>Account · Cash</p>
        <button type="button" data-demo-add data-added={added || undefined} disabled={!category || added}
          onClick={() => setAdded(true)}>{added ? "Added to demo ✓" : "Add expense"}</button>
      </div>
    </div>
  );
  return (
    <div className="access-example scan-example receipt-pointer-demo" ref={host}>
      <div className="demo-topline"><span>PHOTO → REVIEW → RECORD</span><span>INTERACTIVE EXAMPLE</span></div>
      <div className="receipt-assist"><div><strong>Review before you add.</strong><span>Review the total, choose a category, then add the expense.</span></div></div>
      {visible && playing && !reduce ? (
        <ShowcasePointer key={replay} cursors={cursors} height="auto" idleDrift={0} loopDelay={1800}
          onCycle={reset}
          onCursorPress={({ target }) => {
            if (target.closest("[data-demo-category]")) { setCategory(true); setAdded(false); }
            if (target.closest("[data-demo-add]")) setAdded(true);
          }}>{preview}</ShowcasePointer>
      ) : preview}
      <div className="demo-footer receipt-demo-footer">
        <span>Example only · nothing is saved.</span>
        <div>
          {!reduce && <button type="button" aria-pressed={playing} onClick={() => {
            reset(); setPlaying(value => !value);
          }}>{playing ? "Pause tour" : "Play tour"}</button>}
          <button type="button" onClick={() => { reset(); setReplay(value => value + 1); }}>Replay ↻</button>
        </div>
      </div>
    </div>
  );
}
