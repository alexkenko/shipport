import Link from 'next/link'
import { Metadata } from 'next'
import { HeaderWrapper } from '@/components/layout/HeaderWrapper'
import { AnimatedHero } from '@/components/ui/AnimatedHero'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Marine Superintendent - Jobs, Services & Career Guide | ShipinPort.com',
  description: 'Complete marine superintendent resource: jobs, services, and career guidance. Professional marine superintendent platform connecting vessel managers with certified superintendents. ISM, ISPS, MLC audits, vessel inspections, and maritime consulting worldwide.',
  keywords: 'marine superintendent jobs, marine superintendent, marine consultancy, superintendancy, marine superintendent services, marine superintendent positions, marine superintendent careers, vessel superintendent jobs, marine inspection services, ISM audit, ISPS audit, MLC audit, pre-vetting inspection, marine consultancy experts, maritime consulting, ship inspection, marine superintendent employment, vessel management, maritime professional services, marine compliance audit, vessel safety inspection, marine certification, marine superintendent platform, maritime jobs, shipping jobs, marine careers',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://shipinport.com',
  },
  openGraph: {
    title: 'Marine Superintendent Jobs & Marine Consultancy Services | ShipinPort.com',
    description: 'Find marine superintendent jobs worldwide. Leading marine superintendent and marine consultancy platform.',
    type: 'website',
    locale: 'en_US',
    siteName: 'ShipinPort.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Marine Superintendent Jobs & Marine Consultancy Services',
    description: 'Find marine superintendent jobs worldwide. Leading marine superintendent and marine consultancy platform.',
  },
}

export default function HomePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ShipinPort - Marine Superintendent; Marine Consultancy, Superintendancy",
    "description": "Leading Marine Superintendent and Marine Consultancy platform. Professional Superintendancy services for vessel inspections, ISM audits, marine consultancy, and maritime consulting worldwide.",
    "url": process.env.NEXT_PUBLIC_SITE_URL || "https://shipport.com",
    "logo": `${process.env.NEXT_PUBLIC_SITE_URL || "https://shipport.com"}/logo.png`,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-marine-950 to-dark-900">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Header */}
      <HeaderWrapper />
      
      {/* Animated Hero Section */}
      <AnimatedHero />

      {/* Services Section with Enhanced Animations */}
      <section className="py-20 bg-dark-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-slide-bottom">
              Professional Marine Services
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto animate-slide-bottom stagger-1">
              Comprehensive maritime services provided by certified professionals. 
              <Link href="/services" className="text-blue-400 hover:text-blue-300 underline ml-1">
                View all our services
              </Link> or 
              <Link href="/about" className="text-blue-400 hover:text-blue-300 underline ml-1">
                learn more about us
              </Link>.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Ship Inspections and Audits',
                description: 'Professional ship inspections and audits including ISM, ISPS, MLC compliance assessments by Qualified marine Superintendents.',
                icon: '📋'
              },
              {
                title: 'Port State Inspection',
                description: 'Expert port state inspection preparation services ensuring vessel compliance with international regulations by qualified Marine Superintendents.',
                icon: '🔍'
              },
              {
                title: 'SIRE 2.0 Vetting',
                description: 'Advanced SIRE 2.0 vetting preparation services by certified Marine Superintendents.',
                icon: '⚓'
              },
              {
                title: 'Marine Consultancy',
                description: 'Expert marine consultancy services for vessel operations, safety management, and regulatory compliance by certified Consultants.',
                icon: '🧭'
              },
              {
                title: 'Marine Superintendent Services',
                description: 'Professional marine superintendent services including vessel management and maritime consulting.',
                icon: '📦'
              }
            ].map((service, index) => (
              <div 
                key={index} 
                className={`glass p-6 rounded-xl hover:bg-dark-700/50 transition-all duration-300 transform hover:scale-105 hover:rotate-1 animate-slide-bottom stagger-${index + 1}`}
              >
                <div className="text-4xl mb-4 animate-float" style={{animationDelay: `${index * 0.5}s`}}>{service.icon}</div>
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
              How <span className="text-blue-700">Ship</span><span className="text-red-500">in</span><span className="text-blue-700">Port</span> Works
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Simple steps to connect with the right maritime professionals. 
              <Link href="/faq" className="text-blue-400 hover:text-blue-300 underline ml-1">
                Have questions?
              </Link> Check our 
              <Link href="/blog" className="text-blue-400 hover:text-blue-300 underline ml-1">
                blog
              </Link> for industry insights.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center animate-slide-left stagger-1">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Create Your Profile</h3>
              <p className="text-gray-300">
                Register as a Vessel Manager or Marine Superintendent and create your professional profile.
              </p>
            </div>
            
            <div className="text-center animate-slide-bottom stagger-2">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse" style={{animationDelay: '0.5s'}}>
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Find or Post Services</h3>
              <p className="text-gray-300">
                Managers post job requirements while Superintendents search for opportunities that match their expertise.
              </p>
            </div>
            
            <div className="text-center animate-slide-right stagger-3">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse" style={{animationDelay: '1s'}}>
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Connect & Collaborate</h3>
              <p className="text-gray-300">
                Get notified when there's a match and connect directly to discuss your maritime project needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Marine Superintendent Jobs Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600/10 to-primary-600/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Find <span className="text-primary-400">Marine Superintendent Jobs</span> Worldwide
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Discover <strong className="text-white">1000+ marine superintendent positions</strong> with leading shipping companies. 
              Browse <strong className="text-white">marine superintendent careers</strong> in ports worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/marine-superintendent-jobs">
                <Button size="lg" className="bg-primary-600 hover:bg-primary-700">
                  View All Marine Superintendent Jobs
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center bg-dark-800/50 p-6 rounded-lg">
              <div className="text-4xl font-bold text-blue-400 mb-2">1000+</div>
              <div className="text-gray-300">Active Marine Superintendent Jobs</div>
            </div>
            <div className="text-center bg-dark-800/50 p-6 rounded-lg">
              <div className="text-4xl font-bold text-green-400 mb-2">150+</div>
              <div className="text-gray-300">Shipping Companies Hiring</div>
            </div>
            <div className="text-center bg-dark-800/50 p-6 rounded-lg">
              <div className="text-4xl font-bold text-purple-400 mb-2">$500</div>
              <div className="text-gray-300">Average Daily Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-20 bg-dark-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="animate-slide-left">
              <h2 className="text-3xl font-bold text-white mb-6">
                Professional <span className="text-primary-400">Marine Superintendent</span> Services
              </h2>
              <p className="text-gray-300 mb-4">
                Our platform connects vessel managers with certified <strong className="text-white">marine superintendents</strong> 
                specializing in comprehensive <strong className="text-white">ship inspections and audits</strong>. Our professionals 
                provide expert <strong className="text-white">marine consultancy</strong> services including <strong className="text-white">port state inspection</strong>, 
                <strong className="text-white"> oil major inspection</strong>, and <strong className="text-white">vetting</strong> services.
              </p>
              <p className="text-gray-300 mb-4">
                We specialize in <strong className="text-white">SIRE 2.0</strong> compliance and advanced vessel risk assessments. 
                Our <strong className="text-white">marine superintendent</strong> network includes certified professionals with extensive 
                experience in maritime safety, regulatory compliance, and vessel management operations.
              </p>
              <div className="mt-6">
                <Link href="/marine-superintendent-jobs">
                  <Button className="bg-primary-600 hover:bg-primary-700">
                    Find Marine Superintendent Jobs
                  </Button>
                </Link>
              </div>
            </div>
            <div className="animate-slide-right">
              <h3 className="text-2xl font-bold text-white mb-6">
                Comprehensive Maritime Inspection Services
              </h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start animate-slide-bottom stagger-1">
                  <span className="text-primary-400 mr-3">✓</span>
                  <span><strong className="text-white">Ship inspections and audits</strong> - ISM, ISPS, MLC compliance assessments</span>
                </li>
                <li className="flex items-start animate-slide-bottom stagger-2">
                  <span className="text-primary-400 mr-3">✓</span>
                  <span><strong className="text-white">Port state inspection</strong> - International regulation compliance verification</span>
                </li>
                <li className="flex items-start animate-slide-bottom stagger-3">
                  <span className="text-primary-400 mr-3">✓</span>
                  <span><strong className="text-white">Oil major inspection</strong> - Tanker and offshore vessel assessments</span>
                </li>
                <li className="flex items-start animate-slide-bottom stagger-4">
                  <span className="text-primary-400 mr-3">✓</span>
                  <span><strong className="text-white">SIRE 2.0 vetting</strong> - Advanced vessel risk evaluation systems</span>
                </li>
                <li className="flex items-start animate-slide-bottom" style={{animationDelay: '1s'}}>
                  <span className="text-primary-400 mr-3">✓</span>
                  <span><strong className="text-white">Marine consultancy</strong> - Expert maritime operational guidance</span>
                </li>
              </ul>
              <div className="mt-6">
                <Link href="/services">
                  <Button variant="outline">
                    View All Services
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}