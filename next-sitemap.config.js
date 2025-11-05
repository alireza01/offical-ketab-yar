/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://ketabyar.ir',
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  sitemapSize: 7000,
  changefreq: 'daily',
  priority: 0.7,
  exclude: [
    '/admin/*',
    '/auth/*',
    '/dashboard',
    '/dashboard/*',
    '/library',
    '/profile',
    '/profile/*',
    '/settings',
    '/settings/*',
    '/subscription',
    '/subscription/*',
    '/vocabulary',
    '/review',
    '/books/read/*',
    '/api/*',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/auth/',
          '/dashboard/',
          '/profile/',
          '/settings/',
          '/subscription/',
          '/vocabulary/',
          '/review/',
          '/books/read/',
          '/api/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/auth/',
          '/dashboard/',
          '/profile/',
          '/settings/',
          '/subscription/',
          '/vocabulary/',
          '/review/',
          '/books/read/',
          '/api/',
        ],
      },
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_APP_URL || 'https://ketabyar.ir'}/sitemap.xml`,
    ],
  },
  transform: async (config, path) => {
    // Custom priority for important pages
    let priority = config.priority
    let changefreq = config.changefreq

    if (path === '/') {
      priority = 1.0
      changefreq = 'daily'
    } else if (path.startsWith('/books/')) {
      priority = 0.9
      changefreq = 'weekly'
    } else if (path === '/about' || path === '/library') {
      priority = 0.8
      changefreq = 'weekly'
    } else if (path.startsWith('/(main)/')) {
      priority = 0.7
      changefreq = 'monthly'
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    }
  },
}
