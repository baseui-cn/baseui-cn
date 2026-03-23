"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { LogoLight, LogoDark } from "@/components/shared/baseui-cn-logo"


import { useTheme } from "next-themes"

function LogoMark({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      className="text-foreground shrink-0"
    >
      <rect x="7" y="7" width="22" height="22" rx="4" stroke="currentColor" strokeWidth="1.75" />

      <rect
        x="1"
        y="1"
        width="22"
        height="22"
        rx="4"
        fill="hsl(var(--background))"
        stroke="currentColor"
        strokeWidth="1.75"
      />

      <rect x="6" y="7" width="12" height="4" rx="1.25" fill="currentColor" />
      <rect x="6" y="14" width="8" height="4" rx="1.25" fill="currentColor" />
    </svg>

    // <svg
    //   width={size}
    //   height={size}
    //   viewBox="0 0 32 32"
    //   fill="none"
    //   className="text-foreground shrink-0"
    // >
    //   <rect x="7" y="7" width="22" height="22" rx="4"
    //     stroke="currentColor" strokeWidth="1.75" />
    //   <rect x="1" y="1" width="22" height="22" rx="4"
    //     fill="hsl(var(--background))" stroke="currentColor" strokeWidth="1.75" />
    //   <rect x="6" y="7" width="12" height="4" rx="1.25" fill="currentColor" />
    //   <rect x="6" y="14" width="8" height="4" rx="1.25" fill="currentColor" />
    // </svg>
  )
}

export function SiteHeader() {
  const pathname = usePathname()
  const isDocsActive = pathname?.startsWith("/docs")

  const activeTheme = useTheme().resolvedTheme

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-14 items-center px-4 md:px-6 max-w-screen-2xl mx-auto gap-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-mono text-sm font-semibold tracking-tight hover:opacity-80 transition-opacity"
        >
          {activeTheme === "light" ? <LogoLight /> : <LogoDark />}
          baseui-cn
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1 text-sm">
          <Link
            href="/docs"
            className={cn(
              "px-3 py-1.5 rounded-md transition-colors",
              isDocsActive && !pathname?.startsWith("/docs/components")
                ? "text-foreground bg-accent"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            Docs
          </Link>
          <Link
            href="/docs/components/button"
            className={cn(
              "px-3 py-1.5 rounded-md transition-colors",
              pathname?.startsWith("/docs/components")
                ? "text-foreground bg-accent"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            Components
          </Link>
        </nav>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />
          <a
            href="https://github.com/baseui-cn/baseui-cn"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            aria-label="GitHub"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>
          <div className="hidden sm:flex h-6 items-center pl-1">
            <code className="rounded bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">
              v0.1.0
            </code>
          </div>
        </div>
      </div>
    </header>
  )
}
