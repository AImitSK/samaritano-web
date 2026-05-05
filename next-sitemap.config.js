/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com',
  generateRobotsTxt: false, // Wir haben unsere eigene robots.txt
  generateIndexSitemap: false,
  exclude: ['/api/*', '/studio/*'],
  changefreq: 'weekly',
  priority: 0.7,
}
