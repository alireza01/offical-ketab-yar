import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"
import { QueryProvider } from "@/components/providers/query-provider"
import { ThemeProvider } from "@/components/providers/theme-provider"
import type { Metadata, Viewport } from "next"
import { Inter, Vazirmatn } from "next/font/google"
import Script from "next/script"
import { Toaster } from "sonner"
import "./globals.css"

/**
 * ✅ AGENT 2 (Performance): Optimized font loading with preload
 * Using next/font for automatic optimization and zero layout shift
 */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  fallback: ['system-ui', 'arial'],
})

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazirmatn",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  preload: true,
  fallback: ['system-ui', 'tahoma'],
})

/**
 * ✅ AGENT 1 (SEO): Comprehensive metadata for maximum Google visibility
 * Includes rich keywords, proper OG tags, and structured data hints
 */
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://ketabyar.ir"),
  title: {
    default: "کتاب‌یار - پلتفرم هوشمند مطالعه آنلاین با AI | یادگیری زبان انگلیسی",
    template: "%s | کتاب‌یار"
  },
  description: "دانلود رایگان و مطالعه آنلاین بیش از 1000 کتاب برتر دنیا با هوش مصنوعی Gemini 2.5 Flash. پلتفرم کتاب‌یار با ورق زدن واقعی صفحات، واژگان هوشمند، گیمیفیکیشن و پشتیبانی دوزبانه فارسی-انگلیسی برای یادگیری زبان.",
  keywords: [
    // High-volume Persian keywords (exact match for searches)
    "دانلود کتاب",
    "دانلود رایگان کتاب",
    "دانلود کتاب رایگان",
    "مطالعه آنلاین کتاب",
    "کتاب آنلاین",
    "پلتفرم کتاب",
    "کتاب رایگان",
    "کتاب pdf",

    // Specific book-related keywords
    "دانلود کتاب انگلیسی",
    "دانلود کتاب فارسی",
    "کتاب دوزبانه",
    "کتاب انگلیسی فارسی",

    // Learning keywords
    "یادگیری زبان انگلیسی",
    "یادگیری با کتاب",
    "واژگان انگلیسی",
    "آموزش زبان",

    // Technology keywords
    "هوش مصنوعی",
    "AI",
    "Gemini",
    "کتاب هوشمند",

    // Brand & English keywords
    "کتاب‌یار",
    "ketab yar",
    "ketabyar",
    "book reader",
    "online reading",
    "bilingual books",
    "learn English",
    "vocabulary builder",
    "gamification",
    "reading platform",
    "ebook reader",
    "free books"
  ],
  authors: [{ name: "تیم کتاب‌یار", url: "https://ketabyar.ir/about" }],
  creator: "کتاب‌یار",
  publisher: "کتاب‌یار",
  applicationName: "کتاب‌یار",
  category: "Education",
  classification: "Education, Books, Language Learning",
  openGraph: {
    type: "website",
    locale: "fa_IR",
    alternateLocale: ["en_US"],
    url: "https://ketabyar.ir",
    title: "کتاب‌یار - پلتفرم هوشمند مطالعه آنلاین با AI",
    description: "تجربه مطالعه متفاوت با هوش مصنوعی، پشتیبانی دوزبانه و ورق زدن واقعی صفحات. بیش از 1000 کتاب برتر دنیا.",
    siteName: "کتاب‌یار",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "کتاب‌یار - پلتفرم مطالعه آنلاین",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "کتاب‌یار - پلتفرم هوشمند مطالعه آنلاین با AI",
    description: "تجربه مطالعه متفاوت با هوش مصنوعی، پشتیبانی دوزبانه و ورق زدن واقعی صفحات",
    images: ["/og-image.png"],
    creator: "@ketabyar",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://ketabyar.ir",
    languages: {
      'fa-IR': 'https://ketabyar.ir',
      'en-US': 'https://ketabyar.ir/en',
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon-16x16.png",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#C9A961",
      },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "کتاب‌یار",
  },
  formatDetection: {
    telephone: false,
    date: false,
    email: false,
    address: false,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    // yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
  },
}

/**
 * ✅ AGENT 3 (Psychology): Viewport optimized for native app feel
 * Proper scaling and theme colors for premium experience
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  minimumScale: 1,
  userScalable: true,
  viewportFit: "cover", // For notched devices
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#C9A961" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
  ],
}


/**
 * ✅ AGENT 1 (SEO): JSON-LD Structured Data for Organization
 * Helps Google understand our brand and improves rich snippets
 */
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "کتاب‌یار",
  alternateName: "Ketab Yar",
  url: "https://ketabyar.ir",
  logo: "https://ketabyar.ir/logo.png",
  description: "پلتفرم هوشمند مطالعه آنلاین با هوش مصنوعی",
  sameAs: [
    "https://twitter.com/ketabyar",
    "https://instagram.com/ketabyar",
    "https://linkedin.com/company/ketabyar",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Customer Support",
    email: "support@ketabyar.ir",
    availableLanguage: ["Persian", "English"],
  },
}

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "کتاب‌یار",
  url: "https://ketabyar.ir",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://ketabyar.ir/search?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        {/* ✅ AGENT 2 (Performance): Resource hints for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* ✅ AGENT 1 (SEO): Structured Data */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={`${inter.variable} ${vazirmatn.variable} font-vazirmatn antialiased min-h-screen flex flex-col`}>
        {/* ✅ Accessibility: Skip to main content link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-gold-500 focus:text-white focus:rounded-lg"
        >
          پرش به محتوای اصلی
        </a>

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <SiteHeader />
            <main id="main-content" className="flex-1" tabIndex={-1}>
              {children}
            </main>
            <SiteFooter />
            <Toaster
              position="bottom-left"
              richColors
              closeButton
              duration={4000}
            />
          </QueryProvider>
        </ThemeProvider>

        {/* ✅ AGENT 2 (Performance): Service Worker registration for PWA */}
        {process.env.NODE_ENV === 'production' && (
          <Script
            id="register-sw"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js').then(
                      function(registration) {
                        console.log('SW registered: ', registration);
                      },
                      function(err) {
                        console.log('SW registration failed: ', err);
                      }
                    );
                  });
                }
              `,
            }}
          />
        )}
      </body>
    </html>
  )
}
