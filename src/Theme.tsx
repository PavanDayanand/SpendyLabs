import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Theme = "light" | "dark";
const ThemeContext = createContext<{ theme: Theme; toggleTheme: () => void } | null>(null);

function savedTheme(): Theme | null {
  try {
    const value = localStorage.getItem("spendy-theme");
    return value === "light" || value === "dark" ? value : null;
  } catch { return null; }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => savedTheme() ??
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#111111" : "#f3f3f3");
  }, [theme]);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-color-scheme: dark)");
    const followDevice = () => {
      if (!savedTheme()) setTheme(preference.matches ? "dark" : "light");
    };
    preference.addEventListener("change", followDevice);
    return () => preference.removeEventListener("change", followDevice);
  }, []);

  function toggleTheme() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    try { localStorage.setItem("spendy-theme", next); } catch { /* Theme still works without storage. */ }
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme needs ThemeProvider");
  return context;
}

// Every variant is a real capture, rather than a CSS filter on a light image.
export function themedScreenshot(src: string, theme: Theme) {
  return theme === "dark" ? src.replace(/\.png$/, "-dark.png") : src;
}
