import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://shipinport.com'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/profile/',  // Allow public profile pages
          '/auth/',     // Allow auth pages for SEO
          '/dashboard/', // Allow dashboard pages for SEO
        ],
        disallow: [
          '/api/',
          '/_next/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
