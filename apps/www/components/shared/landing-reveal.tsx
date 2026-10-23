import type React from "react"

// Content is visible immediately, including before hydration and with reduced motion.
export function LandingReveal({
  children,
  className,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  return <div className={className}>{children}</div>
}
