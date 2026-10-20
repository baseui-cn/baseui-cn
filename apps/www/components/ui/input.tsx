"use client"

import { Input as InputPrimitive } from "@base-ui/react/input"
import type * as React from "react"
import { cn } from "@/lib/utils"

import "@/styles/text-control.styles.css"

export type InputProps = Omit<
  InputPrimitive.Props & React.RefAttributes<HTMLInputElement>,
  "size"
> & {
  size?: "sm" | "default" | "md" | "lg" | number
  unstyled?: boolean
  nativeInput?: boolean
}

export function Input({
  className,
  size = "md",
  unstyled = false,
  nativeInput = false,
  ...props
}: InputProps): React.ReactElement {
  const inputClassName = "input-layout"

  return (
    <span
      className={
        cn(
          "input-control-layout",
          !unstyled && "control-shell-layout border border-input bg-background text-foreground",
          className
        ) || undefined
      }
      data-size={size}
      data-slot="input-control"
    >
      {nativeInput ? (
        (() => {
          const { style, ...rest } = props
          return (
            <input
              className={inputClassName}
              data-slot="input"
              size={typeof size === "number" ? size : undefined}
              style={typeof style === "function" ? undefined : style}
              {...rest}
            />
          )
        })()
      ) : (
        <InputPrimitive
          className={inputClassName}
          data-slot="input"
          size={typeof size === "number" ? size : undefined}
          {...props}
        />
      )}
    </span>
  )
}

export { InputPrimitive }
