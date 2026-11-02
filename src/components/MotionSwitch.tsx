import { useId, type ReactNode } from "react";
import { LayoutGroup, motion } from "motion/react";
import { useSiteReducedMotion } from "../AnimationPreferences";

// A shared sliding highlight. State stays in the parent that owns the choice.
export function MotionSwitch({ value, options, label, onChange }: {
  value: string;
  options: { value: string; label: string; icon?: ReactNode }[];
  label: string;
  onChange: (value: string) => void;
}) {
  const id = useId();
  const reduce = useSiteReducedMotion();
  return (
    <LayoutGroup id={id}>
      <div className="motion-switch" role="group" aria-label={label}>
        {options.map((option) => (
          <motion.button whileTap={reduce ? undefined : { scale: .96 }} key={option.value} type="button" aria-pressed={value === option.value}
            aria-label={option.label} onClick={() => onChange(option.value)}>
            {value === option.value && <motion.span className="motion-switch-highlight"
              layoutId="selection" transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 440, damping: 34 }} />}
            <span className="motion-switch-label">
              {option.icon && <span aria-hidden="true">{option.icon}</span>}
              <span className={option.icon ? "theme-option-text" : undefined}>{option.label}</span>
            </span>
          </motion.button>
        ))}
      </div>
    </LayoutGroup>
  );
}
