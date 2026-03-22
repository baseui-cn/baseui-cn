import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({
  className,
  type,
  variant = "md",
  ...props
}: React.ComponentProps<"input"> & { variant?: "sm" | "md" | "lg" }) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/50 border-input h-9 w-full min-w-0 rounded-lg border bg-input/30 px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-primary focus-visible:ring-primary/30 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        variant === "sm" &&
          "h-8 px-2 py-1 text-[16px] lg:text-sm file:h-6 file:text-[16px] lg:file:text-sm",
        variant === "md" &&
          "h-9 px-3 py-2 text-[16px] lg:text-sm file:h-7 file:text-[16px] lg:file:text-sm",
        variant === "lg" &&
          "h-10 px-4 py-2 text-[16px] lg:text-base file:h-9 file:text-[16px] lg:file:text-base",
        className
      )}
      {...props}
    />
  )
}

export { Input }
