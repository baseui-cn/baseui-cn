import type { Metadata } from "next"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Changelog" }

const releases = [
  {
    date: "April 20, 2026",
    title: "Docs, Preview, And Installability Pass",
    badge: "Latest",
    notes: [
      "Added a dedicated changelog page so recent launches and fixes are easy to share.",
      "Refined the landing-page installables list into a cleaner card view with richer metadata.",
      "Fixed field docs coverage by separating the textarea example from the full form-built-with-field example.",
      "Improved homepage motion with the new animated terminal and section reveal transitions.",
    ],
  },
  {
    date: "April 19, 2026",
    title: "Command, Data Grid, And OTP Updates",
    badge: "Launch",
    notes: [
      "Published the command docs around the current Base UI-native primitive API and richer demos.",
      "Shipped the multi-file data-grid family with editable, optimistic, and async editing demos.",
      "Added OTP field demos including auto-submit and grouped-slot variants.",
      "Regenerated the registry and preview-source pipeline so one-command installs stay aligned with docs.",
    ],
  },
  {
    date: "April 18, 2026",
    title: "Auth Blocks And Form Feedback",
    badge: "Release",
    notes: [
      "Expanded login and signup into production-shaped auth blocks with Base UI field validation, alerts, and success toasts.",
      "Moved auth installs to the dedicated auth source file and kept grouped block exports focused on empty states.",
      "Aligned button, field, and input sizing so auth forms feel consistent out of the box.",
    ],
  },
]

export default function ChangelogPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 animate-fade-in">
      <div className="flex flex-col gap-3 border-b border-border pb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Getting Started
        </p>
        <h1 className="text-3xl font-bold tracking-tight">Changelog</h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          A running log of what shipped recently in baseui-cn, including component launches,
          docs improvements, and installability updates.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {releases.map((release) => (
          <section
            key={`${release.date}-${release.title}`}
            className="rounded-2xl border border-border bg-background p-6 shadow-xs/5"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  {release.date}
                </p>
                <h2 className="mt-2 text-xl font-semibold text-foreground">{release.title}</h2>
              </div>
              <span className="rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
                {release.badge}
              </span>
            </div>

            <div className="mt-5 grid gap-3">
              {release.notes.map((note) => (
                <div
                  key={note}
                  className="rounded-xl border border-border/60 bg-muted/20 px-4 py-3 text-sm leading-relaxed text-muted-foreground"
                >
                  {note}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
