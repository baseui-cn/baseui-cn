import { ImageResponse } from "next/og"

export const runtime = "edge"

export async function GET() {
  return new ImageResponse(
    <div
      style={{
        background: "#000",
        width: "1200px",
        height: "630px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "80px",
        fontFamily: "monospace",
        position: "relative",
      }}
    >
      {/* Grid pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "48px",
        }}
      >
        <div
          style={{
            background: "#fff",
            color: "#000",
            width: "40px",
            height: "40px",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "22px",
            fontWeight: 700,
          }}
        >
          B
        </div>
        <span style={{ color: "#fff", fontSize: "28px", fontWeight: 700 }}>
          baseui-cn
        </span>
      </div>

      {/* Headline */}
      <div
        style={{
          color: "#fff",
          fontSize: "64px",
          fontWeight: 700,
          lineHeight: 1.1,
          marginBottom: "24px",
          maxWidth: "900px",
        }}
      >
        Base UI components.
        <br />
        One command install.
      </div>

      {/* Subtext */}
      <div
        style={{
          color: "rgba(255,255,255,0.5)",
          fontSize: "24px",
          marginBottom: "48px",
        }}
      >
        No Vaul. No Radix. One primitive layer. Tailwind styled.
      </div>

      {/* Command */}
      <div
        style={{
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "10px",
          padding: "16px 24px",
          color: "rgba(255,255,255,0.8)",
          fontSize: "22px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <span style={{ color: "rgba(255,255,255,0.3)" }}>$</span>
        <span>npx baseui-cn init</span>
      </div>

      {/* Component count */}
      <div
        style={{
          position: "absolute",
          bottom: "80px",
          right: "80px",
          color: "rgba(255,255,255,0.3)",
          fontSize: "18px",
        }}
      >
        32 components · @base-ui/react v1.3.0
      </div>
    </div>,
    { width: 1200, height: 630 }
  )
}
