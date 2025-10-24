import Link from 'next/link'
import { Metadata } from 'next'
import { HeaderWrapper } from '@/components/layout/HeaderWrapper'
import { AnimatedHero } from '@/components/ui/AnimatedHero'
import { Button } from '@/components/ui/Button'
import { 
  ClipboardDocumentCheckIcon, 
  MagnifyingGlassIcon, 
  ShieldCheckIcon, 
  CogIcon, 
  CubeIcon,
  UserPlusIcon,
  BriefcaseIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline'

export const metadata: Metadata = {
  title: 'Marine Superintendent - Jobs, Services & Career Guide | ShipinPort.com',
  description: 'Complete marine superintendent resource: jobs, services, and career guidance. Professional marine superintendent platform connecting vessel managers with certified superintendents. ISM, ISPS, MLC audits, vessel inspections, and maritime consulting worldwide.',
  keywords: 'marine superintendent jobs, marine superintendent, marine consultancy, superintendancy, marine superintendent services, marine superintendent positions, marine superintendent careers, vessel superintendent jobs, marine inspection services, ISM audit, ISPS audit, MLC audit, pre-vetting inspection, marine consultancy experts, maritime consulting, ship inspection, marine superintendent employment, vessel management, maritime professional services, marine compliance audit, vessel safety inspection, marine certification, marine superintendent platform, maritime jobs, shipping jobs, marine careers',
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://shipinport.com',
  },
  openGraph: {
    title: 'Marine Superintendent Jobs & Marine Consultancy Services | ShipinPort.com',
    description: 'Find marine superintendent jobs worldwide. Leading marine superintendent and marine consultancy platform.',
    type: 'website',
    locale: 'en_US',
    siteName: 'ShipinPort.com',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ShipinPort - Marine Superintendent Jobs & Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Marine Superintendent Jobs & Marine Consultancy Services',
    description: 'Find marine superintendent jobs worldwide. Leading marine superintendent and marine consultancy platform.',
    images: ['/og-image.jpg'],
  },
}

// Force static generation
export const dynamic = 'force-static'
export const revalidate = 3600 // Revalidate every hour

export default function HomePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ShipinPort - Marine Superintendent; Marine Consultancy, Superintendancy",
    "description": "Leading Marine Superintendent and Marine Consultancy platform. Professional Superintendancy services for vessel inspections, ISM audits, marine consultancy, and maritime consulting worldwide.",
    "url": "https://shipinport.com",
    "logo": "https://shipinport.com/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-555-SHIPPORT",
      "contactType": "customer service",
      "availableLanguage": "English"
    },
    "sameAs": [
      "https://linkedin.com/company/shipinport",
      "https://twitter.com/shipinport"
    ],
    "service": [
      {
        "@type": "Service",
        "name": "Marine Superintendent Services",
        "description": "Professional marine superintendent services including ship inspections and audits, port state inspection, oil major inspection, vetting, and SIRE 2.0 compliance"
      },
      {
        "@type": "Service", 
        "name": "Marine Consultancy",
        "description": "Expert Marine Consultancy services for vessel operations, safety management, and regulatory compliance"
      },
      {
        "@type": "Service", 
        "name": "Superintendancy Services",
        "description": "Professional Superintendancy services for comprehensive vessel supervision and maritime operations management"
      },
      {
        "@type": "Service", 
        "name": "Ship Inspections and Audits",
        "description": "Comprehensive ship inspections and audits including ISM, ISPS, MLC compliance assessments"
      },
      {
        "@type": "Service", 
        "name": "Port State Inspection",
        "description": "Professional port state inspection services ensuring vessel compliance with international regulations"
      },
      {
        "@type": "Service", 
        "name": "Oil Major Inspection",
        "description": "Specialized oil major inspection services for tanker vessels and offshore operations"
      },
      {
        "@type": "Service", 
        "name": "SIRE 2.0 Vetting",
        "description": "Advanced SIRE 2.0 vetting services and vessel risk assessments for charter approval"
      }
    ],
    "areaServed": {
      "@type": "Place",
      "name": "Worldwide"
    }
  }

  const services = [
    {
      title: 'Ship Inspections and Audits',
      description: 'Professional ship inspections and audits including ISM, ISPS, MLC compliance assessments by Qualified marine Superintendents.',
      icon: ClipboardDocumentCheckIcon
    },
    {
      title: 'Port State Inspection',
      description: 'Expert port state inspection preparation services ensuring vessel compliance with international regulations by qualified Marine Superintendents.',
      icon: MagnifyingGlassIcon
    },
    {
      title: 'SIRE 2.0 Vetting',
      description: 'Advanced SIRE 2.0 vetting preparation services by certified Marine Superintendents.',
      icon: ShieldCheckIcon
    },
    {
      title: 'Marine Consultancy',
      description: 'Expert marine consultancy services for vessel operations, safety management, and regulatory compliance by certified Consultants.',
      icon: CogIcon
    },
    {
      title: 'Marine Superintendent Services',
      description: 'Professional marine superintendent services including vessel management and maritime consulting.',
      icon: CubeIcon
    }
  ]

  const howItWorksSteps = [
    {
      title: 'Create Your Profile',
      description: 'Register as a Vessel Manager or Marine Superintendent and create your professional profile.',
      icon: UserPlusIcon
    },
    {
      title: 'Find or Post Services',
      description: 'Managers post job requirements while Superintendents search for opportunities that match their expertise.',
      icon: BriefcaseIcon
    },
    {
      title: 'Connect & Collaborate',
      description: 'Get notified when there\'s a match and connect directly to discuss your maritime project needs.',
      icon: PaperAirplaneIcon
    }
  ]

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Header */}
      <HeaderWrapper />
      
      {/* Animated Hero Section */}
      <AnimatedHero />

      {/* Services Section */}
      <section className="py-20 bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Professional Marine Services
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Comprehensive maritime services provided by certified professionals. 
              <Link href="/services" className="text-blue-400 hover:text-blue-300 underline ml-1">
                View all our services
              </Link>.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-dark-700 p-8 rounded-xl transition-transform transform hover:scale-105">
                <service.icon className="h-10 w-10 text-primary-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">{service.title}</h3>
                <p className="text-gray-300">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How ShipinPort Works
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Simple steps to connect with the right maritime professionals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {howItWorksSteps.map((step, index) => (
              <div key={index}>
                <div className="flex items-center justify-center h-20 w-20 bg-primary-600 rounded-full mx-auto mb-6">
                  <step.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-gray-300">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marine Superintendent Jobs Section */}
      <section className="py-20 bg-blue-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Find <span className="text-primary-400">Marine Superintendent Jobs</span> Worldwide
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-8">
            Discover thousands of marine superintendent positions with leading shipping companies and advance your career in ports across the globe.
          </p>
          <Link href="/marine-superintendent-jobs">
            <Button size="lg">
              View All Marine Superintendent Jobs
            </Button>
          </Link>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">
                Your <span className="text-primary-400">Trusted Partner</span> in Maritime Excellence
              </h2>
              <p className="text-gray-300 mb-4">
                Our platform connects vessel managers with certified marine superintendents who specialize in comprehensive ship inspections and audits. Our professionals provide expert marine consultancy, including port state inspections, oil major inspections, and vetting services.
              </p>
              <p className="text-gray-300 mb-6">
                We are at the forefront of SIRE 2.0 compliance and advanced vessel risk assessments. Our network consists of certified professionals with extensive experience in maritime safety, regulatory compliance, and efficient vessel management.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/marine-superintendent-jobs">
                  <Button>
                    Find Superintendent Jobs
                  </Button>
                </Link>
                <Link href="/services">
                  <Button variant="outline">
                    Explore Our Services
                  </Button>
                </Link>
              </div>
            </div>
            <div>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start">
                  <ShieldCheckIcon className="h-6 w-6 text-primary-400 mr-3 mt-1 flex-shrink-0" />
                  <span><strong className="text-white">Ship Inspections & Audits:</strong> Full ISM, ISPS, and MLC compliance assessments.</span>
                </li>
                <li className="flex items-start">
                  <ShieldCheckIcon className="h-6 w-6 text-primary-400 mr-3 mt-1 flex-shrink-0" />
                  <span><strong className="text-white">Port State Inspection:</strong> Verifying compliance with all international regulations.</span>
                </li>
                <li className="flex items-start">
                  <ShieldCheckIcon className="h-6 w-6 text-primary-400 mr-3 mt-1 flex-shrink-0" />
                  <span><strong className="text-white">Oil Major Inspection:</strong> Specialized assessments for tanker and offshore vessels.</span>
                </li>
                <li className="flex items-start">
                  <ShieldCheckIcon className="h-6 w-6 text-primary-400 mr-3 mt-1 flex-shrink-0" />
                  <span><strong className="text-white">SIRE 2.0 Vetting:</strong> Advanced vessel risk evaluation and compliance.</span>
                </li>
                <li className="flex items-start">
                  <ShieldCheckIcon className="h-6 w-6 text-primary-400 mr-3 mt-1 flex-shrink-0" />
                  <span><strong className="text-white">Marine Consultancy:</strong> Expert guidance on all maritime operations.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}