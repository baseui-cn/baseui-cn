import { ImageResponse } from "next/og"

export const size = { width: 32, height: 32 }
export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
        }}
      >
        {/* Outer square (back, offset) */}
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <rect x="7" y="7" width="22" height="22" rx="4"
            stroke="black" strokeWidth="1.75" fill="none" />
          {/* Front square */}
          <rect x="1" y="1" width="22" height="22" rx="4"
            fill="black" stroke="black" strokeWidth="1.75" />
          {/* Inner bars - white knockout */}
          <rect x="6" y="7" width="12" height="4" rx="1.25" fill="white" />
          <rect x="6" y="14" width="8" height="4" rx="1.25" fill="white" />
        </svg>
      </div>
    ),
    { ...size }
  )
}
