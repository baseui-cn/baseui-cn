"use client"

import type React from "react"
import { type MotionProps, motion } from "motion/react"
import { useEffect, useMemo, useState } from "react"
import { cn } from "@/lib/utils"

interface AnimatedSpanProps extends MotionProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

export function AnimatedSpan({
  children,
  delay = 0,
  className,
  ...props
}: AnimatedSpanProps): React.ReactElement {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, delay: delay / 1000 }}
      className={cn("grid text-sm tracking-tight", className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}

interface TypingAnimationProps extends MotionProps {
  children: string
  className?: string
  duration?: number
  delay?: number
}

export function TypingAnimation({
  children,
  className,
  duration = 36,
  delay = 0,
  ...props
}: TypingAnimationProps): React.ReactElement {
  const [displayedText, setDisplayedText] = useState("")
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const startTimeout = window.setTimeout(() => {
      setStarted(true)
    }, delay)

    return () => window.clearTimeout(startTimeout)
  }, [delay])

  useEffect(() => {
    if (!started) return

    let index = 0
    const typingEffect = window.setInterval(() => {
      if (index < children.length) {
        setDisplayedText(children.slice(0, index + 1))
        index += 1
        return
      }

      window.clearInterval(typingEffect)
    }, duration)

    return () => window.clearInterval(typingEffect)
  }, [children, duration, started])

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn("text-sm tracking-tight", className)}
      {...props}
    >
      {displayedText}
    </motion.span>
  )
}

interface TerminalProps {
  children: React.ReactNode
  className?: string
  title?: string
}

export function Terminal({
  children,
  className,
  title = "terminal",
}: TerminalProps): React.ReactElement {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border/70 bg-[linear-gradient(180deg,hsl(var(--card))_0%,hsl(var(--background))_100%)] shadow-lg shadow-black/5",
        className
      )}
    >
      <div className="flex items-center gap-3 border-b border-border/70 px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-destructive/70" />
          <span className="size-2.5 rounded-full bg-warning/80" />
          <span className="size-2.5 rounded-full bg-success/80" />
        </div>
        <span className="font-mono text-xs text-muted-foreground">{title}</span>
      </div>
      <pre className="overflow-x-auto p-4">
        <code className="grid gap-y-1.5 font-mono text-sm">{children}</code>
      </pre>
    </div>
  )
}

interface TerminalLine {
  text: string
  delay?: number
  kind?: "command" | "success" | "muted" | "info"
  typing?: boolean
}

const lineStyles: Record<NonNullable<TerminalLine["kind"]>, string> = {
  command: "text-foreground",
  info: "text-primary",
  muted: "text-muted-foreground",
  success: "text-success",
}

export function LandingTerminalDemo(): React.ReactElement {
  const lines = useMemo<TerminalLine[]>(
    () => [
      { text: "$ npx baseui-cn init", delay: 0, kind: "command", typing: true },
      { text: "Detecting project structure...", delay: 950, kind: "muted" },
      { text: "Found app router, Tailwind, and src aliases.", delay: 1350, kind: "muted" },
      { text: "[ok] @base-ui/react installed", delay: 1800, kind: "success" },
      { text: "[ok] Theme tokens added to your stylesheet", delay: 2200, kind: "success" },
      { text: "[ok] lib/utils.ts created", delay: 2600, kind: "success" },
      { text: "$ npx baseui-cn add login data-grid command", delay: 3300, kind: "command", typing: true },
      { text: "Resolving dependencies...", delay: 4700, kind: "muted" },
      { text: "[ok] login -> components/ui/auth.tsx", delay: 5200, kind: "success" },
      { text: "[ok] data-grid -> components/data-grid/*", delay: 5600, kind: "success" },
      { text: "[ok] command -> components/ui/command.tsx", delay: 6000, kind: "success" },
      { text: "Done. One primitive library, zero portal conflicts.", delay: 6600, kind: "info" },
    ],
    []
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <Terminal className="w-full" title="baseui-cn cli">
        {lines.map((line) =>
          line.typing ? (
            <div key={line.text} className={cn("flex gap-3", lineStyles[line.kind ?? "command"])}>
              <TypingAnimation delay={line.delay} className="font-mono">
                {line.text}
              </TypingAnimation>
            </div>
          ) : (
            <AnimatedSpan
              key={line.text}
              delay={line.delay}
              className={cn("font-mono", lineStyles[line.kind ?? "muted"])}
            >
              {line.text}
            </AnimatedSpan>
          )
        )}
      </Terminal>
    </motion.div>
  )
}
