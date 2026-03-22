"use client";

import { useTheme } from "next-themes";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const DEFAULT_THEME = "dark";

interface ThemeContextType {
  activeTheme: string;
  setActiveTheme: (theme: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ActiveThemeProvider = ({
  children,
  initialTheme,
}: {
  children: ReactNode;
  initialTheme?: string;
}) => {
  const [activeTheme, setActiveTheme] = useState<string>(
    () => initialTheme || DEFAULT_THEME
  );
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Run once to avoid hydration mismatch
  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 100);
  }, []);

  // ✅ Save theme to cookie only when it *actually changes*
  useEffect(() => {
    if (!mounted) {
      return;
    }

    const currentCookie = document.cookie.match(/active_theme=([^;]+)/)?.[1];
    if (currentCookie !== activeTheme) {
      document.cookie = `active_theme=${activeTheme}; path=/; max-age=${60 * 60 * 24 * 365
        }`; // 1 year
    }
  }, [activeTheme, mounted]);

  // ✅ Apply color theme classes safely (no loop with next-themes)
  useEffect(() => {
    if (!mounted) {
      return;
    }

    const applyThemeClasses = () => {
      // Remove previous theme classes from body
      Array.from(document.body.classList)
        .filter(
          (className) =>
            className.startsWith("theme-") && !className.includes("scaled")
        )
        .forEach((className) => {
          document.body.classList.remove(className);
        });

      // Add theme class if it's not "default"
      if (activeTheme !== "default") {
        document.body.classList.add(`theme-${activeTheme}`);
      }

      // Add scaled helper if needed
      if (activeTheme.endsWith("-scaled")) {
        document.body.classList.add("theme-scaled");
      }
    };

    applyThemeClasses();

    // 🔒 Important: don’t depend on `resolvedTheme` — it triggers a re-render loop
    // next-themes updates it internally, and we only care about our local `activeTheme`
  }, [activeTheme, mounted]);

  return (
    <ThemeContext.Provider value={{ activeTheme, setActiveTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeConfig = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error(
      "useThemeConfig must be used within an ActiveThemeProvider"
    );
  }
  return context;
};
