import { MetadataRoute } from 'next'

export function GET(): Response {
  const robotsTxt = `User-agent: *
Allow: /

# High priority pages for Marine Superintendent, Marine Consultancy, Superintendancy
Sitemap: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://shipinport.com'}/sitemap.xml

# Crawl delay for better server performance
Crawl-delay: 1

# Block admin and private areas
Disallow: /dashboard/
Disallow: /api/
Disallow: /auth/
Disallow: /_next/
Disallow: /admin/

# Allow important SEO pages
Allow: /marine-superintendent-marine-consultancy-superintendancy
Allow: /services
Allow: /about
Allow: /contact
Allow: /blog
`

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}
