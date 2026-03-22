"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "../ui/button";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [system, setSystem] = useState(false);

  const smartToggle = () => {
    const prefersDarkScheme = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    if (theme === "system") {
      setTheme(prefersDarkScheme ? "light" : "dark");
      setSystem(false);
    } else if (
      (theme === "light" && !prefersDarkScheme) ||
      (theme === "dark" && prefersDarkScheme)
    ) {
      setTheme(theme === "light" ? "dark" : "light");
      setSystem(false);
    } else {
      setTheme("system");
      setSystem(true);
    }
  };

  const tooltipLabel = system
    ? "System theme"
    : theme === "dark"
      ? "Dark mode"
      : "Light mode";

  return (
    <Tooltip>
      <TooltipTrigger
        onClick={smartToggle}
        render={
          <Button variant="ghost" size="icon" />
        }
        className="inline-flex size-7 cursor-pointer items-center justify-center rounded-md border-none bg-transparent text-muted-foreground/80 outline-none transition-[color,box-shadow] hover:text-foreground/80 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        <Sun aria-hidden="true" className="dark:hidden" size={16} />
        <Moon
          aria-hidden="true"
          className="hidden dark:block"
          size={16}
        />
        <span className="sr-only">{tooltipLabel}</span>
      </TooltipTrigger>
      <TooltipContent side="bottom">{tooltipLabel}</TooltipContent>
    </Tooltip>
  );
}
