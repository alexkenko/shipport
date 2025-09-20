import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { DefaultSeo } from 'next-seo'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ShipPort - Professional Marine Superintendent Services & Vessel Management Solutions',
  description: 'Connect with certified marine superintendents for vessel inspections, ISM ISPS MLC audits, pre-vetting inspections, and maritime consulting services worldwide. Professional marine industry networking platform.',
  keywords: [
    'marine superintendent',
    'vessel manager',
    'marine inspection services',
    'ISM audit',
    'ISPS audit',
    'MLC audit',
    'pre-vetting inspection',
    'marine consultancy',
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
  authors: [{ name: 'ShipPort Team' }],
  creator: 'ShipPort',
  publisher: 'ShipPort',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://shipport.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'ShipPort - Professional Marine Superintendent Services & Vessel Management',
    description: 'Connect with certified marine superintendents for vessel inspections, audits, and maritime consulting services worldwide.',
    url: 'https://shipport.com',
    siteName: 'ShipPort',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ShipPort - Marine Superintendent Services',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ShipPort - Professional Marine Superintendent Services',
    description: 'Connect with certified marine superintendents for vessel inspections, audits, and maritime consulting services worldwide.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const defaultSEO = {
  title: 'ShipPort - Professional Marine Superintendent Services & Vessel Management Solutions',
  description: 'Connect with certified marine superintendents for vessel inspections, ISM ISPS MLC audits, pre-vetting inspections, and maritime consulting services worldwide.',
  canonical: 'https://shipport.com',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://shipport.com',
    title: 'ShipPort - Professional Marine Superintendent Services & Vessel Management',
    description: 'Connect with certified marine superintendents for vessel inspections, audits, and maritime consulting services worldwide.',
    siteName: 'ShipPort',
  },
  twitter: {
    handle: '@shipport',
    site: '@shipport',
    cardType: 'summary_large_image',
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
        <DefaultSeo {...defaultSEO} />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0f172a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={`${inter.className} bg-dark-900 text-white min-h-screen`}>
        {children}
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
      </body>
    </html>
  )
}
