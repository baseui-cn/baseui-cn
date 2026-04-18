import { loader } from "fumadocs-core/source"
import { docs } from "collections"

const docsSource = docs.toFumadocsSource()
const resolvedDocsSource = (() => {
  const candidate = docsSource as typeof docsSource & { files: unknown }

  if (typeof candidate.files === "function") {
    return {
      ...docsSource,
      files: (candidate.files as () => typeof docsSource.files)(),
    }
  }

  return docsSource
})()

export const source = loader({
  baseUrl: "/docs/components",
  source: resolvedDocsSource,
})
