import { mergeProps } from "@base-ui/react"
import { useRender } from "@base-ui/react/use-render"

import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

import "@/styles/badge.styles.css"

const badgeVariants = cva("badge-layout", {
  variants: {
    variant: {
      default: "",
      primary: "",
      "primary-outline": "badge-primary-outline-layout",
      secondary: "badge-secondary-layout",
      destructive: "badge-destructive-layout",
      outline: "badge-outline-layout",
      ghost: "badge-ghost-layout",
      success: "badge-success-layout",
      "success-outline": "badge-success-outline-layout",
      warning: "badge-warning-layout",
      "warning-outline": "badge-warning-outline-layout",
      info: "badge-info-layout",
      "info-outline": "badge-info-outline-layout",
    },
    size: { sm: "badge-sm-layout", default: "", lg: "badge-lg-layout" },
    shape: { default: "", pill: "badge-pill-layout" },
  },
  defaultVariants: { variant: "default", size: "default", shape: "default" },
})

function Badge({
  className,
  variant = "default",
  size = "default",
  shape = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      { className: cn(badgeVariants({ variant, size, shape }), className) },
      props
    ),
    render,
    state: { slot: "badge", variant, size, shape },
  })
}

export { Badge, badgeVariants }
