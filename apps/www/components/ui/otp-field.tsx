"use client"

import * as React from "react"
import { OTPFieldPreview as OTPFieldPrimitive } from "@base-ui/react/otp-field"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

type OTPFieldSize = "sm" | "default" | "lg"

export interface OTPFieldProps extends Omit<OTPFieldPrimitive.Root.Props, "className"> {
  className?: string
  size?: OTPFieldSize
}

export interface OTPFieldInputProps
  extends Omit<OTPFieldPrimitive.Input.Props, "className" | "size"> {
  className?: string
  size?: OTPFieldSize
}

export interface OTPFieldSeparatorProps
  extends Omit<OTPFieldPrimitive.Separator.Props, "className"> {
  className?: string
  size?: OTPFieldSize
}

const OTPFieldSizeContext = React.createContext<OTPFieldSize>("default")

const otpFieldRootVariants = cva("flex w-full items-center gap-2")

const otpFieldInputVariants = cva(
  "box-border m-0 rounded-xl border border-input bg-background text-center font-mono font-semibold uppercase text-foreground shadow-xs/5 outline-none transition-[border-color,box-shadow,background-color,color,opacity] placeholder:text-muted-foreground/50 data-[filled]:bg-accent/30 focus-visible:border-ring focus-visible:ring-ring/20 focus-visible:ring-3 data-[invalid]:border-destructive data-[invalid]:ring-destructive/20 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "h-10 w-9 text-base",
        default: "h-11 w-10 text-lg",
        lg: "h-12 w-11 text-xl",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

const otpFieldSeparatorVariants = cva("flex items-center justify-center text-muted-foreground", {
  variants: {
    size: {
      sm: "w-3 text-xs",
      default: "w-4 text-sm",
      lg: "w-5 text-base",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

export function OTPField({
  className,
  size = "default",
  ...props
}: OTPFieldProps): React.ReactElement {
  return (
    <OTPFieldSizeContext.Provider value={size}>
      <OTPFieldPrimitive.Root
        className={cn(otpFieldRootVariants(), className)}
        data-size={size}
        data-slot="otp-field"
        {...props}
      />
    </OTPFieldSizeContext.Provider>
  )
}

export function OTPFieldInput({
  className,
  size,
  ...props
}: OTPFieldInputProps): React.ReactElement {
  const inheritedSize = React.useContext(OTPFieldSizeContext)

  return (
    <OTPFieldPrimitive.Input
      className={cn(otpFieldInputVariants({ size: size ?? inheritedSize }), className)}
      data-slot="otp-field-input"
      {...props}
    />
  )
}

export function OTPFieldSeparator({
  className,
  size,
  ...props
}: OTPFieldSeparatorProps): React.ReactElement {
  const inheritedSize = React.useContext(OTPFieldSizeContext)

  return (
    <OTPFieldPrimitive.Separator
      className={cn(otpFieldSeparatorVariants({ size: size ?? inheritedSize }), className)}
      data-slot="otp-field-separator"
      {...props}
    />
  )
}

export { OTPFieldPrimitive }
