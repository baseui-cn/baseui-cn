"use client"

import * as React from "react"
import { AlertTriangle, Check, Circle, Eye, EyeOff, Sparkles } from "lucide-react"
import { z } from "zod"

import { Icons } from "@/components/shared/icons"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"

export type AuthBlockVariant = "default" | "bordered" | "elevated" | "minimal"
export type AuthBlockSize = "sm" | "md" | "lg"
export type AuthBlockAnimation = "none" | "fade" | "slide-up" | "scale"

export interface AuthSuccessToast {
  title?: string
  description?: string
  timeout?: number
}

export interface AuthSubmitResult<TField extends string = string> {
  status: "success" | "error"
  message?: string
  fieldErrors?: Partial<Record<TField, string | string[]>>
}

export interface LoginValues {
  email: string
  password: string
}

export interface SignupValues {
  name: string
  email: string
  password: string
  confirmPassword: string
  terms: boolean
}

type AuthErrors<TValues extends object> = Partial<Record<keyof TValues & string, string | string[]>>

interface AuthBlockBaseProps {
  title?: string
  description?: string
  className?: string
  variant?: AuthBlockVariant
  size?: AuthBlockSize
  animation?: AuthBlockAnimation
  showSocial?: boolean
  onGoogleLogin?: () => void
  onGithubLogin?: () => void
  successToast?: AuthSuccessToast
}

export interface LoginBlockProps extends AuthBlockBaseProps {
  onSubmit?: (
    values: LoginValues
  ) =>
    | Promise<AuthSubmitResult<keyof LoginValues & string> | void>
    | AuthSubmitResult<keyof LoginValues & string>
    | void
  signUpHref?: string
  forgotPasswordHref?: string
}

export interface SignupBlockProps extends AuthBlockBaseProps {
  onSubmit?: (
    values: SignupValues
  ) =>
    | Promise<AuthSubmitResult<keyof SignupValues & string> | void>
    | AuthSubmitResult<keyof SignupValues & string>
    | void
  signInHref?: string
  termsHref?: string
  privacyHref?: string
}

const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Enter a valid email address")

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
})

const signupPasswordSchema = z
  .string()
  .min(8, "Use at least 8 characters")
  .regex(/[A-Z]/, "Add an uppercase letter")
  .regex(/[a-z]/, "Add a lowercase letter")
  .regex(/[0-9]/, "Add a number")
  .regex(/[^A-Za-z0-9]/, "Add a symbol")

const signupSchema = z
  .object({
    name: z.string().trim().min(2, "Enter your full name"),
    email: emailSchema,
    password: signupPasswordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    terms: z.boolean().refine((value) => value, "Accept the terms to continue"),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  })

const authSizeConfig = {
  sm: {
    card: "sm" as const,
    width: "max-w-sm",
    title: "text-xl",
    input: "sm" as const,
    button: "sm" as const,
    buttonClassName: "h-7.5 px-[calc(--spacing(2.5)-1px)]",
    iconButton: "icon-xs" as const,
    contentGap: "gap-4",
    footer: "text-sm",
    socialLabel: "Continue with",
  },
  md: {
    card: "default" as const,
    width: "max-w-md",
    title: "text-2xl",
    input: "default" as const,
    button: "sm" as const,
    buttonClassName: "h-8.5 px-[calc(--spacing(3)-1px)]",
    iconButton: "icon-xs" as const,
    contentGap: "gap-5",
    footer: "text-sm",
    socialLabel: "Continue with",
  },
  lg: {
    card: "default" as const,
    width: "max-w-lg",
    title: "text-3xl",
    input: "lg" as const,
    button: "default" as const,
    buttonClassName: "h-9.5 px-[calc(--spacing(3.5)-1px)]",
    iconButton: "icon-sm" as const,
    contentGap: "gap-6",
    footer: "text-base",
    socialLabel: "Sign in with",
  },
} as const

const authVariantClasses: Record<AuthBlockVariant, string> = {
  default: "bg-card ring-foreground/10",
  bordered: "bg-card ring-foreground/20 shadow-sm",
  elevated: "bg-card ring-foreground/10 shadow-xl shadow-black/5",
  minimal: "bg-transparent ring-0 shadow-none",
}

const passwordRules = [
  { label: "At least 8 characters", test: (value: string) => value.length >= 8 },
  { label: "One uppercase letter", test: (value: string) => /[A-Z]/.test(value) },
  { label: "One lowercase letter", test: (value: string) => /[a-z]/.test(value) },
  { label: "One number", test: (value: string) => /[0-9]/.test(value) },
  { label: "One symbol", test: (value: string) => /[^A-Za-z0-9]/.test(value) },
] as const

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function toErrorMap<TValues extends object>(error: z.ZodError<TValues>) {
  return z.flattenError(error).fieldErrors as AuthErrors<TValues>
}

function firstError(error?: string | string[]) {
  if (Array.isArray(error)) return error[0]
  return error
}

function useEntryAnimation(animation: AuthBlockAnimation) {
  const [entered, setEntered] = React.useState(animation === "none")

  React.useEffect(() => {
    if (animation === "none") {
      setEntered(true)
      return
    }

    setEntered(false)
    const frame = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(frame)
  }, [animation])

  return cn(
    "transition-all duration-300 ease-out motion-reduce:transition-none",
    animation === "fade" && (entered ? "opacity-100" : "opacity-0"),
    animation === "slide-up" && (entered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"),
    animation === "scale" && (entered ? "scale-100 opacity-100" : "scale-[0.98] opacity-0")
  )
}

function GoogleIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

function PasswordRules({ password }: { password: string }) {
  return (
    <div className="rounded-lg border border-border bg-muted/40 p-3">
      <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
        <Sparkles className="size-4 text-primary" />
        Password requirements
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {passwordRules.map((rule) => {
          const satisfied = rule.test(password)

          return (
            <div
              key={rule.label}
              className={cn(
                "flex items-center gap-2 text-sm transition-colors",
              satisfied ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {satisfied ? (
                <Check className="size-4 text-success" />
              ) : (
                <Circle className="size-4 text-muted-foreground" />
              )}
              <span>{rule.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function AuthAlert({ error }: { error?: string }) {
  if (!error) return null

  return (
    <Alert variant="destructive">
      <AlertTriangle className="size-4" />
      <AlertTitle>Something needs attention</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  )
}

function SocialActions({
  size,
  showSocial,
  loading,
  onGoogleLogin,
  onGithubLogin,
}: {
  size: AuthBlockSize
  showSocial: boolean
  loading: boolean
  onGoogleLogin?: () => void
  onGithubLogin?: () => void
}) {
  const config = authSizeConfig[size]
  const hasProviders = showSocial && (onGoogleLogin || onGithubLogin)

  if (!hasProviders) return null

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-2 sm:grid-cols-2">
        {onGoogleLogin ? (
          <Button
            type="button"
            variant="outline"
            size={config.button}
            className={cn("w-full", config.buttonClassName)}
            onClick={onGoogleLogin}
            disabled={loading}
          >
            <GoogleIcon />
            {config.socialLabel} Google
          </Button>
        ) : null}
        {onGithubLogin ? (
          <Button
            type="button"
            variant="outline"
            size={config.button}
            className={cn("w-full", config.buttonClassName)}
            onClick={onGithubLogin}
            disabled={loading}
          >
            <Icons.github className="size-4" />
            {config.socialLabel} GitHub
          </Button>
        ) : null}
      </div>
      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-muted-foreground">
        <div className="h-px flex-1 bg-border" />
        <span>Credentials</span>
        <div className="h-px flex-1 bg-border" />
      </div>
    </div>
  )
}

function AuthCardShell({
  title,
  description,
  size,
  variant,
  animation,
  className,
  footer,
  children,
}: {
  title: string
  description: string
  size: AuthBlockSize
  variant: AuthBlockVariant
  animation: AuthBlockAnimation
  className?: string
  footer?: React.ReactNode
  children: React.ReactNode
}) {
  const config = authSizeConfig[size]
  const motionClassName = useEntryAnimation(animation)

  return (
    <div className={cn("w-full", config.width, motionClassName, className)}>
      <Card size={config.card} className={cn("w-full", authVariantClasses[variant])}>
        <CardHeader className="gap-2">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Sparkles className="size-4" />
          </div>
          <CardTitle className={config.title}>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className={cn("flex flex-col", config.contentGap)}>{children}</CardContent>
        {footer ? (
          <CardFooter
            className={cn(
              "justify-center border-border text-center text-muted-foreground",
              variant === "minimal" && "bg-transparent",
              config.footer
            )}
          >
            {footer}
          </CardFooter>
        ) : null}
      </Card>
    </div>
  )
}

async function resolveLoginSubmit(onSubmit: LoginBlockProps["onSubmit"], values: LoginValues) {
  if (onSubmit) return onSubmit(values)

  await sleep(900)
  return {
    status: "success" as const,
    message: "The login block is ready. Replace the demo callback with your auth action.",
  }
}

async function resolveSignupSubmit(onSubmit: SignupBlockProps["onSubmit"], values: SignupValues) {
  if (onSubmit) return onSubmit(values)

  await sleep(900)
  return {
    status: "success" as const,
    message: "Your signup block is wired. Plug in your signup action when you're ready.",
  }
}

function validateLoginField(name: keyof LoginValues, value: string) {
  if (name === "email") {
    const result = emailSchema.safeParse(value)
    return result.success
      ? null
      : (result.error.issues[0]?.message ?? "Enter a valid email address")
  }

  if (!value.trim()) return "Password is required"
  return null
}

function validateSignupField(
  name: keyof SignupValues,
  value: unknown,
  formValues: Record<string, unknown>
) {
  const values: SignupValues = {
    name: String(formValues.name ?? ""),
    email: String(formValues.email ?? ""),
    password: String(formValues.password ?? ""),
    confirmPassword: String(formValues.confirmPassword ?? ""),
    terms: name === "terms" ? Boolean(value) : Boolean(formValues.terms),
  }

  if (name !== "terms") {
    values[name] = String(value ?? "") as never
  }

  const result = signupSchema.safeParse(values)
  if (result.success) return null
  return firstError(toErrorMap(result.error)[name]) ?? null
}

export function LoginBlock({
  onSubmit,
  onGoogleLogin,
  onGithubLogin,
  signUpHref = "/sign-up",
  forgotPasswordHref = "/forgot-password",
  className,
  title = "Welcome back",
  description = "Sign in with Base UI form primitives and swap in your real auth action when you're ready.",
  variant = "default",
  size = "md",
  animation = "fade",
  showSocial = true,
  successToast,
}: LoginBlockProps) {
  const toast = useToast()
  const config = authSizeConfig[size]
  const [loading, setLoading] = React.useState(false)
  const [errors, setErrors] = React.useState<AuthErrors<LoginValues>>({})
  const [formError, setFormError] = React.useState<string>()
  const [showPassword, setShowPassword] = React.useState(false)

  return (
    <AuthCardShell
      title={title}
      description={description}
      size={size}
      variant={variant}
      animation={animation}
      className={className}
      footer={
        signUpHref ? (
          <p>
            Don&apos;t have an account?{" "}
            <a
              href={signUpHref}
              className="font-medium text-foreground underline underline-offset-4"
            >
              Sign up
            </a>
          </p>
        ) : undefined
      }
    >
      <AuthAlert error={formError} />
      <SocialActions
        size={size}
        showSocial={showSocial}
        loading={loading}
        onGoogleLogin={onGoogleLogin}
        onGithubLogin={onGithubLogin}
      />

      <Form<LoginValues>
        errors={errors}
        onFormSubmit={async (formValues) => {
          setFormError(undefined)

          const parsed = loginSchema.safeParse(formValues)
          if (!parsed.success) {
            setErrors(toErrorMap(parsed.error))
            return
          }

          setLoading(true)
          const result = await resolveLoginSubmit(onSubmit, parsed.data)

          if (result?.status === "error") {
            setFormError(result.message ?? "We couldn't sign you in right now.")
            setErrors((result.fieldErrors ?? {}) as AuthErrors<LoginValues>)
            setLoading(false)
            return
          }

          setErrors({})
          setLoading(false)
          toast.add({
            title: successToast?.title ?? "Signed in",
            description:
              successToast?.description ??
              (result?.status === "success"
                ? result.message
                : "You can now swap the demo callback for your production login flow."),
            type: "success",
            timeout: successToast?.timeout ?? 3500,
          })
        }}
      >
        <Field
          name="email"
          className="gap-2"
          validate={(value) => validateLoginField("email", String(value ?? ""))}
        >
          <FieldLabel>Email</FieldLabel>
            <Input
              name="email"
              type="email"
              size={config.input}
              placeholder="you@example.com"
              autoComplete="email"
              disabled={loading}
            onChange={() => {
              setFormError(undefined)
              setErrors((current) => ({ ...current, email: undefined }))
            }}
          />
          <FieldError />
        </Field>

        <Field
          name="password"
          className="gap-2"
          validate={(value) => validateLoginField("password", String(value ?? ""))}
        >
          <div className="flex w-full items-center justify-between gap-3">
            <FieldLabel>Password</FieldLabel>
            {forgotPasswordHref ? (
              <a
                href={forgotPasswordHref}
                className="text-sm text-muted-foreground underline underline-offset-4"
              >
                Forgot password?
              </a>
            ) : null}
          </div>
          <div className="relative w-full">
            <Input
              name="password"
              type={showPassword ? "text" : "password"}
              size={config.input}
              placeholder="Enter your password"
              autoComplete="current-password"
              disabled={loading}
              className="pr-11"
              onChange={() => {
                setFormError(undefined)
                setErrors((current) => ({ ...current, password: undefined }))
              }}
            />
            <Button
              type="button"
              variant="ghost"
              size={config.iconButton}
              className="absolute top-1/2 right-1 -translate-y-1/2"
              onClick={() => setShowPassword((current) => !current)}
              disabled={loading}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </Button>
          </div>
          <FieldError />
        </Field>

        <Button
          type="submit"
          size={config.button}
          className={cn("w-full", config.buttonClassName)}
          loading={loading}
        >
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </Form>
    </AuthCardShell>
  )
}

export function SignupBlock({
  onSubmit,
  onGoogleLogin,
  onGithubLogin,
  signInHref = "/login",
  termsHref = "/terms",
  privacyHref = "/privacy",
  className,
  title = "Create your account",
  description = "Ship signup with Base UI form primitives, inline validation, alert errors, and success toasts.",
  variant = "default",
  size = "md",
  animation = "fade",
  showSocial = true,
  successToast,
}: SignupBlockProps) {
  const toast = useToast()
  const config = authSizeConfig[size]
  const [loading, setLoading] = React.useState(false)
  const [errors, setErrors] = React.useState<AuthErrors<SignupValues>>({})
  const [formError, setFormError] = React.useState<string>()
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [password, setPassword] = React.useState("")
  const [signupValues, setSignupValues] = React.useState<SignupValues>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  })

  return (
    <AuthCardShell
      title={title}
      description={description}
      size={size}
      variant={variant}
      animation={animation}
      className={className}
      footer={
        signInHref ? (
          <p>
            Already have an account?{" "}
            <a
              href={signInHref}
              className="font-medium text-foreground underline underline-offset-4"
            >
              Sign in
            </a>
          </p>
        ) : undefined
      }
    >
      <AuthAlert error={formError} />
      <SocialActions
        size={size}
        showSocial={showSocial}
        loading={loading}
        onGoogleLogin={onGoogleLogin}
        onGithubLogin={onGithubLogin}
      />

      <Form<SignupValues>
        errors={errors}
        onFormSubmit={async (formValues) => {
          setFormError(undefined)

          const parsed = signupSchema.safeParse({
            ...formValues,
            terms: Boolean(formValues.terms),
          })

          if (!parsed.success) {
            setErrors(toErrorMap(parsed.error))
            return
          }

          setLoading(true)
          const result = await resolveSignupSubmit(onSubmit, parsed.data)

          if (result?.status === "error") {
            setFormError(result.message ?? "We couldn't create your account right now.")
            setErrors((result.fieldErrors ?? {}) as AuthErrors<SignupValues>)
            setLoading(false)
            return
          }

          setErrors({})
          setLoading(false)
          toast.add({
            title: successToast?.title ?? "Account created",
            description:
              successToast?.description ??
              (result?.status === "success"
                ? result.message
                : "The signup block is ready for your production create-account action."),
            type: "success",
            timeout: successToast?.timeout ?? 3500,
          })
        }}
      >
        <Field
          name="name"
          className="gap-2"
          validate={(value, formValues) => validateSignupField("name", value, formValues)}
        >
          <FieldLabel>Full name</FieldLabel>
          <Input
            name="name"
            size={config.input}
            placeholder="Ava Thompson"
            autoComplete="name"
            disabled={loading}
            onChange={(event) => {
              const value = event.currentTarget.value
              setFormError(undefined)
              setErrors((current) => ({ ...current, name: undefined }))
              setSignupValues((current) => ({ ...current, name: value }))
            }}
          />
          <FieldError />
        </Field>

        <Field
          name="email"
          className="gap-2"
          validate={(value, formValues) => validateSignupField("email", value, formValues)}
        >
          <FieldLabel>Email</FieldLabel>
          <Input
            name="email"
            type="email"
            size={config.input}
            placeholder="you@example.com"
            autoComplete="email"
            disabled={loading}
            onChange={(event) => {
              const value = event.currentTarget.value
              setFormError(undefined)
              setErrors((current) => ({ ...current, email: undefined }))
              setSignupValues((current) => ({ ...current, email: value }))
            }}
          />
          <FieldError />
        </Field>

        <Field
          name="password"
          className="gap-2"
          validate={(value, formValues) => validateSignupField("password", value, formValues)}
        >
          <FieldLabel>Password</FieldLabel>
          <div className="relative w-full">
            <Input
              name="password"
              type={showPassword ? "text" : "password"}
              size={config.input}
              placeholder="Create a strong password"
              autoComplete="new-password"
              disabled={loading}
              className="pr-11"
              onChange={(event) => {
                const value = event.currentTarget.value
                setFormError(undefined)
                setPassword(value)
                setErrors((current) => ({ ...current, password: undefined }))
                setSignupValues((current) => ({ ...current, password: value }))
              }}
            />
            <Button
              type="button"
              variant="ghost"
              size={config.iconButton}
              className="absolute top-1/2 right-1 -translate-y-1/2"
              onClick={() => setShowPassword((current) => !current)}
              disabled={loading}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </Button>
          </div>
          <FieldDescription>
            Live password rules help users fix issues before submit.
          </FieldDescription>
          <FieldError />
        </Field>

        <PasswordRules password={password} />

        <Field
          name="confirmPassword"
          className="gap-2"
          validate={(value, formValues) =>
            validateSignupField("confirmPassword", value, formValues)
          }
        >
          <FieldLabel>Confirm password</FieldLabel>
          <div className="relative w-full">
            <Input
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              size={config.input}
              placeholder="Repeat your password"
              autoComplete="new-password"
              disabled={loading}
              className="pr-11"
              onChange={(event) => {
                const value = event.currentTarget.value
                setFormError(undefined)
                setErrors((current) => ({ ...current, confirmPassword: undefined }))
                setSignupValues((current) => ({ ...current, confirmPassword: value }))
              }}
            />
            <Button
              type="button"
              variant="ghost"
              size={config.iconButton}
              className="absolute top-1/2 right-1 -translate-y-1/2"
              onClick={() => setShowConfirmPassword((current) => !current)}
              disabled={loading}
              aria-label={
                showConfirmPassword ? "Hide confirmed password" : "Show confirmed password"
              }
            >
              {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </Button>
          </div>
          <FieldError />
        </Field>

        <Field
          name="terms"
          className="gap-3"
          validate={(value, formValues) => validateSignupField("terms", value, formValues)}
        >
          <label className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-3">
            <Checkbox
              name="terms"
              checked={signupValues.terms}
              required
              disabled={loading}
              onCheckedChange={(checked) => {
                setFormError(undefined)
                setErrors((current) => ({ ...current, terms: undefined }))
                setSignupValues((current) => ({ ...current, terms: checked }))
              }}
            />
            <div className="space-y-1">
              <div className="text-sm font-medium text-foreground">
                I agree to the{" "}
                <a href={termsHref} className="underline underline-offset-4">
                  terms
                </a>{" "}
                and{" "}
                <a href={privacyHref} className="underline underline-offset-4">
                  privacy policy
                </a>
                .
              </div>
              <p className="text-sm text-muted-foreground">
                This keeps the block production-shaped without adding another form library.
              </p>
            </div>
          </label>
          <FieldError />
        </Field>

        <Button
          type="submit"
          size={config.button}
          className={cn("w-full", config.buttonClassName)}
          loading={loading}
        >
          {loading ? "Creating account..." : "Create account"}
        </Button>
      </Form>
    </AuthCardShell>
  )
}
