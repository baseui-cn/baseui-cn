import { mergeProps } from "@base-ui/react"
import { useRender } from "@base-ui/react/use-render"

import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center w-fit whitespace-nowrap shrink-0 gap-1 rounded-md border border-transparent px-2 py-0.5 text-xs font-medium transition-all overflow-hidden [&>svg]:size-3 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        primary: "bg-primary text-primary-foreground",
        "primary-outline":
          "border-primary text-primary hover:bg-primary/10 data-[state=open]:bg-primary/10",
        secondary: "bg-secondary text-secondary-foreground",
        destructive:
          "bg-destructive text-destructive-foreground focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline: "border-border text-foreground",
        ghost: "hover:bg-muted hover:text-muted-foreground",
        success: "border-success/20 bg-success text-success-foreground",
        "success-outline":
          "border-success/30 bg-success/10 text-success hover:bg-success/15 data-[state=open]:bg-success/15",
        warning: "border-warning/20 bg-warning text-warning-foreground",
        "warning-outline":
          "border-warning/30 bg-warning/10 text-warning hover:bg-warning/15 data-[state=open]:bg-warning/15",
        info: "border-info/20 bg-info text-info-foreground",
        "info-outline":
          "border-info/30 bg-info/10 text-info hover:bg-info/15 data-[state=open]:bg-info/15",
      },
      size: {
        sm: "h-4 px-1 text-[0.7rem]",
        default: "h-5 px-2 text-xs",
        lg: "h-6 px-2.5 text-xs",
      },
      shape: {
        default: "rounded-md",
        pill: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "default",
    },
  }
)

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
