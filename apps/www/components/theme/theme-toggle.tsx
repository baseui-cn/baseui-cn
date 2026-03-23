"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "../ui/button";

export function ThemeToggle() {
  const [system, setSystem] = useState(false);

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

    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  const isDark = mounted && resolvedTheme === "dark"


  const tooltipLabel = isDark
    ? "Light mode"
    : "Dark mode";

  return (
    <Tooltip>
      <TooltipTrigger
        onClick={toggle}
        render={
          <Button variant="ghost" size="icon" />
        }
        className="inline-flex size-7 cursor-pointer items-center justify-center rounded-md border-none bg-transparent text-muted-foreground/80 outline-none transition-[color,box-shadow] hover:text-foreground/80 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        {isDark ? <Sun aria-hidden="true" size={16} /> : <Moon aria-hidden="true" size={16} />}
        <span className="sr-only">{tooltipLabel}</span>
      </TooltipTrigger>
      <TooltipContent side="left">{tooltipLabel}</TooltipContent>
    </Tooltip>
  );
};
