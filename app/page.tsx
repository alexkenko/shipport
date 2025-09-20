import Link from 'next/link'
import { Metadata } from 'next'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'

export const metadata: Metadata = {
  title: 'ShipinPort.com - Connect Marine Superintendents with Vessel Managers | Professional Maritime Services',
  description: 'Professional platform connecting vessel managers with certified marine superintendents for inspections, audits, and maritime consulting. Find ISM, ISPS, MLC certified professionals worldwide.',
  keywords: 'marine superintendent platform, vessel manager network, marine inspection services, maritime professional services, ship superintendent jobs, marine consulting platform',
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
        "description": "Professional marine superintendent services including ISM ISPS MLC audits, vessel inspections, and maritime consulting"
      },
      {
        "@type": "Service", 
        "name": "Vessel Management Solutions",
        "description": "Comprehensive vessel management solutions connecting vessel managers with certified marine professionals"
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
              <span className="block text-primary-400">Superintendent Services</span>
              <span className="block text-2xl md:text-3xl font-normal text-gray-300 mt-2">
                <span className="text-blue-700">Ship</span>
                <span className="text-red-500">in</span>
                <span className="text-cyan-400">Port</span>
                <span className="text-gray-400">.com</span>
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Connect with certified marine superintendents for vessel inspections, ISM ISPS MLC audits, 
              pre-vetting inspections, and maritime consulting services worldwide.
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
                title: 'Pre-Vetting Inspections',
                description: 'Comprehensive vessel assessments for charter requirements and compliance verification.',
                icon: '🔍'
              },
              {
                title: 'ISM, ISPS, MLC Audits',
                description: 'Certified audits ensuring compliance with international maritime safety standards.',
                icon: '📋'
              },
              {
                title: 'Marine Consultancy',
                description: 'Expert advice on vessel operations, safety management, and regulatory compliance.',
                icon: '⚓'
              },
              {
                title: 'TMSA Preparation',
                description: 'Preparation and implementation of Tanker Management and Self Assessment programs.',
                icon: '🛢️'
              },
              {
                title: 'Navigation Audits',
                description: 'Comprehensive navigation system assessments and safety evaluations.',
                icon: '🧭'
              },
              {
                title: 'Cargo Supervision',
                description: 'Professional oversight of cargo operations ensuring safety and compliance.',
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


      {/* Footer */}
      <Footer />
    </div>
  )
}
