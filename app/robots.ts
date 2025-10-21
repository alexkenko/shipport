import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://shipinport.com'
  
  return {
    rules: [
      {
        userAgent: '*',
        // Public site should be crawlable
        allow: ['/', '/blog', '/services', '/about', '/contact', '/privacy', '/terms', '/cookies', '/faq', '/marine-superintendent-jobs', '/marine-superintendent-faq', '/marine-superintendent-marine-consultancy-superintendancy', '/profile/'],
        // Keep private and system paths out of the index
        disallow: [
          '/dashboard/', // private app area, requires auth
          '/api/',
          '/_next/',
          '/static/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
