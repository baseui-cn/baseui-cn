"use client"

import { Field as FieldPrimitive } from "@base-ui/react/field"
import { mergeProps } from "@base-ui/react/merge-props"
import type * as React from "react"
import { cn } from "@/lib/utils"

import "@/styles/text-control.styles.css"

export type TextareaProps = React.ComponentPropsWithoutRef<"textarea"> &
  React.RefAttributes<HTMLTextAreaElement> & {
    size?: "sm" | "default" | "lg" | number
    unstyled?: boolean
  }

export function Textarea({
  className,
  size = "default",
  unstyled = false,
  ref,
  ...props
}: TextareaProps): React.ReactElement {
  return (
    <span
      className={
        cn(
          "textarea-control-layout",
          !unstyled && "control-shell-layout border border-input bg-background text-foreground",
          className
        ) || undefined
      }
      data-size={size}
      data-slot="textarea-control"
    >
      <FieldPrimitive.Control
        ref={ref}
        value={props.value}
        defaultValue={props.defaultValue}
        disabled={props.disabled}
        id={props.id}
        name={props.name}
        render={(defaultProps: React.ComponentProps<"textarea">) => (
          <textarea
            className="textarea-layout"
            data-slot="textarea"
            {...mergeProps(defaultProps, props)}
          />
        )}
      />
    </span>
  )
}

export { FieldPrimitive }
