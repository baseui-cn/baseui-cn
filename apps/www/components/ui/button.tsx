"use client"

import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import type * as React from "react"
import { cn } from "@/lib/utils"
import { Spinner } from "@/components/ui/spinner"

import "@/styles/button.styles.css"

// Layout CSS owns measured size aliases and icon slots; theme colors live here.
export const buttonVariants = cva(
  [
    "button-layout border border-transparent focus-visible:outline-ring disabled:border-border disabled:bg-muted",
    "disabled:text-muted-foreground data-[disabled]:border-border data-[disabled]:bg-muted data-[disabled]:text-muted-foreground",
    "aria-disabled:border-border aria-disabled:bg-muted aria-disabled:text-muted-foreground data-[loading]:text-transparent",
  ],
  {
    defaultVariants: { size: "default", variant: "default" },
    variants: {
      size: {
        default: "",
        md: "",
        xs: "button-xs-layout",
        sm: "button-sm-layout",
        lg: "button-lg-layout",
        xl: "button-xl-layout",
        icon: "button-icon-layout",
        "icon-xs": "button-icon-xs-layout",
        "icon-sm": "button-icon-sm-layout",
        "icon-lg": "button-icon-lg-layout",
        "icon-xl": "button-icon-xl-layout",
      },
      variant: {
        default:
          "bg-primary text-primary-foreground [@media(hover:hover)]:enabled:hover:bg-primary/90 enabled:active:bg-primary/95",
        destructive:
          "bg-destructive text-destructive-foreground [@media(hover:hover)]:enabled:hover:bg-destructive/90 enabled:active:bg-destructive/95",
        "destructive-outline":
          "border-destructive bg-background text-destructive [@media(hover:hover)]:enabled:hover:bg-destructive/10 enabled:active:bg-destructive/15",
        ghost:
          "bg-transparent text-foreground [@media(hover:hover)]:enabled:hover:bg-muted enabled:active:bg-secondary",
        link: "bg-transparent text-foreground underline-offset-4 [@media(hover:hover)]:enabled:hover:underline enabled:active:underline",
        outline:
          "button-outline-layout border-input bg-background text-foreground [@media(hover:hover)]:enabled:hover:bg-muted enabled:active:bg-secondary",
        secondary:
          "bg-secondary text-secondary-foreground [@media(hover:hover)]:enabled:hover:bg-muted enabled:active:bg-secondary/80",
        warning:
          "bg-warning text-warning-foreground [@media(hover:hover)]:enabled:hover:bg-warning/90 enabled:active:bg-warning/95",
      },
    },
  }
)

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
            className="loading-spinner pointer-events-none absolute text-muted-foreground"
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
