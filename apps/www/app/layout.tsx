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
    "Base UI components with one-command install. One primitive layer. No Vaul. Tailwind styled.",
  metadataBase: new URL("https://baseui-cn.com"),
  openGraph: {
    title: "baseui-cn",
    description: "Base UI components with one-command install. One primitive layer. No Vaul. Tailwind styled.",
    url: "https://baseui-cn.com",
    siteName: "baseui-cn",
    images: [{ url: "/og", width: 1200, height: 630, alt: "baseui-cn" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "baseui-cn",
    description: "Base UI components with one-command install. One primitive layer. No Vaul. Tailwind styled.",
    images: ["/og"],
  },
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
