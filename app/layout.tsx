import type { Metadata, Viewport } from "next"
import { Inter, Vazirmatn } from "next/font/google"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { QueryProvider } from "@/components/providers/query-provider"
import { SiteHeader } from "@/components/layout/site-header"
import { Toaster } from "sonner"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazirmatn",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://ketabyar.ir"),
  title: {
    default: "کتاب‌یار - پلتفرم مطالعه آنلاین",
    template: "%s | کتاب‌یار"
  },
  description: "پلتفرم مطالعه آنلاین با امکانات پیشرفته برای یادگیری زبان انگلیسی. با هوش مصنوعی Gemini 2.5 Flash، واژگان هوشمند، و تجربه مطالعه واقع‌گرایانه.",
  keywords: ["کتاب", "مطالعه", "آنلاین", "یادگیری", "زبان انگلیسی", "کتاب‌یار", "AI", "هوش مصنوعی", "Gemini"],
  authors: [{ name: "تیم کتاب‌یار" }],
  creator: "کتاب‌یار",
  publisher: "کتاب‌یار",
  openGraph: {
    type: "website",
    locale: "fa_IR",
    url: "https://ketabyar.ir",
    title: "کتاب‌یار - پلتفرم مطالعه آنلاین",
    description: "پلتفرم مطالعه آنلاین با امکانات پیشرفته برای یادگیری زبان انگلیسی",
    siteName: "کتاب‌یار",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "کتاب‌یار",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "کتاب‌یار - پلتفرم مطالعه آنلاین",
    description: "پلتفرم مطالعه آنلاین با امکانات پیشرفته برای یادگیری زبان انگلیسی",
    images: ["/og-image.png"],
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
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#BE8348" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
  ],
}

import { SiteFooter } from "@/components/layout/site-footer"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className={`${inter.variable} ${vazirmatn.variable} font-vazirmatn antialiased min-h-screen flex flex-col`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <SiteHeader />
            <main className="flex-1">
              {children}
            </main>
            <SiteFooter />
            <Toaster position="bottom-left" richColors />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
