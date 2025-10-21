import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { Footer } from '@/components/layout/Footer'
import { SpeedInsights } from '@vercel/speed-insights/next'
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics'

const inter = Inter({ subsets: ['latin'] })

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export const metadata: Metadata = {
  title: 'ShipinPort.com - Marine Superintendent; Marine Consultancy, Superintendancy Services',
  description: 'Professional Marine Superintendent and Marine Consultancy services. Connect with certified superintendents for vessel inspections, ISM ISPS MLC audits, pre-vetting inspections, and maritime consulting worldwide.',
  keywords: [
    'Marine Superintendent',
    'Marine Consultancy',
    'Superintendancy',
    'marine superintendent services',
    'marine consultancy services',
    'superintendancy services',
    'vessel superintendent',
    'marine inspection services',
    'ISM audit',
    'ISPS audit',
    'MLC audit',
    'pre-vetting inspection',
    'TMSA preparation',
    'bulk vessel inspection',
    'pre purchase inspection',
    'cargo supervision',
    'navigation audit',
    'flag state inspection',
    'marine safety compliance',
    'VDR analysis',
    'marine accident investigation',
    'vessel management services',
    'port state control',
    'marine certification',
    'maritime consulting',
    'ship inspection',
    'marine superintendent jobs',
    'vessel manager platform',
    'marine industry networking',
    'shipping industry services',
    'marine compliance audit',
    'vessel safety inspection',
    'maritime professional services',
    'marine superintendent certification'
  ],
  authors: [{ name: 'ShipinPort Team' }],
  creator: 'ShipinPort',
  publisher: 'ShipinPort',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://shipinport.com'),
        openGraph: {
          title: 'ShipinPort.com - Marine Superintendent; Marine Consultancy, Superintendancy Services',
          description: 'Professional Marine Superintendent and Marine Consultancy services. Connect with certified superintendents for vessel inspections, audits, and maritime consulting worldwide.',
          url: 'https://shipinport.com',
          siteName: 'ShipinPort',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ShipinPort.com - Marine Superintendent Services',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
        twitter: {
          card: 'summary_large_image',
          title: 'ShipinPort.com - Marine Superintendent; Marine Consultancy, Superintendancy',
          description: 'Professional Marine Superintendent and Marine Consultancy services. Leading Superintendancy platform for vessel inspections, audits, and maritime consulting worldwide.',
          images: ['/og-image.jpg'],
        },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#0f172a" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="ShipinPort" />
        <meta name="msapplication-TileColor" content="#0f172a" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Performance optimizations */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://xumhixssblldxhteyakk.supabase.co" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "ShipinPort",
              "url": "https://shipinport.com",
              "logo": "https://shipinport.com/logo.png",
              "description": "Professional Marine Superintendent and Marine Consultancy services",
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "url": "https://shipinport.com/contact"
              },
              "sameAs": [
                "https://shipinport.com"
              ],
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "Global"
              },
              "serviceType": [
                "Marine Superintendent Services",
                "Marine Consultancy",
                "Superintendancy",
                "Vessel Inspections",
                "ISM ISPS MLC Audits",
                "Pre-vetting Inspections",
                "Maritime Consulting"
              ]
            })
          }}
        />
      </head>
      <body className={`${inter.className} bg-dark-900 text-white min-h-screen`}>
        <GoogleAnalytics />
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e293b',
              color: '#fff',
              border: '1px solid #334155',
            },
          }}
        />
        <SpeedInsights />
      </body>
    </html>
  )
}