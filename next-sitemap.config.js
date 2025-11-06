/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://ketabyar.ir',
  generateRobotsTxt: false, // We have custom robots.txt
  generateIndexSitemap: true,
  exclude: [
    '/dashboard',
    '/dashboard/*',
    '/library',
    '/library/*',
    '/profile',
    '/profile/*',
    '/settings',
    '/settings/*',
    '/vocabulary',
    '/vocabulary/*',
    '/review',
    '/review/*',
    '/subscription',
    '/subscription/*',
    '/admin',
    '/admin/*',
    '/auth',
    '/auth/*',
    '/api/*',
    '/books/read/*',
    '/offline',
    '/Studio',
    '/Studio/*',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/library',
          '/profile',
          '/settings',
          '/vocabulary',
          '/review',
          '/subscription',
          '/admin',
          '/auth',
          '/api',
          '/books/read/',
          '/offline',
          '/Studio',
        ],
      },
    ],
  },
  // Agent 1 (SEO): Priority configuration
  priority: 1.0,
  changefreq: 'daily',
  transform: async (config, path) => {
    // Custom priority for different page types
    let priority = 0.7
    let changefreq = 'weekly'

    if (path === '/') {
      priority = 1.0
      changefreq = 'daily'
    } else if (path.startsWith('/books/')) {
      priority = 0.9
      changefreq = 'weekly'
    } else if (path.startsWith('/blog/')) {
      priority = 0.8
      changefreq = 'weekly'
    } else if (path.startsWith('/authors/')) {
      priority = 0.7
      changefreq = 'monthly'
    } else if (path === '/about') {
      priority = 0.6
      changefreq = 'monthly'
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
      alternateRefs: [
        {
          href: `https://ketabyar.ir${path}`,
          hreflang: 'fa',
        },
        {
          href: `https://ketabyar.ir${path}`,
          hreflang: 'en',
        },
      ],
    }
  },
  additionalPaths: async (config) => {
    // Add dynamic paths here if needed
    return []
  },
}
