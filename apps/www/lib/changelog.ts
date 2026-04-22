export interface ChangelogLink {
  href: string
  label: string
}

export interface ChangelogExample {
  href: string
  label: string
  description: string
}

export interface ChangelogRelease {
  slug: string
  date: string
  isoDate: string
  title: string
  badge: string
  summary: string
  notes: string[]
  links?: ChangelogLink[]
  examples?: ChangelogExample[]
}

export const changelogEntries: ChangelogRelease[] = [
  {
    slug: "combobox-and-fieldset-legend-upgrade",
    date: "April 22, 2026",
    isoDate: "2026-04-22",
    title: "Combobox And Fieldset Legend Upgrade",
    badge: "Latest",
    summary:
      "A component-focused release that improves combobox usability, expands the public API, and adds more styling control to FieldsetLegend.",
    notes: [
      "Added a more flexible Combobox trigger API with optional built-in icons and support for custom trigger-button layouts.",
      "Improved ComboboxInput with start addons, optional autofocus control, and clearer built-in clear-button behavior while typing.",
      "Expanded multi-select Combobox support with richer chip layouts, removable chips, and an overflow pattern for larger selections.",
      "Added async combobox feedback improvements including loading states, result counts, and updated teammate-style demos.",
      "Extended the Combobox API with item indicator positioning, status and row helpers, and extra exports like useComboboxFilter.",
      "Updated combobox docs and previews to cover trigger-button usage, chip overflow, and improved async examples.",
      "Added FieldsetLegend variants and sizes, including a bordered legend style and sm/md/lg sizing for denser or more prominent form sections.",
    ],
    links: [
      { href: "/docs/components/combobox", label: "View combobox docs" },
      { href: "/docs/components/fieldset", label: "View fieldset docs" },
      { href: "/docs/changelog", label: "Read changelog" },
    ],
    examples: [
      {
        href: "/docs/components/combobox",
        label: "Async assignee picker",
        description: "Use the updated async combobox pattern for teammate search and assignment flows.",
      },
      {
        href: "/docs/components/combobox",
        label: "Filter chips with overflow",
        description: "Build denser filter bars by combining multi-select chips with collapsed overflow handling.",
      },
      {
        href: "/docs/components/fieldset",
        label: "Settings sections",
        description: "Use bordered FieldsetLegend variants and sizes to structure forms, preferences, and account panels.",
      },
    ],
  },
  {
    slug: "docs-preview-installability-pass",
    date: "April 20, 2026",
    isoDate: "2026-04-20",
    title: "Docs, Preview, And Installability Pass",
    badge: "Release",
    summary:
      "A docs-quality sweep that tightened the landing experience, cleaned up install flows, and made recent product changes easier to discover.",
    notes: [
      "Added a dedicated changelog page so recent launches and fixes are easy to share.",
      "Refined the landing-page installables list into a cleaner card view with richer metadata.",
      "Fixed field docs coverage by separating the textarea example from the full form-built-with-field example.",
      "Improved homepage motion with the new animated terminal and section reveal transitions.",
    ],
    links: [
      { href: "/docs/changelog", label: "Read changelog" },
      { href: "/docs", label: "Browse docs" },
    ],
    examples: [
      {
        href: "/docs",
        label: "Faster onboarding",
        description: "Share a clearer docs starting point when teammates are new to the component registry.",
      },
    ],
  },
  {
    slug: "command-data-grid-and-otp-updates",
    date: "April 19, 2026",
    isoDate: "2026-04-19",
    title: "Command, Data Grid, And OTP Updates",
    badge: "Launch",
    summary:
      "A component release focused on richer command flows, advanced table interactions, and OTP field coverage.",
    notes: [
      "Published the command docs around the current Base UI-native primitive API and richer demos.",
      "Shipped the multi-file data-grid family with editable, optimistic, and async editing demos.",
      "Added OTP field demos including auto-submit and grouped-slot variants.",
      "Regenerated the registry and preview-source pipeline so one-command installs stay aligned with docs.",
    ],
    links: [
      { href: "/docs/components/command", label: "View command docs" },
      { href: "/docs/components/data-grid", label: "View data grid docs" },
      { href: "/docs/components/otp-field", label: "View OTP field docs" },
    ],
    examples: [
      {
        href: "/docs/components/command",
        label: "Command menu",
        description: "Build searchable command palettes and workspace shortcuts with richer grouped interactions.",
      },
      {
        href: "/docs/components/data-grid",
        label: "Editable admin tables",
        description: "Use the data grid family for inline editing, async states, and optimistic table workflows.",
      },
    ],
  },
  {
    slug: "auth-blocks-and-form-feedback",
    date: "April 18, 2026",
    isoDate: "2026-04-18",
    title: "Auth Blocks And Form Feedback",
    badge: "Release",
    summary:
      "A release focused on auth-ready blocks, stronger form feedback patterns, and more polished default states.",
    notes: [
      "Expanded login and signup into production-shaped auth blocks with Base UI field validation, alerts, and success toasts.",
      "Moved auth installs to the dedicated auth source file and kept grouped block exports focused on empty states.",
      "Aligned button, field, and input sizing so auth forms feel consistent out of the box.",
    ],
    links: [
      { href: "/docs/components/login", label: "View login docs" },
      { href: "/docs/components/signup", label: "View signup docs" },
      { href: "/docs/components/form", label: "View form docs" },
    ],
    examples: [
      {
        href: "/docs/components/login",
        label: "Auth screens",
        description: "Ship login and signup flows with stronger validation, alerts, and success feedback.",
      },
    ],
  },
]

export const latestChangelogEntry = changelogEntries[0]
