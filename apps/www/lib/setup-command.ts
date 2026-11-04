import { type BodyFont, type HeadingFont } from "./typography-presets"

import {
  themePresets,
  defaultColor,
  defaultRadius,
  type ColorPreset,
  type RadiusPreset,
} from "./theme-presets"

export const setupFrameworks = [
  { value: "next", label: "Next.js" },
  { value: "tanstack-start", label: "TanStack Start" },
  { value: "react-router", label: "React Router" },
  { value: "vite", label: "Vite" },
  { value: "react", label: "Custom React" },
] as const
export const setupManagers = ["npm", "pnpm", "yarn", "bun"] as const
export type SetupFramework = (typeof setupFrameworks)[number]["value"]
export type SetupManager = (typeof setupManagers)[number]
export interface SetupInput {
  framework: SetupFramework
  projectMode: "new" | "existing"
  structure: "single" | "monorepo"
  packageManager: SetupManager
  projectName: string
  workspace: string
  color?: ColorPreset
  radius?: RadiusPreset
  bodyFont?: BodyFont
  headingFont?: HeadingFont
}
export function packageInvocation(pm: SetupManager) {
  return { npm: "npx", pnpm: "pnpm dlx", yarn: "yarn dlx", bun: "bunx" }[pm]
}
export function setupCommand(input: SetupInput): {
  primary: string
  followUp?: string
  description: string
  error?: string
} {
  if (
    !setupManagers.includes(input.packageManager) ||
    !setupFrameworks.some((f) => f.value === input.framework) ||
    !["new", "existing"].includes(input.projectMode) ||
    !["single", "monorepo"].includes(input.structure)
  )
    return { primary: "", description: "", error: "Choose a supported setup configuration." }
  const invoke = `${packageInvocation(input.packageManager)} baseui-cn@latest`
  if (
    (input.color !== undefined && !Object.hasOwn(themePresets.colors, input.color)) ||
    (input.radius !== undefined && !Object.hasOwn(themePresets.radii, input.radius))
  )
    return { primary: "", description: "", error: "Choose supported appearance presets." }
  const themeFlags =
    input.projectMode === "new"
      ? ` --color ${input.color ?? defaultColor} --radius ${input.radius ?? defaultRadius}`
      : `${input.color ? ` --color ${input.color}` : ""}${input.radius ? ` --radius ${input.radius}` : ""}`
  // Public npm latest is 1.4.1. Hidden typography state must never affect copied commands.
  const appearanceFlags = themeFlags
  const label = setupFrameworks.find((f) => f.value === input.framework)!.label
  if (input.projectMode === "new") {
    if (input.framework === "react")
      return {
        primary: "",
        description: "Custom React uses your existing application.",
        error: "Choose a framework to create a new app, or switch to Existing project.",
      }
    if (
      !/^[a-z0-9][a-z0-9-]{0,99}$/.test(input.projectName) ||
      ["node_modules", "favicon.ico"].includes(input.projectName)
    )
      return {
        primary: "",
        description: "",
        error: "Use lowercase letters, numbers and hyphens for the project name.",
      }
    return {
      primary: `${invoke} create ${input.projectName} --framework ${input.framework} --package-manager ${input.packageManager}${input.structure === "monorepo" ? " --monorepo" : ""}${appearanceFlags}`,
      followUp: `cd ${input.projectName}${input.structure === "monorepo" ? "/apps/web" : ""} && ${input.packageManager} run dev`,
      description: `Official ${label} scaffold + baseui-cn.${input.structure === "monorepo" ? " App in apps/web." : " Ready to add components."}${input.packageManager === "yarn" ? " Requires Yarn 2+." : ""}`,
    }
  }
  if (
    input.structure === "monorepo" &&
    input.workspace &&
    !/^[a-zA-Z0-9_][a-zA-Z0-9_.-]*(?:\/[a-zA-Z0-9_][a-zA-Z0-9_.-]*)*$/.test(input.workspace)
  )
    return {
      primary: "",
      description: "",
      error: "Enter a relative workspace path, such as apps/web.",
    }
  return {
    primary: `${invoke} init${input.structure === "monorepo" && input.workspace ? ` --workspace ${input.workspace}` : ""}${appearanceFlags}`,
    followUp: `${invoke} add button${input.structure === "monorepo" && input.workspace ? ` --workspace ${input.workspace}` : ""}`,
    description: `${input.structure === "monorepo" ? "Run this from the existing workspace root." : `Run this from your existing ${label} app.`} Framework and package manager are detected automatically.${appearanceFlags ? " Applies your selected appearance values." : " Preserves your existing theme."}${input.structure === "monorepo" && !input.workspace ? " Choose an app when prompted." : ""}${input.packageManager === "yarn" ? " Runner requires Yarn 2+." : ""}`,
  }
}

/** Mode changes never reuse a hidden workspace or implicitly opt existing apps into styling. */
export function changeProjectMode(
  input: SetupInput,
  projectMode: SetupInput["projectMode"]
): SetupInput {
  if (input.projectMode === projectMode) return input
  return {
    ...input,
    projectMode,
    workspace: "",
    projectName: "my-app",
    framework: projectMode === "new" && input.framework === "react" ? "next" : input.framework,
    color: undefined,
    radius: undefined,
    bodyFont: undefined,
    headingFont: undefined,
  }
}
