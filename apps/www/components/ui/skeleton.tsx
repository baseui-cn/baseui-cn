import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-pulse motion-reduce:animate-none rounded-[min(var(--radius,6px),6px)] bg-muted",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
