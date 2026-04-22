import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Analytics } from "@vercel/analytics/react"
import { ThemeProvider } from "@/components/theme"
import { ToastProvider } from "@/components/ui/toast"
import { TooltipProvider } from "@/components/ui/tooltip"
import { siteConfig } from "@/lib/site-config"

const inter = Inter({ subsets: ["latin"] })

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords:
    "base ui components, base ui react components, shadcn base ui components, base ui component library, tailwind css components, accessible react components, nextjs ui components",
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: "Base UI Components for React - baseui-cn",
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: "/baseui-cn-og.png",
        width: 1200,
        height: 630,
        alt: "baseui-cn - Base UI components for React",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Base UI Components for React - baseui-cn",
    description: siteConfig.description,
    images: ["/baseui-cn-og.png"],
    creator: "@baseui_cn",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteConfig.url,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const isProduction = process.env.NODE_ENV === "production"

  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider>
          <ToastProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </ToastProvider>
        </ThemeProvider>
        {isProduction && <Analytics />}
      </body>
    </html>
  )
}
