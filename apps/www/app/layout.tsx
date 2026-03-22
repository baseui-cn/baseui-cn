import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ToastProvider } from "@/components/ui/toast"

const inter = Inter({ subsets: ["latin"] })

export const dynamic = "force-dynamic"

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
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "baseui-cn",
    description: "Base UI components with one-command install. One primitive layer. No Vaul. Tailwind styled.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme')||(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.classList.toggle('dark',t==='dark')}catch(e){}`,
          }}
        />
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  )
}
