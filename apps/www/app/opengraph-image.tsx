import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "baseui-cn — Base UI components. One command install."
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OGImage() {
  const interSemiBold = fetch(
    new URL("https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKv0E.woff2")
  ).then((res) => res.arrayBuffer())

  const interRegular = fetch(
    new URL("https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_fvQtMwCp50SjIw2boKoduKv0E.woff2")
  ).then((res) => res.arrayBuffer())

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#0a0a0a",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px 100px",
          fontFamily: "Inter",
          position: "relative",
        }}
      >
        {/* Logo mark */}
        <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 48 }}>
          <svg width="64" height="64" viewBox="0 0 32 32" fill="none">
            <rect x="7" y="7" width="22" height="22" rx="4" stroke="white" strokeWidth="1.75" />
            <rect x="1" y="1" width="22" height="22" rx="4" fill="#0a0a0a" stroke="white" strokeWidth="1.75" />
            <rect x="6" y="7" width="12" height="4" rx="1.25" fill="white" />
            <rect x="6" y="14" width="8" height="4" rx="1.25" fill="white" />
          </svg>
          <span style={{ fontSize: 52, fontWeight: 600, color: "white", letterSpacing: -1 }}>
            baseui-cn
          </span>
        </div>

        {/* Tagline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 56 }}>
          <span style={{ fontSize: 28, color: "rgba(255,255,255,0.55)", fontWeight: 400 }}>
            Base UI components. One primitive layer.
          </span>
          <span style={{ fontSize: 28, color: "rgba(255,255,255,0.55)", fontWeight: 400 }}>
            No Vaul. No Radix mixing. Just Base UI + Tailwind.
          </span>
        </div>

        {/* Install command */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: "#1a1a1a",
            border: "1px solid #2a2a2a",
            borderRadius: 12,
            padding: "16px 28px",
          }}
        >
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 22 }}>$</span>
          <span style={{ color: "#e4e4e7", fontSize: 22, letterSpacing: 0.5 }}>
            npx baseui-cn init
          </span>
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 40, marginTop: 48 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: 28, fontWeight: 600, color: "white" }}>40+</span>
            <span style={{ fontSize: 16, color: "rgba(255,255,255,0.4)" }}>components</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: 28, fontWeight: 600, color: "white" }}>1</span>
            <span style={{ fontSize: 16, color: "rgba(255,255,255,0.4)" }}>primitive library</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: 28, fontWeight: 600, color: "white" }}>MIT</span>
            <span style={{ fontSize: 16, color: "rgba(255,255,255,0.4)" }}>license</span>
          </div>
        </div>

        {/* Domain */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: 48,
            right: 100,
            fontSize: 18,
            color: "rgba(255,255,255,0.25)",
          }}
        >
          baseui-cn.com
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Inter",
          data: await interRegular,
          style: "normal",
          weight: 400,
        },
        {
          name: "Inter",
          data: await interSemiBold,
          style: "normal",
          weight: 600,
        },
      ],
    }
  )
}
