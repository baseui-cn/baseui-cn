"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { TerminalIcon, ArrowRightIcon, CheckIcon, XIcon, MoonIcon, SunIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@/components/ui/drawer"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { CopyButton } from "./copy-button"
import { useHomeTheme } from "./home-theme-provider"
import {
  themePresets,
  themeVariables,
  type ColorPreset,
  type RadiusPreset,
} from "@/lib/theme-presets"
import {
  setupCommand,
  changeProjectMode,
  setupFrameworks,
  setupManagers,
  packageInvocation,
  type SetupInput,
  type SetupManager,
} from "@/lib/setup-command"

const frameworkOptions = setupFrameworks.map((framework) =>
  framework.value === "react" ? { ...framework, label: "Existing React" } : framework
)

function Choices<T extends string>({
  label,
  value,
  choices,
  onChange,
}: {
  label: string
  value: T
  choices: readonly { value: T; label: string }[]
  onChange: (value: T) => void
}) {
  return (
    <fieldset className="setup-field">
      <legend>{label}</legend>
      <div className="setup-choices">
        {choices.map((choice) => (
          <Button
            key={choice.value}
            variant="ghost"
            type="button"
            aria-pressed={value === choice.value}
            onClick={() => onChange(choice.value)}
          >
            {choice.label}
          </Button>
        ))}
      </div>
    </fieldset>
  )
}
export function CreateProjectTrigger() {
  return (
    <DrawerTrigger render={<Button size="xl" className="home-create-trigger" />}>
      Create your project <ArrowRightIcon size={16} aria-hidden="true" />
    </DrawerTrigger>
  )
}
function StartingThemePreview() {
  const selection = useHomeTheme()
  const { resolvedTheme } = useTheme()
  const [mode, setMode] = React.useState<"light" | "dark" | null>(null)
  const actualMode = mode ?? (resolvedTheme === "dark" ? "dark" : "light")
  const values = themeVariables(selection.color, selection.radius, actualMode)
  const color = themePresets.colors[selection.color]
  const css = `:root {\n${Object.entries({
    ...color.light,
    "--radius": themePresets.radii[selection.radius].value,
  })
    .map(([key, value]) => `  ${key}: ${value};`)
    .join("\n")}\n}\n.dark {\n${Object.entries(color.dark)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join("\n")}\n}`
  return (
    <div
      className="setup-theme-preview"
      role="group"
      aria-label="Your starting theme preview"
      style={values as React.CSSProperties}
    >
      <div className="setup-preview-heading">
        <span>
          {color.label} / {themePresets.radii[selection.radius].label}
        </span>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Preview ${actualMode === "dark" ? "light" : "dark"} theme`}
          onClick={() => setMode(actualMode === "dark" ? "light" : "dark")}
        >
          {actualMode === "dark" ? (
            <SunIcon size={15} aria-hidden="true" />
          ) : (
            <MoonIcon size={15} aria-hidden="true" />
          )}
        </Button>
      </div>
      <div className="setup-preview-controls">
        <Input aria-label="Try your starting theme input" placeholder="Try a focus state…" />
        <CopyButton key={css} text={css} showLabel label="Copy theme CSS" variant="default" />
      </div>
      <div className="setup-preview-note">
        <Badge variant="outline">Editable source</Badge>
        <span>Your theme, in ordinary CSS.</span>
      </div>
    </div>
  )
}
export function SetupBuilder() {
  // The keyboard can shrink/pan the visual viewport without changing 100dvh.
  // Keep this landing composition inside it; Base UI still owns modal behavior.
  const viewportRef = React.useCallback((node: HTMLDivElement | null) => {
    const viewport = window.visualViewport
    if (!node || !viewport) return
    const update = () => {
      node.style.setProperty("--setup-viewport-height", `${viewport.height}px`)
      node.style.setProperty("--setup-viewport-top", `${viewport.offsetTop}px`)
    }
    update()
    viewport.addEventListener("resize", update)
    viewport.addEventListener("scroll", update)
    return () => {
      viewport.removeEventListener("resize", update)
      viewport.removeEventListener("scroll", update)
    }
  }, [])
  const preview = useHomeTheme()
  const [input, setInput] = React.useState<SetupInput>({
    framework: "next",
    projectMode: "new",
    structure: "single",
    packageManager: "npm",
    projectName: "my-app",
    workspace: "",
  })
  const set = <K extends keyof SetupInput>(key: K, value: SetupInput[K]) =>
    setInput((previous) => ({ ...previous, [key]: value }))
  const availableFrameworks = frameworkOptions.filter(
    (f) => input.projectMode === "existing" || f.value !== "react"
  )
  const command = setupCommand(
    input.projectMode === "new"
      ? {
          ...input,
          color: preview.color,
          radius: preview.radius,
        }
      : input
  )
  return (
    <DrawerContent ref={viewportRef} side="right" className="project-setup-drawer">
      <DrawerHeader className="project-setup-header">
        <div>
          <DrawerTitle>
            {input.projectMode === "new" ? "Create new project" : "Initialize existing project"}
          </DrawerTitle>
          <DrawerDescription>
            {input.projectMode === "new"
              ? "Create a fresh application in a new directory."
              : "Set up components inside an application you already have."}
          </DrawerDescription>
        </div>
        <DrawerClose
          render={<Button variant="ghost" size="icon-xl" aria-label="Close project setup" />}
        >
          <XIcon size={18} aria-hidden="true" />
        </DrawerClose>
      </DrawerHeader>
      <div className="setup-builder" role="group" aria-label="Build your setup command">
        <div
          className="setup-scroll"
          role="region"
          aria-label="Project configuration and generated command"
          tabIndex={0}
        >
          <div className="setup-body">
            <section className="setup-group" aria-labelledby="setup-configuration">
              <h3 id="setup-configuration">Configuration</h3>
              <div className="setup-framework">
                <label id="framework-label">Framework</label>
                <Select
                  value={input.framework}
                  items={Object.fromEntries(availableFrameworks.map((f) => [f.value, f.label]))}
                  onValueChange={(value) => {
                    if (value)
                      setInput((previous) => ({
                        ...previous,
                        framework: value,
                      }))
                  }}
                >
                  <SelectTrigger aria-labelledby="framework-label" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableFrameworks.map((f) => (
                      <SelectItem key={f.value} value={f.value}>
                        {f.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Choices
                label="Project"
                value={input.projectMode}
                choices={[
                  { value: "new", label: "New project" },
                  { value: "existing", label: "Existing project" },
                ]}
                onChange={(value) => setInput((previous) => changeProjectMode(previous, value))}
              />
              <Choices
                label="Structure"
                value={input.structure}
                choices={[
                  { value: "single", label: "Single app" },
                  { value: "monorepo", label: "Monorepo" },
                ]}
                onChange={(value) => set("structure", value)}
              />
              <Choices
                label="Package manager"
                value={input.packageManager}
                choices={setupManagers.map((value) => ({ value, label: value }))}
                onChange={(value) => set("packageManager", value)}
              />
            </section>
            <section className="setup-group" aria-labelledby="setup-appearance">
              <h3 id="setup-appearance">Appearance</h3>
              <fieldset className="setup-field setup-color-field">
                <legend>Theme color</legend>
                <div className="setup-swatches">
                  {Object.entries(themePresets.colors).map(([id, preset]) => (
                    <Button
                      key={id}
                      type="button"
                      variant="ghost"
                      className="theme-swatch-button"
                      aria-label={`${preset.label} theme`}
                      title={preset.label}
                      aria-pressed={preview.color === id}
                      onClick={() => {
                        preview.setColor(id as ColorPreset)
                        set("color", id as ColorPreset)
                      }}
                    >
                      <span
                        style={{
                          backgroundColor: preset.light["--primary"],
                          color: preset.light["--primary-foreground"],
                        }}
                      >
                        {preview.color === id && <CheckIcon size={12} aria-hidden="true" />}
                      </span>
                    </Button>
                  ))}
                </div>
              </fieldset>
              <Choices
                label="Radius"
                value={preview.radius}
                choices={Object.entries(themePresets.radii).map(([value, preset]) => ({
                  value: value as RadiusPreset,
                  label: preset.label,
                }))}
                onChange={(value) => {
                  preview.setRadius(value)
                  set("radius", value)
                }}
              />
              <StartingThemePreview />
              {input.projectMode === "existing" && (
                <p className="setup-theme-safety">
                  {input.color || input.radius ? (
                    <>
                      Selected appearance values will replace existing CSS.{" "}
                      <button
                        type="button"
                        onClick={() =>
                          setInput((previous) => ({
                            ...previous,
                            color: undefined,
                            radius: undefined,
                            bodyFont: undefined,
                            headingFont: undefined,
                          }))
                        }
                      >
                        Preserve existing theme
                      </button>
                    </>
                  ) : (
                    "Your existing theme is preserved. Choose appearance values to explicitly change it."
                  )}
                </p>
              )}
            </section>
            {(input.projectMode === "new" || input.structure === "monorepo") && (
              <section className="setup-group" aria-labelledby="setup-project-details">
                <h3 id="setup-project-details">
                  {input.projectMode === "new" ? "Your project" : "Workspace"}
                </h3>
                {input.projectMode === "new" ? (
                  <div className="setup-name">
                    <label htmlFor="setup-project">Project name</label>
                    <Input
                      id="setup-project"
                      value={input.projectName}
                      onChange={(e) => set("projectName", e.target.value)}
                      spellCheck={false}
                      autoComplete="off"
                      aria-invalid={!!command.error}
                      aria-describedby={command.error ? "setup-error" : undefined}
                    />
                  </div>
                ) : (
                  <div className="setup-name">
                    <p>Run this from the existing workspace root.</p>
                    <label htmlFor="setup-workspace">
                      Workspace <span>(optional)</span>
                    </label>
                    <Input
                      id="setup-workspace"
                      value={input.workspace}
                      onChange={(e) => set("workspace", e.target.value)}
                      placeholder="apps/web"
                      spellCheck={false}
                      autoComplete="off"
                      aria-invalid={!!command.error}
                      aria-describedby={command.error ? "setup-error" : undefined}
                    />
                  </div>
                )}
              </section>
            )}
            <p className="setup-caption" aria-live="polite">
              {command.description}
            </p>
          </div>
          <div className="setup-output">
            <div className="setup-output-label">
              <span>
                <TerminalIcon size={14} aria-hidden="true" /> Generated command
              </span>
              <span>{input.packageManager}</span>
            </div>
            {command.error ? (
              <p id="setup-error" role="status" className="setup-error">
                {command.error}
              </p>
            ) : (
              <pre data-base-ui-swipe-ignore tabIndex={0} role="region" aria-label="Setup command">
                <code>{command.primary}</code>
              </pre>
            )}
            {!command.error && command.followUp && (
              <details className="setup-follow-up">
                <summary data-base-ui-swipe-ignore>
                  Then, {input.projectMode === "new" ? "start your app" : "add a component"}
                </summary>
                <div>
                  <code>{command.followUp}</code>
                  <CopyButton key={command.followUp} text={command.followUp} />
                </div>
              </details>
            )}
          </div>
        </div>
        <div className="setup-output-actions">
          {!command.error && (
            <CopyButton
              key={command.primary}
              text={command.primary}
              showLabel
              label="Copy command"
              variant="default"
            />
          )}
          <DrawerClose render={<Button variant="outline" />}>Done</DrawerClose>
        </div>
      </div>
    </DrawerContent>
  )
}
export function QuickInstall() {
  const [pm, setPm] = React.useState<SetupManager>("npm")
  return (
    <div className="quick-install">
      <Choices
        label="Package manager"
        value={pm}
        choices={setupManagers.map((value) => ({ value, label: value }))}
        onChange={setPm}
      />
      {["init", "add button input dialog"].map((command, index) => (
        <div className="quick-command" key={command}>
          <span className="quick-number">0{index + 1}</span>
          <pre
            tabIndex={0}
            role="region"
            aria-label={index ? "Add components command" : "Initialize command"}
          >
            <code>
              {packageInvocation(pm)} baseui-cn@latest {command}
            </code>
          </pre>
          <CopyButton text={`${packageInvocation(pm)} baseui-cn@latest ${command}`} />
        </div>
      ))}
      <p>
        Inside an existing React app with Tailwind CSS v4.
        <br />
        Using Yarn? The dlx runner requires Yarn 2+.
      </p>
    </div>
  )
}
