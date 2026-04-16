import * as React from "react"

import { cn } from "@/lib/utils"

export interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
  size?: "sm" | "md" | "lg"
}

const sizeConfig = {
  sm: {
    wrap: "gap-2 px-4 py-8",
    icon: "size-10",
    title: "text-sm",
    desc: "text-xs",
  },
  md: {
    wrap: "gap-3 px-6 py-12",
    icon: "size-12",
    title: "text-base",
    desc: "text-sm",
  },
  lg: {
    wrap: "gap-4 px-8 py-20",
    icon: "size-16",
    title: "text-lg",
    desc: "text-sm",
  },
} as const

function EmptyState({ icon, title, description, action, className, size = "md" }: EmptyStateProps) {
  const s = sizeConfig[size]

  return (
    <div className={cn("flex flex-col items-center justify-center text-center", s.wrap, className)}>
      {icon && (
        <div
          className={cn(
            "flex items-center justify-center rounded-full bg-muted text-muted-foreground",
            s.icon
          )}
        >
          {icon}
        </div>
      )}
      <div className="flex flex-col gap-1">
        <h3 className={cn("font-semibold text-foreground", s.title)}>{title}</h3>
        {description && <p className={cn("text-muted-foreground", s.desc)}>{description}</p>}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  )
}

const EmptyStateIcons = {
  inbox: (
    <svg className="size-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path
        d="M3 8l7-5 7 5v9a1 1 0 01-1 1H4a1 1 0 01-1-1V8z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M7 18V10h6v8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  search: (
    <svg className="size-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="8.5" cy="8.5" r="5" />
      <path d="M15 15l2.5 2.5" strokeLinecap="round" />
    </svg>
  ),
  folder: (
    <svg className="size-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path
        d="M3 7a2 2 0 012-2h3l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  users: (
    <svg className="size-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="7" cy="7" r="3" />
      <path d="M1 17c0-3.314 2.686-6 6-6" strokeLinecap="round" />
      <circle cx="13" cy="7" r="3" />
      <path d="M13 11a6 6 0 016 6" strokeLinecap="round" />
    </svg>
  ),
}

export { EmptyState, EmptyStateIcons }
