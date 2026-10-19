import { mergeProps } from "@base-ui/react"
import { useRender } from "@base-ui/react/use-render"

import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

import "@/styles/badge.styles.css"

const badgeVariants = cva("cn-badge", {
  variants: {
    variant: {
      default: "",
      primary: "",
      "primary-outline": "cn-badge-primary-outline",
      secondary: "cn-badge-secondary",
      destructive: "cn-badge-destructive",
      outline: "cn-badge-outline",
      ghost: "cn-badge-ghost",
      success: "cn-badge-success",
      "success-outline": "cn-badge-success-outline",
      warning: "cn-badge-warning",
      "warning-outline": "cn-badge-warning-outline",
      info: "cn-badge-info",
      "info-outline": "cn-badge-info-outline",
    },
    size: { sm: "cn-badge-sm", default: "", lg: "cn-badge-lg" },
    shape: { default: "", pill: "cn-badge-pill" },
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
