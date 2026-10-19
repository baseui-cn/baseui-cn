"use client"

import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import type React from "react"
import { cn } from "@/lib/utils"

export function Label({
  className,
  render,
  ...props
}: useRender.ComponentProps<"label">): React.ReactElement {
  const defaultProps = {
    className: cn(
      "inline-flex items-center gap-[calc(6*var(--cn-unit))] font-medium text-[length:calc(14*var(--cn-unit))] leading-[calc(20*var(--cn-unit))] text-[var(--cn-text)]",
      className
    ),
    "data-slot": "label",
  }

  return useRender({
    defaultTagName: "label",
    props: mergeProps<"label">(defaultProps, props),
    render,
  })
}
