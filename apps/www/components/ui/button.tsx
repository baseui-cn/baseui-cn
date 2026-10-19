"use client"

import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import type * as React from "react"
import { cn } from "@/lib/utils"
import { Spinner } from "@/components/ui/spinner"

import "@/styles/button.styles.css"

export const buttonVariants = cva("cn-button", {
  defaultVariants: { size: "default", variant: "default" },
  variants: {
    size: {
      default: "cn-button-default",
      md: "cn-button-md",
      xs: "cn-button-xs",
      sm: "cn-button-sm",
      lg: "cn-button-lg",
      xl: "cn-button-xl",
      icon: "cn-button-icon",
      "icon-xs": "cn-button-icon-xs",
      "icon-sm": "cn-button-icon-sm",
      "icon-lg": "cn-button-icon-lg",
      "icon-xl": "cn-button-icon-xl",
    },
    variant: {
      default: "cn-button-default-variant",
      destructive: "cn-button-destructive",
      "destructive-outline": "cn-button-destructive-outline",
      ghost: "cn-button-ghost",
      link: "cn-button-link",
      outline: "cn-button-outline",
      secondary: "cn-button-secondary",
      warning: "cn-button-warning",
    },
  },
})

export interface ButtonProps extends useRender.ComponentProps<"button"> {
  variant?: VariantProps<typeof buttonVariants>["variant"]
  size?: VariantProps<typeof buttonVariants>["size"]
  loading?: boolean
}

export function Button({
  className,
  variant,
  size,
  render,
  children,
  loading = false,
  disabled: disabledProp,
  ...props
}: ButtonProps): React.ReactElement {
  const isDisabled: boolean = Boolean(loading || disabledProp)
  const typeValue: React.ButtonHTMLAttributes<HTMLButtonElement>["type"] = render
    ? undefined
    : "button"

  const defaultProps = {
    children: (
      <>
        {children}
        {loading && (
          <Spinner
            className="cn-loading pointer-events-none absolute"
            data-slot="button-loading-indicator"
          />
        )}
      </>
    ),
    className: cn(buttonVariants({ className, size, variant })),
    "aria-disabled": loading || undefined,
    "data-loading": loading ? "" : undefined,
    "data-slot": "button",
    disabled: isDisabled,
    type: typeValue,
  }

  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(defaultProps, props),
    render,
  })
}
