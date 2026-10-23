"use client"

import * as React from "react"
import { MoonIcon, SunIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { themePresets, themeVariables, defaultColor, defaultRadius } from "@/lib/theme-presets"

const variables = [
  "background",
  "foreground",
  "primary",
  "accent",
  "ring",
  "border",
  "input",
  "radius",
]
export function HomeThemePreview() {
  const [dark, setDark] = React.useState(false)
  const selection = { color: defaultColor, radius: defaultRadius }
  const values = themeVariables(selection.color, selection.radius, dark ? "dark" : "light")
  return (
    <div className="theme-exhibit">
      <div className="theme-exhibit-code">
        <span className="source-file-label">your-theme.css</span>
        <pre>
          <code>
            <span className="text-muted-foreground">
              {dark ? ".dark" : ":root"} {"{"}
            </span>
            {variables.map((name) => (
              <span className="theme-variable" key={name}>
                <span>--{name}</span>
                <span>{values[`--${name}` as keyof typeof values]};</span>
              </span>
            ))}
            <span className="text-muted-foreground">{"}"}</span>
          </code>
        </pre>
      </div>
      <div
        className={`theme-exhibit-sample ${dark ? "dark" : ""}`}
        style={values as React.CSSProperties}
      >
        <div className="theme-mode-bar">
          <span>{dark ? "Graphite / Dark" : "Graphite / Light"}</span>
          <Button
            variant="outline"
            aria-label={`Preview ${dark ? "light" : "dark"} theme`}
            onClick={() => setDark((v) => !v)}
            size="icon"
          >
            {dark ? (
              <SunIcon size={15} aria-hidden="true" />
            ) : (
              <MoonIcon size={15} aria-hidden="true" />
            )}
          </Button>
        </div>
        <div className="theme-swatch-row">
          {["foreground", "primary", "accent", "ring", "border"].map((name) => (
            <span key={name} style={{ background: `var(--${name})` }} title={`--${name}`} />
          ))}
        </div>
        <Badge variant="outline">Your next idea</Badge>
        <h3>
          Same components.
          <br />
          Your point of view.
        </h3>
        <p>
          {themePresets.colors[selection.color].label} ·{" "}
          {themePresets.radii[selection.radius].label}. Your starting point, in ordinary CSS.
        </p>
        <label htmlFor="theme-preview-input" className="sr-only">
          Try the themed input
        </label>
        <Input id="theme-preview-input" placeholder="Try a focus state…" />
        <Button render={<a href="/docs/theming" />}>Make it yours</Button>
      </div>
    </div>
  )
}
