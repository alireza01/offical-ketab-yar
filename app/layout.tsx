import { ConditionalLayout } from "@/components/layout/conditional-layout"
import { QueryProvider } from "@/components/providers/query-provider"
import { ThemeProvider } from "@/components/providers/theme-provider"
import type { Metadata, Viewport } from "next"
import { Inter, Vazirmatn } from "next/font/google"
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
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://ketabyar.ir"),
  title: {
    default: "کتاب‌یار - پلتفرم هوشمند مطالعه دوزبانه با AI",
    template: "%s | کتاب‌یار"
  },
  description: "بیش از 1000 کتاب انگلیسی را رایگان و دوزبانه بخوانید. با هوش مصنوعی Gemini، واژگان هوشمند، گیمیفیکیشن و تجربه مطالعه واقع‌گرایانه. شروع رایگان، بدون نیاز به کارت اعتباری.",
  keywords: ["کتاب انگلیسی", "مطالعه آنلاین", "یادگیری زبان", "کتاب دوزبانه", "کتاب رایگان", "AI", "هوش مصنوعی", "Gemini", "واژگان انگلیسی", "کتاب‌یار", "book reading", "bilingual books"],
  authors: [{ name: "تیم کتاب‌یار" }],
  creator: "کتاب‌یار",
  publisher: "کتاب‌یار",
  openGraph: {
    type: "website",
    locale: "fa_IR",
    url: "https://ketabyar.ir",
    title: "کتاب‌یار - پلتفرم هوشمند مطالعه دوزبانه با AI",
    description: "بیش از 1000 کتاب انگلیسی را رایگان و دوزبانه بخوانید. با هوش مصنوعی، واژگان هوشمند و گیمیفیکیشن",
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
    title: "کتاب‌یار - پلتفرم هوشمند مطالعه دوزبانه با AI",
    description: "بیش از 1000 کتاب انگلیسی را رایگان و دوزبانه بخوانید. با هوش مصنوعی، واژگان هوشمند و گیمیفیکیشن",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://ketabyar.ir",
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
    { media: "(prefers-color-scheme: light)", color: "#C9A961" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
  ],
}


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
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
            <Toaster position="bottom-left" richColors />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
