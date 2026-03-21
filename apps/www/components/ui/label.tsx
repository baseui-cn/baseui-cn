import * as React from "react"
import { Field } from "@base-ui/react/field"
import { cn } from "@/lib/utils"

export interface LabelProps extends React.ComponentPropsWithoutRef<typeof Field.Label> {
  required?: boolean
}

const Label = React.forwardRef<
  React.ElementRef<typeof Field.Label>,
  LabelProps
>(({ className, children, required, ...props }, ref) => (
  <Field.Label
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none text-foreground",
      "data-disabled:cursor-not-allowed data-disabled:opacity-70",
      className
    )}
    {...props}
  >
    {children}
    {required && (
      <span className="ml-1 text-destructive" aria-hidden="true">*</span>
    )}
  </Field.Label>
))
Label.displayName = "Label"

export { Label }
