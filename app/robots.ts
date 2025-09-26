import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://shipport.com'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/profile/',  // Allow public profile pages
        ],
        disallow: [
          '/dashboard/',
          '/api/',
          '/auth/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
