// Local production routes and exact registry bytes, with version derived from the candidate.
import assert from "node:assert/strict"
import fs from "node:fs/promises"
import path from "node:path"
import crypto from "node:crypto"
const root = path.resolve(import.meta.dirname, "..")
const origin = process.env.LANDING_ORIGIN ?? "http://127.0.0.1:3152"
assert.ok(["localhost", "127.0.0.1"].includes(new URL(origin).hostname))
const { version } = JSON.parse(await fs.readFile(path.join(root, "packages/cli/package.json")))
const index = JSON.parse(await fs.readFile(path.join(root, "packages/registry/index.json")))
const files = (await fs.readdir(path.join(root, "apps/www/public/registry")))
  .filter((p) => p.endsWith(".json"))
  .sort()
const routes = [
  "/",
  "/docs",
  "/docs/installation",
  "/docs/theming",
  "/docs/changelog",
  "/docs/changelog/rss.xml",
  "/docs/llms",
  "/llms.txt",
  "/robots.txt",
  "/sitemap.xml",
  ...index.components.map((c) => "/docs/components/" + c.name),
  ...index.components.map((c) => "/" + c.name),
  ...files.map((p) => "/registry/" + p),
]
const results = []
for (let offset = 0; offset < routes.length; offset += 5)
  results.push(
    ...(await Promise.all(
      routes.slice(offset, offset + 5).map(async (route) => {
        const response = await fetch(origin + route)
        assert.equal(response.status, 200, route)
        const data = Buffer.from(await response.arrayBuffer())
        if (route.startsWith("/registry/")) {
          assert.deepEqual(
            data,
            await fs.readFile(path.join(root, "apps/www/public", route)),
            route
          )
          assert.equal(JSON.parse(data).version, version)
        }
        return {
          route,
          status: response.status,
          sha256: crypto.createHash("sha256").update(data).digest("hex"),
        }
      })
    ))
  )
if (process.env.RELEASE_EVIDENCE) {
  await fs.mkdir(process.env.RELEASE_EVIDENCE, { recursive: true })
  await fs.writeFile(
    path.join(process.env.RELEASE_EVIDENCE, "endpoints.json"),
    JSON.stringify(
      { origin, version, passed: results.length, registryByteMatches: files.length, results },
      null,
      2
    ) + "\n"
  )
}
console.log(
  `PASS ${results.length}/${routes.length} endpoints, ${files.length} exact registry byte matches (${version})`
)
