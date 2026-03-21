import Link from "next/link"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between px-6 h-14">
        <Link href="/" className="flex items-center gap-2 font-mono text-sm font-semibold">
          <span className="flex h-6 w-6 items-center justify-center rounded border border-border bg-foreground text-background text-[10px] font-bold">
            B
          </span>
          baseui-cn
        </Link>
        <nav className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="/docs" className="hover:text-foreground transition-colors">
            Docs
          </Link>
          <Link href="/docs/components/button" className="hover:text-foreground transition-colors">
            Components
          </Link>
          <a
            href="https://github.com/baseui-cn/baseui-cn"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  )
}
