import { track } from "@vercel/analytics"

export function trackEvent(name: string, props?: Record<string, string | number | boolean>) {
  track(name, props)
}

// ── Copy events ──────────────────────────────────────────────────────────────

export function trackCopyInstallCommand(component: string, manager: string) {
  trackEvent("copy_install_command", { component, manager })
}

export function trackCopyCode(source: "preview" | "source" | "code_block", component?: string) {
  trackEvent("copy_code", { source, ...(component ? { component } : {}) })
}

// ── Component browsing ───────────────────────────────────────────────────────

export function trackComponentView(component: string) {
  trackEvent("component_view", { component })
}

export function trackComponentSourceExpand(component: string) {
  trackEvent("component_source_expand", { component })
}

// ── Search ───────────────────────────────────────────────────────────────────

export function trackSearchOpen(method: "click" | "shortcut") {
  trackEvent("search_open", { method })
}

export function trackSearchSelect(component: string) {
  trackEvent("search_select", { component })
}

// ── Navigation ───────────────────────────────────────────────────────────────

export function trackCTAClick(cta: string) {
  trackEvent("cta_click", { cta })
}

export function trackExternalLink(url: string) {
  trackEvent("external_link", { url })
}

// ── Theme ────────────────────────────────────────────────────────────────────

export function trackThemeChange(theme: string) {
  trackEvent("theme_change", { theme })
}
