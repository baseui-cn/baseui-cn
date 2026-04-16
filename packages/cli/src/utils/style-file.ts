import path from "path"
import fs from "fs-extra"
import prompts from "prompts"

export interface StyleFileDetection {
  preferredPath: string
  candidates: string[]
  existingCandidates: string[]
}

function unique(values: string[]) {
  return [...new Set(values)]
}

export function getStyleFileCandidates(options: { hasSrcDir: boolean; hasAppDir: boolean }) {
  const { hasSrcDir, hasAppDir } = options

  return unique(
    [
      hasSrcDir && hasAppDir ? "src/app/globals.css" : null,
      hasAppDir ? "app/globals.css" : null,
      hasSrcDir ? "src/styles/globals.css" : null,
      "styles/globals.css",
      hasSrcDir ? "src/styles.css" : null,
      "styles.css",
      hasSrcDir ? "src/index.css" : null,
      "index.css",
      hasSrcDir ? "src/app.css" : null,
      "app.css",
    ].filter((value): value is string => Boolean(value))
  )
}

export async function detectStyleFiles(options: { hasSrcDir: boolean; hasAppDir: boolean }) {
  const candidates = getStyleFileCandidates(options)
  const existingCandidates: string[] = []

  for (const candidate of candidates) {
    if (await fs.pathExists(path.resolve(candidate))) {
      existingCandidates.push(candidate)
    }
  }

  return {
    preferredPath: existingCandidates[0] ?? candidates[0] ?? "app/globals.css",
    candidates,
    existingCandidates,
  } satisfies StyleFileDetection
}

export async function promptForStyleFile(options: {
  detection: StyleFileDetection
  initialValue: string
  message: string
  missingConfiguredPath?: string
}) {
  const { detection, initialValue, message, missingConfiguredPath } = options

  const choices = unique([initialValue, ...detection.existingCandidates, ...detection.candidates]).map(
    (value) => ({
      title: value,
      description:
        value === missingConfiguredPath
          ? "Configured path not found. Keep this and let baseui-cn create it."
          : detection.existingCandidates.includes(value)
            ? "Existing stylesheet"
            : "Suggested location",
      value,
    })
  )

  choices.push({
    title: "Enter a custom stylesheet path",
    description: "Use a different CSS file in your project",
    value: "__custom__",
  })

  const { styleFile } = await prompts({
    type: "select",
    name: "styleFile",
    message,
    choices,
    initial: Math.max(
      0,
      choices.findIndex((choice) => choice.value === initialValue)
    ),
  })

  if (!styleFile) return initialValue
  if (styleFile !== "__custom__") return styleFile

  const { customStyleFile } = await prompts({
    type: "text",
    name: "customStyleFile",
    message: "Enter the stylesheet path baseui-cn should update",
    initial: initialValue,
    validate: (value: string) => (value.trim().length ? true : "Enter a file path"),
  })

  return customStyleFile || initialValue
}
