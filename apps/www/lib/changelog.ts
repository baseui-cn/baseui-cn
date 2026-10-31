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
    slug: "baseui-cn-1-4-1-time-picker-keyboard-fix",
    date: "October 31, 2026",
    isoDate: "2026-10-31",
    title: "baseui-cn 1.4.1 — Time Picker keyboard entry",
    badge: "Release",
    summary:
      "Restored keyboard entry into Free Time Picker list columns when the selected value is disabled.",
    notes: [
      "Enabled selected options retain keyboard entry; disabled selections fall back to the first enabled option, and fully disabled columns have no false tab stop.",
      "Focus fallback preserves the controlled value and only explicit activation requests a value change. Public APIs, styling, geometry, clock mode, and Date Picker behavior are unchanged.",
    ],
    links: [{ href: "/docs/components/time-picker", label: "View Time Picker docs" }],
  },
  {
    slug: "baseui-cn-1-4-0-design-system-v2",
    date: "October 21, 2026",
    isoDate: "2026-10-21",
    title: "baseui-cn 1.4.0 — Design System V2",
    badge: "Release",
    summary:
      "Design System V2 brings a Graphite and restrained Iris visual refresh, simpler theming, improved interactions, and refreshed CLI distribution and documentation on Base UI 1.9.0.",
    notes: [
      "Upgraded the Base UI foundation from 1.6.0 to 1.9.0 while preserving public component APIs.",
      "Simplified theming to 26 familiar generic variables with zero public --cn-* theming vocabulary and improved dark mode.",
      "Improved focus visibility, accessibility, and touch behavior across selection and search, overlays and menus, and navigation and disclosure components.",
      "Refined Dialog, AlertDialog, and Drawer surfaces and interactions, plus feedback, Table, and Data Grid presentation and virtual scrolling.",
      "Refreshed the website and documentation and corrected Date Picker reduced-motion behavior.",
      "Constrained Data Grid CLI installation to compatible TanStack Table v8 and included the license text in the npm package.",
      "Made repeated add restore missing files while preserving customized source and shared styles.",
      "Added seven canonical theme colors and four radius presets, with Iris and Rounded defaults, live homepage previews, and explicit --color/--radius flags that preserve existing custom themes unless selected.",
      "Added framework-aware setup for Next.js, TanStack Start, React Router, Vite, and existing React apps, with npm, pnpm, Yarn and Bun detection.",
      "Added official-scaffolder project creation and app-scoped monorepo initialization. Yarn create commands require Yarn 2+.",
      "Redesigned the landing experience with a working setup-command builder and component install planner. This 1.4.0 candidate remains paused for product and release review.",
    ],
    links: [
      { href: "/docs/theming", label: "View theming docs" },
      { href: "/docs/installation", label: "View installation docs" },
    ],
  },
  {
    slug: "base-ui-v1-9-upgrade",
    date: "October 19, 2026",
    isoDate: "2026-10-19",
    title: "Base UI Upgraded To v1.9",
    badge: "Release",
    summary:
      "Updated the Base UI foundation from v1.6.0 to v1.9.0 while preserving existing baseui-cn component APIs and styling.",
    notes: [
      "Inherited upstream mobile and touch fixes, including Drawer gestures, virtual keyboard handling, and Scroll Area interactions.",
      "Inherited performance improvements for Select, Combobox, Menu, and popup triggers, plus accessibility, focus, validation, and interaction fixes.",
      "Reviewed existing wrappers and examples for compatibility and regenerated all three registry copies against the v1.9.0 baseline.",
      "Kept existing Date Picker and Time Picker behavior and styling unchanged. The preview Menu filtering API is not adopted or documented as a baseui-cn feature.",
    ],
    links: [
      {
        href: "https://base-ui.com/react/overview/releases/v1-9-0",
        label: "Base UI v1.9 release notes",
      },
      { href: "/docs/changelog", label: "Read changelog" },
    ],
  },
  {
    slug: "time-picker-draft-and-mobile-search-fix",
    date: "July 23, 2026",
    isoDate: "2026-07-23",
    title: "Time Picker Draft And Mobile Search Fix",
    badge: "Release",
    summary:
      "Fixed empty Time Picker confirmation so OK commits the visible draft and made documentation search available from the mobile header.",
    notes: [
      "Added defaultPickerValue as an uncommitted opening draft that remains distinct from defaultValue.",
      "Made empty pickers use the nearest valid stepped current time when no explicit picker draft is provided.",
      "Kept Cancel lossless while allowing OK to commit the time already visible when a picker opens empty.",
      "Added a compact mobile search trigger that opens the existing documentation command dialog without duplicating search state or navigation.",
    ],
    links: [
      { href: "/docs/components/time-picker", label: "View Time Picker docs" },
      { href: "/docs/changelog", label: "Read changelog" },
    ],
  },
  {
    slug: "time-picker-interaction-fix",
    date: "July 23, 2026",
    isoDate: "2026-07-23",
    title: "Time Picker Interaction Fix",
    badge: "Release",
    summary:
      "Fixed TimePickerInput popover dismissal and scroll behavior and improved mobile clock touch gestures.",
    notes: [
      "Made the anchored desktop TimePickerInput a modal Base UI Popover that locks document scrolling while open.",
      "Prevented outside pointer interactions from dismissing a draft while preserving Cancel, OK, trigger, and keyboard Escape behavior.",
      "Unified clock-number taps and clock-face drags under one captured pointer gesture so touch can begin anywhere on the dial.",
      "Kept literal option taps exact, deduplicated pointer updates, and prevented drag gestures from auto-advancing or committing twice.",
      "Improved 24-hour inner and outer ring detection and added mobile selection safeguards without changing the public API.",
    ],
    links: [
      { href: "/docs/components/time-picker", label: "View Time Picker docs" },
      { href: "/docs/changelog", label: "Read changelog" },
    ],
  },
  {
    slug: "time-picker-mobile-dialog-fix",
    date: "July 23, 2026",
    isoDate: "2026-07-23",
    title: "Time Picker Mobile Dialog Fix",
    badge: "Release",
    summary:
      "Fixed TimePickerDialog mobile positioning and improved clock touch interaction reliability.",
    notes: [
      "Kept the mobile Dialog centered through the Base UI portal at every breakpoint instead of changing it into a document-positioned bottom sheet.",
      "Added dynamic viewport and safe-area bounds so the Dialog remains usable on narrow or short screens with internally scrollable content.",
      "Unified clock touch and pointer handling around one captured gesture with fresh geometry, exact or stepped precision, and duplicate-value suppression.",
      "Separated taps from drags so clean taps can auto-advance while drag gestures keep the active view stable and finalize without duplicate updates.",
    ],
    links: [
      { href: "/docs/components/time-picker", label: "View Time Picker docs" },
      { href: "/docs/changelog", label: "Read changelog" },
    ],
  },
  {
    slug: "time-picker",
    date: "July 22, 2026",
    isoDate: "2026-07-22",
    title: "Time Picker",
    badge: "Release",
    summary:
      "A production-ready Time Picker system for desktop, mobile, and static layouts with precise clock and list selection, formatting, constraints, and form-ready controls.",
    notes: [
      "Added TimePicker, TimePickerInput, and TimePickerDialog with shared provider and context architecture and canonical HH:mm or HH:mm:ss values.",
      "Added desktop Popover and mobile Dialog controls plus static portrait and landscape variants with clock and list selection modes.",
      "Added 12-hour and 24-hour formats, minute and second steps, exact or stepped touch precision, and accessible hour, minute, second, and AM/PM controls.",
      "Added display format presets, custom display tokens, min and max boundaries, and disabled-time matchers without changing the canonical value model.",
      "Added configurable Now, Clear, Reset, Cancel, OK, and opt-in one-minute precision actions with clean draft, commit, and cancel behavior.",
      "Added Time Picker form submission and combined Date and Time examples with toast feedback and explicit serialization guidance.",
      "Published Time Picker through the registry with its component source, theme-aware stylesheet, npm dependencies, and required baseui-cn primitives.",
    ],
    links: [
      { href: "/docs/components/time-picker", label: "View Time Picker docs" },
      { href: "/docs/changelog", label: "Read changelog" },
    ],
    examples: [
      {
        href: "/docs/components/time-picker",
        label: "Desktop and mobile pickers",
        description:
          "Use an anchored desktop Popover, mobile Dialog, or static clock and list surface from one component family.",
      },
      {
        href: "/docs/components/time-picker",
        label: "Date and time forms",
        description:
          "Keep Date objects and canonical time strings separate while your application owns timezone serialization.",
      },
    ],
  },
  {
    slug: "date-picker-range-and-accessibility-fixes",
    date: "July 14, 2026",
    isoDate: "2026-07-14",
    title: "Date Picker Range And Accessibility Fixes",
    badge: "Release",
    summary:
      "Refined range selection, custom month and year navigation, and multi-month layout behavior following community accessibility and usability feedback.",
    notes: [
      "Prevented disabled and duplicate outside days from inheriting selected range endpoint or middle styling.",
      "Added clear theme-aware focus outlines to month, year, and caption controls for keyboard users.",
      "Stabilized multi-month panel dimensions so opening either month or year selector does not shift the adjacent calendar, presets, or footer.",
      "Made the first click after a completed range start a new two-click range selection from any date.",
      "Changed Escape handling so an open month or year selector returns to days before a subsequent Escape closes the picker.",
    ],
    links: [
      { href: "/docs/components/date-picker", label: "View Date Picker docs" },
      { href: "/docs/changelog", label: "Read changelog" },
    ],
  },
  {
    slug: "cli-dependency-conflict-safety",
    date: "July 13, 2026",
    isoDate: "2026-07-13",
    title: "CLI Dependency Conflict Safety",
    badge: "Release",
    summary:
      "Added an explicit, safe dependency conflict flow so existing project components can be reused, deliberately replaced, or cancelled before any component files are written.",
    notes: [
      "Added a Reuse existing files, Replace existing files, and Cancel selector when transitive dependency component files already exist.",
      "Made reuse the default selection and the automatic behavior for --yes, protecting customized project components.",
      "Kept requested component conflicts in a separate replace or skip prompt and preserved --overwrite as the explicit replace-everything option.",
      "Stopped dependency resolution output before prompting and continued installing required npm packages even when dependency component files are reused.",
    ],
    links: [
      { href: "/docs/installation", label: "View installation docs" },
      { href: "/docs/components/date-picker", label: "View Date Picker docs" },
    ],
  },
  {
    slug: "cli-dependency-reuse-fix",
    date: "July 13, 2026",
    isoDate: "2026-07-13",
    title: "CLI Dependency Reuse Fix",
    badge: "Release",
    summary:
      "Fixed add command behavior so existing dependency components are reused by default instead of prompting to replace them, with clean spinner and prompt sequencing during dependency resolution.",
    notes: [
      "Separated explicitly requested component conflicts from existing transitive dependency components during add commands.",
      "Existing dependency files are now reported clearly and reused by default, preserving project customizations unless --overwrite is provided.",
      "Stopped the dependency resolver spinner before printing conflict details or waiting for user input so prompts are always visible and responsive.",
      "Kept the existing replace or skip flow for explicitly requested components that already have target files.",
    ],
    links: [
      { href: "/docs/installation", label: "View installation docs" },
      { href: "/docs/components/date-picker", label: "View Date Picker docs" },
    ],
  },
  {
    slug: "date-picker-and-date-range-picker",
    date: "July 13, 2026",
    isoDate: "2026-07-13",
    title: "Date Picker And Date Range Picker",
    badge: "Release",
    summary:
      "A new production-ready Date Picker system with single-date and date-range controls, form-ready inputs, presets, formatting, and theme-aware registry installation.",
    notes: [
      "Added production-ready DatePicker, DatePickerInput, DateRangePicker, and DateRangePickerInput components with stable month and year navigation.",
      "Integrated picker controls with the standard Input, Field, and Popover components for consistent labels, focus states, clear actions, and accessibility.",
      "Added common date format presets, custom date-fns display formats, partial range labels, and immediate draft updates for range selections and presets.",
      "Added built-in date-range presets plus Base UI form examples that validate Date values and report submitted dates through toast feedback.",
      "Mapped the calendar stylesheet to global theme and radius tokens for polished light, dark, inline, and popover presentations.",
      "Published Date Picker through the registry with its component source, stylesheet, DayPicker and date-fns dependencies, and required baseui-cn components.",
    ],
    links: [
      { href: "/docs/components/date-picker", label: "View Date Picker docs" },
      { href: "/docs/changelog", label: "Read changelog" },
    ],
    examples: [
      {
        href: "/docs/components/date-picker",
        label: "Date and range inputs",
        description:
          "Use labeled, form-ready controls for single dates, date ranges, presets, and custom display formats.",
      },
      {
        href: "/docs/components/date-picker",
        label: "Theme-aware calendars",
        description:
          "Install inline and popover calendars that inherit the application's color and radius tokens.",
      },
    ],
  },
  {
    slug: "base-ui-1-6-compatibility-and-cli-fix",
    date: "July 9, 2026",
    isoDate: "2026-07-09",
    title: "Base UI 1.6 Compatibility And CLI Fix",
    badge: "Release",
    summary:
      "A compatibility release that updates the registry baseline to Base UI 1.6, moves OTP Field to the stable API, and fixes the CLI runtime for new Windows developers.",
    notes: [
      "Updated the Base UI dependency baseline and generated registry metadata to target @base-ui/react ^1.6.0.",
      "Switched OTP Field from the preview primitive to the stable OTPField API and refreshed examples for numeric, grouped, alphanumeric, masked, and auto-submit flows.",
      "Updated OTP Field docs and registry labels to the stable Base UI primitive.",
      "Pinned the CommonJS CLI runtime dependencies to CJS-compatible versions so npx execution no longer crashes on ESM-only Chalk.",
      "Regenerated registry and docs artifacts so installs, source previews, and catalog metadata stay aligned with the new package version.",
    ],
    links: [
      { href: "/docs/components/otp-field", label: "View OTP field docs" },
      { href: "/docs/components/drawer", label: "View drawer docs" },
      { href: "/docs/changelog", label: "Read changelog" },
    ],
    examples: [
      {
        href: "/docs/components/otp-field",
        label: "Stable OTP Field",
        description:
          "Use the stable Base UI OTP Field primitive for verification and recovery-code flows.",
      },
      {
        href: "/docs/components/otp-field",
        label: "Masked entry",
        description:
          "Obscure one-time codes on shared screens while keeping the same installable component.",
      },
    ],
  },
  {
    slug: "combobox-and-fieldset-legend-upgrade",
    date: "April 22, 2026",
    isoDate: "2026-04-22",
    title: "Combobox And Fieldset Legend Upgrade",
    badge: "Release",
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
        description:
          "Use the updated async combobox pattern for teammate search and assignment flows.",
      },
      {
        href: "/docs/components/combobox",
        label: "Filter chips with overflow",
        description:
          "Build denser filter bars by combining multi-select chips with collapsed overflow handling.",
      },
      {
        href: "/docs/components/fieldset",
        label: "Settings sections",
        description:
          "Use bordered FieldsetLegend variants and sizes to structure forms, preferences, and account panels.",
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
        description:
          "Share a clearer docs starting point when teammates are new to the component registry.",
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
        description:
          "Build searchable command palettes and workspace shortcuts with richer grouped interactions.",
      },
      {
        href: "/docs/components/data-grid",
        label: "Editable admin tables",
        description:
          "Use the data grid family for inline editing, async states, and optimistic table workflows.",
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
        description:
          "Ship login and signup flows with stronger validation, alerts, and success feedback.",
      },
    ],
  },
]

export const latestChangelogEntry = changelogEntries[0]
