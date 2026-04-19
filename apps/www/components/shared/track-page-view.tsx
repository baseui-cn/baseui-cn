"use client"

import { useEffect } from "react"
import { trackComponentView, trackCTAClick, trackExternalLink } from "@/lib/events"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Icons } from "./icons"

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
  className,
}: {
  cta: string
  href: string
  external?: boolean
  className?: string
}) {
  return (
    <Button
      variant="outline"
      render={
        <Link
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          onClick={() => {
            trackCTAClick(cta)
            if (external) trackExternalLink(href)
          }}
        />
      }
      className={className}
    >
      <Icons.github className="size-4" />
      Star on GitHub
    </Button>
  )
}
