import { motion } from "motion/react";
import { useSiteReducedMotion } from "../AnimationPreferences";

// Original pen strokes: no font download, image, or animation loop.
const strokes = [
  "M35 91 C39 72 48 44 57 25 C60 19 62 21 60 29 L42 86 M48 52 C72 53 93 42 91 29 C89 14 64 14 49 26",
  "M79 69 C73 59 61 64 59 77 C57 88 68 90 77 75 L81 64 C77 78 77 87 84 84 L94 76",
  "M94 76 L101 63 C97 74 96 86 101 87 C105 88 114 75 119 64 C117 74 123 79 132 73",
  "M151 68 C146 59 133 63 130 77 C128 89 139 90 148 75 L152 63 C148 79 149 87 156 84 L166 76",
  "M166 76 L173 63 L166 85 C177 64 185 62 186 68 C186 73 178 85 184 86 C191 88 207 76 220 68",
  "M62 102 C108 94 170 93 228 96",
];

export function PavanSignature() {
  const reduce = useSiteReducedMotion();
  return <svg className="pavan-signature" viewBox="15 0 240 120" role="img" aria-label="Signed, Pavan">
    {strokes.map((stroke, index) => <motion.path key={stroke} d={stroke}
      fill="none" stroke="currentColor" strokeWidth={index === 5 ? 1.2 : 2.2}
      strokeLinecap="round" strokeLinejoin="round"
      initial={reduce ? false : { pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true, amount: .8 }}
      transition={{ duration: reduce ? 0 : index === 0 ? .6 : .35, delay: reduce ? 0 : index * .3, ease: "easeInOut" }} />)}
  </svg>;
}
