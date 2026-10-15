import { useId, type ReactNode } from "react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "motion/react";

export function FeatureTabs({
  id,
  label,
  items,
  icons,
  selected,
  onSelect,
}: {
  id: string;
  label: string;
  items: string[];
  icons?: (string[] | null)[];
  selected: number;
  onSelect: (index: number) => void;
}) {
  const group = useId();
  const reduce = useReducedMotion();
  return (
    <LayoutGroup id={group}>
      <div className="feature-tabs" role="tablist" aria-label={label}>
        {items.map((item, index) => (
          <button
            key={item}
            id={`${id}-tab-${index}`}
            role="tab"
            aria-selected={selected === index}
            aria-controls={`${id}-panel`}
            tabIndex={selected === index ? 0 : -1}
            onClick={() => onSelect(index)}
            onKeyDown={(event) => {
              const keys = ["ArrowRight", "ArrowLeft", "Home", "End"];
              if (!keys.includes(event.key)) return;
              event.preventDefault();
              const next =
                event.key === "Home"
                  ? 0
                  : event.key === "End"
                    ? items.length - 1
                    : (index +
                        (event.key === "ArrowRight" ? 1 : -1) +
                        items.length) %
                      items.length;
              onSelect(next);
              document.getElementById(`${id}-tab-${next}`)?.focus();
            }}
          >
            {selected === index && (
              <motion.span
                className="tab-highlight"
                layoutId="active-tab"
                transition={
                  reduce
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 420, damping: 36 }
                }
                aria-hidden="true"
              />
            )}
            {icons?.[index] && (
              <span className="tab-icons" aria-hidden="true">
                {icons[index]?.map((src) => (
                  <img key={src} src={src} alt="" width="24" height="24" />
                ))}
              </span>
            )}
            <span className="tab-label">{item}</span>
          </button>
        ))}
      </div>
    </LayoutGroup>
  );
}

export function FeaturePanel({
  id,
  selected,
  children,
}: {
  id: string;
  selected: number;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <div
      id={`${id}-panel`}
      role="tabpanel"
      aria-labelledby={`${id}-tab-${selected}`}
      tabIndex={0}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={selected}
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.16 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
