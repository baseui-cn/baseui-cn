import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

// ─── EmptyState ────────────────────────────────────────────────────────────

export interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
  size?: "sm" | "md" | "lg"
}

const sizeConfig = {
  sm: { wrap: "gap-2 py-8 px-4", icon: "size-10", title: "text-sm", desc: "text-xs", dot: "size-10" },
  md: { wrap: "gap-3 py-12 px-6", icon: "size-12", title: "text-base", desc: "text-sm", dot: "size-12" },
  lg: { wrap: "gap-4 py-20 px-8", icon: "size-16", title: "text-lg", desc: "text-sm", dot: "size-16" },
}

function EmptyState({ icon, title, description, action, className, size = "md" }: EmptyStateProps) {
  const s = sizeConfig[size]
  return (
    <div className={cn("flex flex-col items-center justify-center text-center", s.wrap, className)}>
      {icon && (
        <div className={cn("flex items-center justify-center rounded-full bg-muted text-muted-foreground", s.icon)}>
          {icon}
        </div>
      )}
      <div className="flex flex-col gap-1">
        <h3 className={cn("font-semibold text-foreground", s.title)}>{title}</h3>
        {description && <p className={cn("text-muted-foreground", s.desc)}>{description}</p>}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  )
}

const EmptyStateIcons = {
  inbox: (
    <svg className="size-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 8l7-5 7 5v9a1 1 0 01-1 1H4a1 1 0 01-1-1V8z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 18V10h6v8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  search: (
    <svg className="size-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="8.5" cy="8.5" r="5" />
      <path d="M15 15l2.5 2.5" strokeLinecap="round" />
    </svg>
  ),
  folder: (
    <svg className="size-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 7a2 2 0 012-2h3l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  users: (
    <svg className="size-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="7" cy="7" r="3" />
      <path d="M1 17c0-3.314 2.686-6 6-6" strokeLinecap="round" />
      <circle cx="13" cy="7" r="3" />
      <path d="M13 11a6 6 0 016 6" strokeLinecap="round" />
    </svg>
  ),
}

// ─── LoginBlock ─────────────────────────────────────────────────────────────

export interface LoginBlockProps {
  onSubmit?: (data: { email: string; password: string }) => void | Promise<void>
  onGoogleLogin?: () => void
  onGithubLogin?: () => void
  signUpHref?: string
  forgotPasswordHref?: string
  isLoading?: boolean
  error?: string
  className?: string
  title?: string
  description?: string
  showSocial?: boolean
}

function LoginBlock({
  onSubmit,
  onGoogleLogin,
  onGithubLogin,
  signUpHref = "/sign-up",
  forgotPasswordHref = "/forgot-password",
  isLoading = false,
  error,
  className,
  title = "Welcome back",
  description = "Sign in to your account to continue",
  showSocial = true,
}: LoginBlockProps) {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [fieldErrors, setFieldErrors] = React.useState<{ email?: string; password?: string }>({})

  const validate = () => {
    const errors: typeof fieldErrors = {}
    if (!email) errors.email = "Email is required"
    else if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) errors.email = "Enter a valid email"
    if (!password) errors.password = "Password is required"
    else if (password.length < 8) errors.password = "Password must be at least 8 characters"
    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errors = validate()
    if (Object.keys(errors).length) { setFieldErrors(errors); return }
    setFieldErrors({})
    await onSubmit?.({ email, password })
  }

  return (
    <div className={cn("flex w-full max-w-sm flex-col gap-6", className)}>
      <div className="flex flex-col gap-1 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {showSocial && (onGoogleLogin || onGithubLogin) && (
        <>
          <div className="flex flex-col gap-2">
            {onGoogleLogin && (
              <Button type="button" variant="outline" className="w-full gap-2" onClick={onGoogleLogin} disabled={isLoading}>
                <svg className="size-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </Button>
            )}
            {onGithubLogin && (
              <Button type="button" variant="outline" className="w-full gap-2" onClick={onGithubLogin} disabled={isLoading}>
                <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                Continue with GitHub
              </Button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">or</span>
            <Separator className="flex-1" />
          </div>
        </>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <Input
          type="email"
          label="Email"
          placeholder="you@example.com"
          autoComplete="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          error={fieldErrors.email}
          disabled={isLoading}
        />
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">Password</label>
            {forgotPasswordHref && (
              <a href={forgotPasswordHref} className="text-xs text-muted-foreground underline-offset-4 hover:underline">
                Forgot password?
              </a>
            )}
          </div>
          <Input
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            error={fieldErrors.password}
            disabled={isLoading}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      {signUpHref && (
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <a href={signUpHref} className="font-medium text-foreground underline-offset-4 hover:underline">
            Sign up
          </a>
        </p>
      )}
    </div>
  )
}

export { EmptyState, EmptyStateIcons, LoginBlock }
