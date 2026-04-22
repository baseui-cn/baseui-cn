import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export function proxy(_request: NextRequest) {
  const response = NextResponse.next()
  const vercelEnv = process.env.VERCEL_ENV ?? process.env.NEXT_PUBLIC_VERCEL_ENV

  if (vercelEnv && vercelEnv !== "production") {
    response.headers.set("X-Robots-Tag", "noindex, nofollow")
  }

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
