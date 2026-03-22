"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = React.useState<"light" | "dark">("light")

  React.useEffect(() => {
    const stored = localStorage.getItem("theme") as "light" | "dark" | null
    const system = window.matchMedia("(prefers-color-scheme: dark)").matches
    const initial = stored ?? (system ? "dark" : "light")
    setTheme(initial)
    document.documentElement.classList.toggle("dark", initial === "dark")
  }, [])

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light"
    setTheme(next)
    document.documentElement.classList.toggle("dark", next === "dark")
    localStorage.setItem("theme", next)
  }

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-md",
        "text-muted-foreground hover:text-foreground hover:bg-accent transition-colors",
        className
      )}
    >
      {/* Sun icon */}
      <svg
        className={cn("h-4 w-4 transition-all", theme === "dark" ? "scale-0 absolute" : "scale-100")}
        viewBox="0 0 16 16" fill="none"
      >
        <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.05 3.05l1.06 1.06M11.89 11.89l1.06 1.06M11.89 3.05l-1.06 1.06M3.05 11.89l1.06-1.06"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
      {/* Moon icon */}
      <svg
        className={cn("h-4 w-4 transition-all", theme === "light" ? "scale-0 absolute" : "scale-100")}
        viewBox="0 0 16 16" fill="none"
      >
        <path d="M13.5 9.5A6 6 0 016.5 2.5a6 6 0 100 11 6 6 0 007-4z"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  )
}
