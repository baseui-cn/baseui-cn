import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ToastProvider } from "@/components/ui/toast"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "baseui-cn",
    template: "%s — baseui-cn",
  },
  description:
    "A Base UI-first open component registry with shadcn-style DX. Copy, paste, and own your components.",
  metadataBase: new URL("https://baseui-cn.com"),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  )
}
