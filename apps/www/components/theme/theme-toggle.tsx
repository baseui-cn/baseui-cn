"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { trackThemeChange } from "@/lib/events"

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "../ui/button"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setMounted(true)
    }, 100)
  }, [])

  const toggle = () => {
    if (!mounted) {
      return
    }

    const next = resolvedTheme === "dark" ? "light" : "dark"
    setTheme(next)
    trackThemeChange(next)
  }

  const isDark = mounted && resolvedTheme === "dark"

  const tooltipLabel = isDark ? "Light mode" : "Dark mode"

  return (
    <Tooltip>
      <TooltipTrigger
        onClick={toggle}
        render={<Button variant="ghost" size="icon-xl" />}
        className="text-muted-foreground hover:text-foreground"
      >
        {isDark ? <Sun aria-hidden="true" size={16} /> : <Moon aria-hidden="true" size={16} />}
        <span className="sr-only">{tooltipLabel}</span>
      </TooltipTrigger>
      <TooltipContent side="left">{tooltipLabel}</TooltipContent>
    </Tooltip>
  )
}
