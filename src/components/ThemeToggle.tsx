import { AnimatePresence, motion } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../Theme";
import { useSiteReducedMotion } from "../AnimationPreferences";

export function ThemeToggle({ showLabel = false }: { showLabel?: boolean }) {
  const { theme, toggleTheme } = useTheme();
  const reduce = useSiteReducedMotion();
  const next = theme === "light" ? "dark" : "light";
  return <motion.button className={`appearance-toggle${showLabel ? " appearance-toggle-labeled" : ""}`}
    type="button" onClick={toggleTheme} aria-label={`Switch to ${next} mode`} title={`Switch to ${next} mode`}
    whileTap={reduce ? undefined : { scale: .92 }}>
    <span className="appearance-toggle-icon" aria-hidden="true">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={theme} initial={reduce ? false : { opacity: 0, rotate: -45, scale: .6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }} exit={{ opacity: 0, rotate: reduce ? 0 : 45, scale: reduce ? 1 : .6 }}
          transition={{ duration: reduce ? 0 : .14 }}>
          {theme === "light" ? <Moon size={19} strokeWidth={1.6} /> : <Sun size={19} strokeWidth={1.6} />}
        </motion.span>
      </AnimatePresence>
    </span>
    {showLabel && <span>{next === "dark" ? "Dark mode" : "Light mode"}</span>}
  </motion.button>;
}
