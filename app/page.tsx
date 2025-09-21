import Link from 'next/link'
import { Metadata } from 'next'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'

export const metadata: Metadata = {
  title: 'Marine Superintendent Services | Ship Inspections & Audits | Port State Inspection | Oil Major Inspection | SIRE 2.0 | ShipinPort.com',
  description: 'Professional Marine Superintendent services including ship inspections and audits, port state inspection, oil major inspection, vetting, SIRE 2.0, and marine consultancy. Connect with certified maritime professionals worldwide.',
  keywords: 'marine superintendent, marine consultancy, ship inspections and audits, port state inspection, oil major inspection, vetting, SIRE 2.0, marine superintendent services, vessel inspections, maritime audits, marine consulting, ship superintendent, maritime professional services, marine inspection services, vessel management, maritime consulting platform',
}

export default function HomePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ShipinPort",
    "description": "Professional Marine Superintendent Services & Vessel Management Solutions",
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
        "description": "Expert marine consultancy services for vessel operations, safety management, and regulatory compliance"
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
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/waves.svg')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Professional Marine
              <span className="block text-white">Superintendent Services</span>
              <span className="block text-2xl md:text-3xl font-normal text-gray-300 mt-2">
                <span className="text-blue-700">Ship</span>
                <span className="text-red-500">in</span>
                <span className="text-cyan-400">Port</span>
                <span className="text-gray-400">.com</span>
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Professional <strong className="text-white">Marine Superintendent</strong> services including <strong className="text-white">ship inspections and audits</strong>, 
              <strong className="text-white"> port state inspection</strong>, <strong className="text-white">oil major inspection</strong>, 
              <strong className="text-white">vetting</strong>, <strong className="text-white">SIRE 2.0</strong>, and <strong className="text-white">marine consultancy</strong> worldwide.
            </p>
            <div className="flex flex-col gap-4 justify-center items-center">
              <Link
                href="/auth/register"
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 w-full sm:w-auto"
              >
                Create Account
              </Link>
              <Link
                href="/auth/login"
                className="border-2 border-primary-400 text-primary-400 hover:bg-primary-400 hover:text-dark-900 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 w-full sm:w-auto text-center"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-dark-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Professional Marine Services
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Comprehensive maritime services provided by certified professionals
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Ship Inspections and Audits',
                description: 'Professional ship inspections and audits including ISM, ISPS, MLC compliance assessments.',
                icon: '📋'
              },
              {
                title: 'Port State Inspection',
                description: 'Expert port state inspection services ensuring vessel compliance with international regulations.',
                icon: '🔍'
              },
              {
                title: 'Oil Major Inspection',
                description: 'Comprehensive oil major inspection services for tanker vessels and offshore operations.',
                icon: '🛢️'
              },
              {
                title: 'SIRE 2.0 Vetting',
                description: 'Advanced SIRE 2.0 vetting services and vessel risk assessments for charter approval.',
                icon: '⚓'
              },
              {
                title: 'Marine Consultancy',
                description: 'Expert marine consultancy services for vessel operations, safety management, and regulatory compliance.',
                icon: '🧭'
              },
              {
                title: 'Marine Superintendent Services',
                description: 'Professional marine superintendent services including vessel management and maritime consulting.',
                icon: '📦'
              }
            ].map((service, index) => (
              <div key={index} className="glass p-6 rounded-xl hover:bg-dark-700/50 transition-all duration-300">
                <div className="text-4xl mb-4">{service.icon}</div>
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
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Simple steps to connect with the right maritime professionals
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Create Your Profile</h3>
              <p className="text-gray-300">
                Register as a Vessel Manager or Marine Superintendent and create your professional profile.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Find or Post Services</h3>
              <p className="text-gray-300">
                Managers post job requirements while Superintendents search for opportunities that match their expertise.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
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

      {/* SEO Content Section */}
      <section className="py-20 bg-dark-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
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
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">
                Comprehensive Maritime Inspection Services
              </h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="text-primary-400 mr-3">✓</span>
                  <span><strong className="text-white">Ship inspections and audits</strong> - ISM, ISPS, MLC compliance assessments</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-400 mr-3">✓</span>
                  <span><strong className="text-white">Port state inspection</strong> - International regulation compliance verification</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-400 mr-3">✓</span>
                  <span><strong className="text-white">Oil major inspection</strong> - Tanker and offshore vessel assessments</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-400 mr-3">✓</span>
                  <span><strong className="text-white">SIRE 2.0 vetting</strong> - Advanced vessel risk evaluation systems</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-400 mr-3">✓</span>
                  <span><strong className="text-white">Marine consultancy</strong> - Expert maritime operational guidance</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
