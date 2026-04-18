import { createMDX } from "fumadocs-mdx/next"

const withMDX = createMDX()

/** @type {import("next").NextConfig} */
const nextConfig = {
  serverExternalPackages: ["@base-ui/react"],
}

export default withMDX(nextConfig)
