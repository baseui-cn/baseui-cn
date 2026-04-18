/**
 * Builds a JSON map of preview source snippets:
 * { "preview-name": "source code" }
 *
 * Each preview entry resolves to the code for that specific preview only,
 * including any top-level helpers it depends on. If a preview map points to
 * a demo imported from another preview file, that imported preview source is
 * resolved and inlined as well.
 *
 * Usage: node scripts/build-preview-sources.mjs
 */

import { mkdir, readdir, readFile, stat, writeFile } from "fs/promises"
import path from "path"
import ts from "typescript"

const PREVIEWS_DIR = path.resolve("apps/www/components/previews")
const OUTPUT_FILE = path.resolve("apps/www/lib/__generated__/preview-sources.json")
const APPS_WWW_DIR = path.resolve("apps/www")

const moduleCache = new Map()
const resolvedImportCache = new Map()

function isObject(value) {
  return value !== null && typeof value === "object"
}

function toPosixPath(filePath) {
  return filePath.split(path.sep).join("/")
}

async function pathExists(filePath) {
  try {
    await stat(filePath)
    return true
  } catch {
    return false
  }
}

async function resolveModulePath(specifier, fromFilePath) {
  const cacheKey = `${fromFilePath}::${specifier}`
  if (resolvedImportCache.has(cacheKey)) {
    return resolvedImportCache.get(cacheKey)
  }

  let basePath = null

  if (specifier.startsWith("@/")) {
    basePath = path.resolve(APPS_WWW_DIR, specifier.slice(2))
  } else if (specifier.startsWith(".")) {
    basePath = path.resolve(path.dirname(fromFilePath), specifier)
  }

  if (!basePath) {
    resolvedImportCache.set(cacheKey, null)
    return null
  }

  const candidates = [
    basePath,
    `${basePath}.tsx`,
    `${basePath}.ts`,
    `${basePath}.jsx`,
    `${basePath}.js`,
    path.join(basePath, "index.tsx"),
    path.join(basePath, "index.ts"),
    path.join(basePath, "index.jsx"),
    path.join(basePath, "index.js"),
  ]

  for (const candidate of candidates) {
    if (await pathExists(candidate)) {
      resolvedImportCache.set(cacheKey, candidate)
      return candidate
    }
  }

  resolvedImportCache.set(cacheKey, null)
  return null
}

function hasExportModifier(node) {
  return node.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword) ?? false
}

function hasDefaultModifier(node) {
  return node.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.DefaultKeyword) ?? false
}

function getNodeText(sourceFile, node) {
  return sourceFile.text.slice(node.getStart(sourceFile), node.end).trim()
}

function getPropertyNameText(name) {
  if (
    ts.isIdentifier(name) ||
    ts.isStringLiteral(name) ||
    ts.isNumericLiteral(name) ||
    ts.isNoSubstitutionTemplateLiteral(name)
  ) {
    return name.text
  }

  return null
}

function parsePreviewMap(statement) {
  if (!ts.isVariableStatement(statement)) return null

  for (const declaration of statement.declarationList.declarations) {
    if (!ts.isIdentifier(declaration.name)) continue
    if (!declaration.name.text.endsWith("PreviewMap")) continue
    if (!declaration.initializer || !ts.isObjectLiteralExpression(declaration.initializer)) continue

    const previewMap = new Map()

    for (const property of declaration.initializer.properties) {
      if (ts.isPropertyAssignment(property)) {
        const key = getPropertyNameText(property.name)
        if (!key) continue

        if (ts.isIdentifier(property.initializer)) {
          previewMap.set(key, property.initializer.text)
        }
      }

      if (ts.isShorthandPropertyAssignment(property)) {
        previewMap.set(property.name.text, property.name.text)
      }
    }

    return previewMap
  }

  return null
}

async function loadModule(filePath) {
  const normalizedPath = path.resolve(filePath)

  if (moduleCache.has(normalizedPath)) {
    return moduleCache.get(normalizedPath)
  }

  const source = await readFile(normalizedPath, "utf-8")
  const sourceFile = ts.createSourceFile(
    normalizedPath,
    source,
    ts.ScriptTarget.Latest,
    true,
    normalizedPath.endsWith(".tsx") || normalizedPath.endsWith(".jsx")
      ? ts.ScriptKind.TSX
      : ts.ScriptKind.TS
  )

  const moduleInfo = {
    filePath: normalizedPath,
    source,
    sourceFile,
    declarations: new Map(),
    exportedNames: new Map(),
    importBindings: new Map(),
    previewMap: new Map(),
    defaultExportLocalName: null,
  }

  for (const statement of sourceFile.statements) {
    if (ts.isImportDeclaration(statement)) {
      const importClause = statement.importClause
      if (!importClause) continue

      const statementText = getNodeText(sourceFile, statement)
      const moduleSpecifier = statement.moduleSpecifier.text

      if (importClause.name) {
        moduleInfo.importBindings.set(importClause.name.text, {
          kind: "default",
          localName: importClause.name.text,
          importedName: "default",
          isTypeOnly: importClause.isTypeOnly,
          moduleSpecifier,
          statementText,
        })
      }

      const namedBindings = importClause.namedBindings
      if (!namedBindings) continue

      if (ts.isNamespaceImport(namedBindings)) {
        moduleInfo.importBindings.set(namedBindings.name.text, {
          kind: "namespace",
          localName: namedBindings.name.text,
          importedName: "*",
          isTypeOnly: false,
          moduleSpecifier,
          statementText,
        })
        continue
      }

      for (const element of namedBindings.elements) {
        const importedName = element.propertyName?.text ?? element.name.text
        moduleInfo.importBindings.set(element.name.text, {
          kind: "named",
          localName: element.name.text,
          importedName,
          isTypeOnly: importClause.isTypeOnly || element.isTypeOnly,
          moduleSpecifier,
          statementText,
        })
      }

      continue
    }

    const previewMap = parsePreviewMap(statement)
    if (previewMap) {
      moduleInfo.previewMap = previewMap
      continue
    }

    if (ts.isFunctionDeclaration(statement) && statement.name) {
      const localName = statement.name.text
      moduleInfo.declarations.set(localName, {
        filePath: normalizedPath,
        localName,
        node: statement,
        text: getNodeText(sourceFile, statement),
      })

      if (hasExportModifier(statement)) {
        moduleInfo.exportedNames.set(localName, localName)
      }

      if (hasDefaultModifier(statement)) {
        moduleInfo.defaultExportLocalName = localName
      }

      continue
    }

    if (ts.isClassDeclaration(statement) && statement.name) {
      const localName = statement.name.text
      moduleInfo.declarations.set(localName, {
        filePath: normalizedPath,
        localName,
        node: statement,
        text: getNodeText(sourceFile, statement),
      })

      if (hasExportModifier(statement)) {
        moduleInfo.exportedNames.set(localName, localName)
      }

      if (hasDefaultModifier(statement)) {
        moduleInfo.defaultExportLocalName = localName
      }

      continue
    }

    if (
      ts.isInterfaceDeclaration(statement) ||
      ts.isTypeAliasDeclaration(statement) ||
      ts.isEnumDeclaration(statement)
    ) {
      const localName = statement.name.text
      moduleInfo.declarations.set(localName, {
        filePath: normalizedPath,
        localName,
        node: statement,
        text: getNodeText(sourceFile, statement),
      })

      if (hasExportModifier(statement)) {
        moduleInfo.exportedNames.set(localName, localName)
      }

      if (hasDefaultModifier(statement)) {
        moduleInfo.defaultExportLocalName = localName
      }

      continue
    }

    if (ts.isVariableStatement(statement)) {
      const text = getNodeText(sourceFile, statement)

      for (const declaration of statement.declarationList.declarations) {
        if (!ts.isIdentifier(declaration.name)) continue

        const localName = declaration.name.text
        moduleInfo.declarations.set(localName, {
          filePath: normalizedPath,
          localName,
          node: statement,
          text,
        })

        if (hasExportModifier(statement)) {
          moduleInfo.exportedNames.set(localName, localName)
        }
      }

      continue
    }

    if (ts.isExportAssignment(statement) && ts.isIdentifier(statement.expression)) {
      moduleInfo.defaultExportLocalName = statement.expression.text
      continue
    }

    if (ts.isExportDeclaration(statement) && statement.exportClause && ts.isNamedExports(statement.exportClause)) {
      for (const element of statement.exportClause.elements) {
        const exportedName = element.name.text
        const localName = element.propertyName?.text ?? exportedName
        moduleInfo.exportedNames.set(exportedName, localName)
      }
    }
  }

  moduleCache.set(normalizedPath, moduleInfo)
  return moduleInfo
}

function shouldCountIdentifierReference(identifier) {
  const parent = identifier.parent

  if (!parent) return true

  if (
    (ts.isFunctionDeclaration(parent) ||
      ts.isClassDeclaration(parent) ||
      ts.isInterfaceDeclaration(parent) ||
      ts.isTypeAliasDeclaration(parent) ||
      ts.isEnumDeclaration(parent) ||
      ts.isTypeParameterDeclaration(parent) ||
      ts.isParameter(parent) ||
      ts.isVariableDeclaration(parent) ||
      ts.isBindingElement(parent) ||
      ts.isImportClause(parent) ||
      ts.isImportSpecifier(parent) ||
      ts.isNamespaceImport(parent) ||
      ts.isExportSpecifier(parent)) &&
    parent.name === identifier
  ) {
    return false
  }

  if (
    (ts.isPropertyAssignment(parent) ||
      ts.isPropertyDeclaration(parent) ||
      ts.isPropertySignature(parent) ||
      ts.isMethodDeclaration(parent) ||
      ts.isMethodSignature(parent) ||
      ts.isGetAccessorDeclaration(parent) ||
      ts.isSetAccessorDeclaration(parent) ||
      ts.isEnumMember(parent)) &&
    parent.name === identifier
  ) {
    return false
  }

  if (ts.isPropertyAccessExpression(parent) && parent.name === identifier) {
    return false
  }

  if (ts.isQualifiedName(parent) && parent.right === identifier) {
    return false
  }

  if (ts.isJsxAttribute(parent) && parent.name === identifier) {
    return false
  }

  return true
}

function collectReferences(declarationNode, candidateNames) {
  const references = new Set()

  function visit(node) {
    if (ts.isIdentifier(node) && candidateNames.has(node.text) && shouldCountIdentifierReference(node)) {
      references.add(node.text)
    }

    ts.forEachChild(node, visit)
  }

  ts.forEachChild(declarationNode, visit)
  return references
}

function resolveImportedLocalName(moduleInfo, importBinding) {
  if (importBinding.kind === "default") {
    return moduleInfo.defaultExportLocalName
  }

  if (importBinding.kind === "named") {
    return moduleInfo.exportedNames.get(importBinding.importedName) ?? null
  }

  return null
}

async function resolvePreviewImport(moduleInfo, importBinding) {
  const resolvedPath = await resolveModulePath(importBinding.moduleSpecifier, moduleInfo.filePath)
  if (!resolvedPath) {
    return null
  }

  if (!toPosixPath(resolvedPath).startsWith(toPosixPath(PREVIEWS_DIR))) {
    return null
  }

  const importedModule = await loadModule(resolvedPath)
  const localName = resolveImportedLocalName(importedModule, importBinding)

  if (!localName) {
    return null
  }

  return {
    module: importedModule,
    localName,
  }
}

class SnippetCollector {
  constructor() {
    this.imports = new Map()
    this.declarations = new Map()
    this.visiting = new Set()
  }

  addImport(importBinding) {
    const key = `${importBinding.moduleSpecifier}::${importBinding.statementText}`
    if (!this.imports.has(key)) {
      this.imports.set(key, importBinding.statementText.trim())
    }
  }

  addDeclaration(key, text) {
    if (!this.declarations.has(key)) {
      this.declarations.set(key, text.trim())
    }
  }

  async collectDeclaration(moduleInfo, localName) {
    const declarationKey = `${moduleInfo.filePath}::${localName}`

    if (this.declarations.has(declarationKey) || this.visiting.has(declarationKey)) {
      return
    }

    const declaration = moduleInfo.declarations.get(localName)
    if (!declaration) {
      return
    }

    this.visiting.add(declarationKey)

    const candidateNames = new Set([
      ...moduleInfo.declarations.keys(),
      ...moduleInfo.importBindings.keys(),
    ])

    const references = collectReferences(declaration.node, candidateNames)

    for (const referenceName of references) {
      if (moduleInfo.declarations.has(referenceName)) {
        await this.collectDeclaration(moduleInfo, referenceName)
        continue
      }

      const importBinding = moduleInfo.importBindings.get(referenceName)
      if (!isObject(importBinding)) continue

      const previewImport = await resolvePreviewImport(moduleInfo, importBinding)

      if (previewImport) {
        await this.collectDeclaration(previewImport.module, previewImport.localName)

        if (referenceName !== previewImport.localName) {
          this.addDeclaration(
            `alias::${moduleInfo.filePath}::${referenceName}`,
            `const ${referenceName} = ${previewImport.localName}`
          )
        }

        continue
      }

      this.addImport(importBinding)
    }

    this.addDeclaration(declarationKey, declaration.text)
    this.visiting.delete(declarationKey)
  }

  render() {
    const imports = [...this.imports.values()]
    const declarations = [...this.declarations.values()]

    if (!imports.length && !declarations.length) {
      return ""
    }

    return [...imports, declarations.length ? "" : null, ...declarations]
      .filter((value) => value !== null)
      .join("\n\n")
      .trim()
  }
}

async function buildPreviewSource(filePath, bindingName) {
  const moduleInfo = await loadModule(filePath)
  const collector = new SnippetCollector()

  if (moduleInfo.declarations.has(bindingName)) {
    await collector.collectDeclaration(moduleInfo, bindingName)
    return collector.render()
  }

  const importBinding = moduleInfo.importBindings.get(bindingName)
  if (!isObject(importBinding)) {
    return ""
  }

  const previewImport = await resolvePreviewImport(moduleInfo, importBinding)
  if (!previewImport) {
    collector.addImport(importBinding)
    return collector.render()
  }

  await collector.collectDeclaration(previewImport.module, previewImport.localName)
  return collector.render()
}

async function main() {
  const files = await readdir(PREVIEWS_DIR)
  const previewFiles = files
    .filter((fileName) => fileName.endsWith("-previews.tsx"))
    .sort((left, right) => left.localeCompare(right))

  const previewSources = {}

  for (const fileName of previewFiles) {
    const filePath = path.join(PREVIEWS_DIR, fileName)
    const moduleInfo = await loadModule(filePath)

    for (const [previewName, bindingName] of moduleInfo.previewMap.entries()) {
      const code = await buildPreviewSource(filePath, bindingName)
      if (code) {
        previewSources[previewName] = code
      }
    }
  }

  await mkdir(path.dirname(OUTPUT_FILE), { recursive: true })
  await writeFile(OUTPUT_FILE, `${JSON.stringify(previewSources, null, 2)}\n`)
  console.log(
    `Built preview sources for ${Object.keys(previewSources).length} previews -> ${path.relative(process.cwd(), OUTPUT_FILE)}`
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
