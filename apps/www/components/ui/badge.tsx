import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center w-fit whitespace-nowrap shrink-0 gap-1 rounded-md border border-transparent px-2 py-0.5 text-xs font-medium transition-all overflow-hidden [&>svg]:size-3 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground",
        secondary:
          "bg-secondary text-secondary-foreground",
        destructive:
          "bg-destructive text-destructive-foreground focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "border-border text-foreground",
        ghost:
          "hover:bg-muted hover:text-muted-foreground",
        success:
          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        warning:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
        info:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      },
      size: {
        sm:      "h-4 px-1 text-[0.7rem]",
        default: "h-5 px-2 text-xs",
        lg:      "h-6 px-2.5 text-xs",
      },
      shape: {
        default: "rounded-md",
        pill:    "rounded-full",
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
