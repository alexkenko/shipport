import { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'

export const metadata: Metadata = {
  title: 'Marine Superintendent; Marine Consultancy, Superintendancy - #1 Professional Services',
  description: 'Professional Marine Superintendent, Marine Consultancy, and Superintendancy services. Leading platform connecting vessel managers with certified marine superintendents and marine consultancy experts worldwide.',
  keywords: 'Marine Superintendent, Marine Consultancy, Superintendancy, marine superintendent services, marine consultancy services, superintendancy services, vessel superintendent, marine inspection services, ISM audit, ISPS audit, MLC audit, pre-vetting inspection, marine consultancy experts, maritime consulting, ship inspection, marine superintendent jobs, vessel management, maritime professional services, marine compliance audit, vessel safety inspection, marine certification, marine superintendent platform',
  openGraph: {
    title: 'Marine Superintendent; Marine Consultancy, Superintendancy - Professional Services',
    description: 'Leading Marine Superintendent, Marine Consultancy, and Superintendancy platform. Professional maritime services worldwide.',
    type: 'website',
  },
}

export default function MarineSuperintendentConsultancyPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Marine Superintendent; Marine Consultancy, Superintendancy",
    "description": "Professional Marine Superintendent, Marine Consultancy, and Superintendancy services for vessel inspections, audits, and maritime consulting worldwide.",
    "provider": {
      "@type": "Organization",
      "name": "ShipinPort",
      "url": "https://shipport.com"
    },
    "serviceType": "Marine Superintendent Services",
    "areaServed": "Worldwide",
    "availableChannel": {
      "@type": "ServiceChannel",
      "serviceUrl": "https://shpport.com",
      "serviceSmsNumber": "+1-555-SHIPPORT"
    },
    "offers": {
      "@type": "Offer",
      "category": "Marine Superintendent, Marine Consultancy, Superintendancy",
      "description": "Professional maritime services platform"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-marine-950 to-dark-900">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-[url('/waves.svg')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              <span className="text-blue-400">Marine Superintendent;</span>
              <span className="block text-cyan-400">Marine Consultancy,</span>
              <span className="block text-green-400">Superintendancy</span>
            </h1>
            <p className="text-2xl md:text-3xl text-gray-300 mb-8 max-w-5xl mx-auto">
              #1 Professional <strong className="text-white">Marine Superintendent</strong>, 
              <strong className="text-white"> Marine Consultancy</strong>, and 
              <strong className="text-white"> Superintendancy</strong> Platform Worldwide
            </p>
            <div className="flex flex-col gap-4 justify-center items-center">
              <Link
                href="/auth/register"
                className="bg-primary-600 hover:bg-primary-700 text-white px-12 py-6 rounded-lg text-xl font-semibold transition-all duration-200 w-full sm:w-auto"
              >
                Join as Marine Superintendent
              </Link>
              <Link
                href="/auth/register"
                className="border-2 border-primary-400 text-primary-400 hover:bg-primary-400 hover:text-dark-900 px-12 py-6 rounded-lg text-xl font-semibold transition-all duration-200 w-full sm:w-auto text-center"
              >
                Find Marine Consultancy Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-dark-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
              Professional <span className="text-blue-400">Marine Superintendent</span>, 
              <span className="text-cyan-400"> Marine Consultancy</span>, and 
              <span className="text-green-400"> Superintendancy</span> Services
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              Connect with certified marine superintendents and marine consultancy experts for comprehensive 
              superintendancy services including vessel inspections, audits, and maritime consulting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Marine Superintendent Services */}
            <div className="bg-dark-800 border border-dark-700 rounded-lg p-8 text-center hover:border-primary-500 transition-colors">
              <div className="text-4xl mb-4">🚢</div>
              <h3 className="text-2xl font-bold text-white mb-4">Marine Superintendent Services</h3>
              <p className="text-gray-300 mb-6">
                Professional Marine Superintendent services for vessel inspections, ISM audits, 
                pre-vetting inspections, and maritime consulting worldwide.
              </p>
              <Link
                href="/services"
                className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Learn More
              </Link>
            </div>

            {/* Marine Consultancy */}
            <div className="bg-dark-800 border border-dark-700 rounded-lg p-8 text-center hover:border-cyan-500 transition-colors">
              <div className="text-4xl mb-4">⚓</div>
              <h3 className="text-2xl font-bold text-white mb-4">Marine Consultancy</h3>
              <p className="text-gray-300 mb-6">
                Expert Marine Consultancy services for vessel operations, safety management, 
                regulatory compliance, and maritime business consulting.
              </p>
              <Link
                href="/services"
                className="inline-block bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Learn More
              </Link>
            </div>

            {/* Superintendancy Services */}
            <div className="bg-dark-800 border border-dark-700 rounded-lg p-8 text-center hover:border-green-500 transition-colors">
              <div className="text-4xl mb-4">🌊</div>
              <h3 className="text-2xl font-bold text-white mb-4">Superintendancy Services</h3>
              <p className="text-gray-300 mb-6">
                Comprehensive Superintendancy services for vessel supervision, maritime operations, 
                fleet management, and technical support worldwide.
              </p>
              <Link
                href="/services"
                className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
              Why Choose Our <span className="text-blue-400">Marine Superintendent</span>, 
              <span className="text-cyan-400"> Marine Consultancy</span>, and 
              <span className="text-green-400"> Superintendancy</span> Platform?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">🏆</div>
              <h3 className="text-xl font-bold text-white mb-2">#1 Platform</h3>
              <p className="text-gray-300">Leading Marine Superintendent and Marine Consultancy platform worldwide</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-white mb-2">Certified Experts</h3>
              <p className="text-gray-300">Verified Marine Superintendent and Marine Consultancy professionals</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🌍</div>
              <h3 className="text-xl font-bold text-white mb-2">Global Coverage</h3>
              <p className="text-gray-300">Superintendancy services available in major ports worldwide</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-white mb-2">24/7 Support</h3>
              <p className="text-gray-300">Round-the-clock Marine Superintendent and Marine Consultancy support</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Access Professional <span className="text-blue-200">Marine Superintendent</span>, 
            <span className="text-cyan-200"> Marine Consultancy</span>, and 
            <span className="text-green-200"> Superintendancy</span> Services?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of vessel managers and marine superintendents using our platform for 
            professional Marine Superintendent, Marine Consultancy, and Superintendancy services.
          </p>
          <div className="flex flex-col gap-4 justify-center items-center">
            <Link
              href="/auth/register"
              className="bg-white hover:bg-gray-100 text-primary-600 px-12 py-6 rounded-lg text-xl font-semibold transition-all duration-200 w-full sm:w-auto"
            >
              Get Started Today
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
