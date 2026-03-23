"use client"

import { useEffect } from "react"
import { trackComponentView, trackCTAClick, trackExternalLink } from "@/lib/events"

export function TrackComponentView({ component }: { component: string }) {
  useEffect(() => {
    trackComponentView(component)
  }, [component])
  return null
}

export function TrackCTALink({
  cta,
  href,
  external,
  children,
  className,
}: {
  cta: string
  href: string
  external?: boolean
  children: React.ReactNode
  className?: string
}) {
  return (
    <a
      href={href}
      className={className}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onClick={() => {
        trackCTAClick(cta)
        if (external) trackExternalLink(href)
      }}
    >
      {children}
    </a>
  )
}
