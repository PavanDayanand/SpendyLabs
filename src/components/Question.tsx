import { useId, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { useSiteReducedMotion } from "../AnimationPreferences";

export function Question({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const reduce = useSiteReducedMotion();
  return <div className="motion-question">
    <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
      <span>{title}</span><motion.span aria-hidden="true" animate={{ rotate: open ? 45 : 0 }} transition={{ duration: reduce ? 0 : .2 }}><Plus size={18} /></motion.span>
    </button>
    <AnimatePresence initial={false}>{open && <motion.div id={id} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reduce ? 0 : .23 }} style={{ overflow: "hidden" }}><div className="motion-question-answer">{children}</div></motion.div>}</AnimatePresence>
  </div>;
}
