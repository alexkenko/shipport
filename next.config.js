/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  
  // Ensure proper SEO in production
  trailingSlash: false,
  
  // Force production mode for SEO
  reactStrictMode: true,
  
  images: {
    domains: [
      'localhost',
      'shipinport.com',
      'www.shipinport.com',
      'xumhixssblldxhteyakk.supabase.co',
      'images.unsplash.com'
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Bundle optimization
  experimental: {
    optimizePackageImports: ['@heroicons/react'],
  },
  
  // Compression and caching
  async redirects() {
    return [
      // Redirect www to apex
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.shipinport.com',
          },
        ],
        destination: 'https://shipinport.com/:path*',
        permanent: true,
      },
      // Legacy paths 301s
      { source: '/what-is-marine-superintendent', destination: '/marine-superintendent-marine-consultancy-superintendancy', permanent: true },
      { source: '/jobs', destination: '/marine-superintendent-jobs', permanent: true },
      { source: '/job', destination: '/marine-superintendent-jobs', permanent: true },
      { source: '/privacy-policy', destination: '/privacy', permanent: true },
      { source: '/terms-of-service', destination: '/terms', permanent: true },
      { source: '/sitemap.xml', destination: '/sitemap', permanent: true },
    ]
  },
  
  async headers() {
    return [
      // Explicit robots directive for public pages
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'index, follow',
          },
        ],
      },
      // Prevent indexing of private dashboard app
      {
        source: '/dashboard/(.*)',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
        ],
      },
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
  
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig
