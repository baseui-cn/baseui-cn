import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ToastProvider } from "@/components/ui/toast"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider } from "@/components/theme"

const inter = Inter({ subsets: ["latin"] })

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  metadataBase: new URL("https://baseui-cn.com"),
  title: {
    default: "baseui-cn",
    template: "%s — baseui-cn",
  },
  description:
    "A Base UI-first component registry with shadcn-style DX. " +
    "32 components built exclusively on @base-ui/react. " +
    "One command install. You own the code.",
  keywords: [
    "base ui",
    "base-ui",
    "react components",
    "component library",
    "tailwind",
    "shadcn",
    "headless ui",
    "accessible components",
    "nextjs",
    "open source",
  ],
  authors: [{ name: "baseui-cn", url: "https://baseui-cn.com" }],
  creator: "baseui-cn",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://baseui-cn.com",
    title: "baseui-cn — Base UI components. One command install.",
    description:
      "32 components built exclusively on @base-ui/react. " +
      "Tailwind styled. Copy into your project. No Vaul. No Radix mixing.",
    siteName: "baseui-cn",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "baseui-cn — Base UI components. One command install.",
    description:
      "32 components built on @base-ui/react. " +
      "shadcn-style DX. Tailwind. You own the code.",
    images: ["/opengraph-image"],
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
    canonical: "https://baseui-cn.com",
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
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "baseui-cn",
              description:
                "A Base UI-first component registry with shadcn-style DX. 32 components built on @base-ui/react.",
              url: "https://baseui-cn.com",
              applicationCategory: "DeveloperApplication",
              operatingSystem: "Any",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              author: {
                "@type": "Organization",
                name: "baseui-cn",
                url: "https://baseui-cn.com",
              },
            }),
          }}
        />
        <ThemeProvider>
          <ToastProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
