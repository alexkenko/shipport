import { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'About ShipPort - Leading Marine Superintendent Platform & Vessel Management Solutions',
  description: 'Learn about ShipPort, the premier platform connecting vessel managers with certified marine superintendents. Discover our mission to revolutionize maritime industry networking and professional services.',
  keywords: [
    'about shipport',
    'marine superintendent platform',
    'vessel management solutions',
    'maritime industry networking',
    'marine professional services',
    'ship inspection platform',
    'marine consultancy network',
    'vessel manager community',
    'maritime professional platform',
    'marine superintendent network'
  ],
  openGraph: {
    title: 'About ShipPort - Leading Marine Superintendent Platform',
    description: 'Discover how ShipPort connects vessel managers with certified marine superintendents worldwide.',
    type: 'website',
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-dark-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            About <span className="text-primary-400">ShipPort</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            The premier platform connecting vessel managers with certified marine superintendents worldwide, 
            revolutionizing maritime industry networking and professional services.
          </p>
        </div>

        {/* Mission Section */}
        <section className="mb-16">
          <div className="glass p-8 rounded-xl">
            <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
            <p className="text-lg text-gray-300 mb-6">
              ShipPort was founded with a clear mission: to bridge the gap between vessel managers and 
              certified marine superintendents, creating a streamlined platform for maritime professional 
              services and industry networking.
            </p>
            <p className="text-lg text-gray-300">
              We believe that the maritime industry thrives when professionals can easily connect, 
              collaborate, and access the expertise they need to ensure vessel safety, compliance, 
              and operational excellence.
            </p>
          </div>
        </section>

        {/* What We Do Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">What We Do</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="glass p-6 rounded-xl">
              <div className="text-4xl mb-4">🔗</div>
              <h3 className="text-xl font-semibold text-white mb-3">Professional Networking</h3>
              <p className="text-gray-300">
                Connect vessel managers with certified marine superintendents through our secure, 
                professional platform designed for the maritime industry.
              </p>
            </div>
            
            <div className="glass p-6 rounded-xl">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-xl font-semibold text-white mb-3">Verified Professionals</h3>
              <p className="text-gray-300">
                All marine superintendents on our platform are verified professionals with 
                proper certifications including ISM, ISPS, MLC, and other maritime standards.
              </p>
            </div>
            
            <div className="glass p-6 rounded-xl">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold text-white mb-3">Global Coverage</h3>
              <p className="text-gray-300">
                Access marine superintendents and vessel managers from ports worldwide, 
                ensuring you can find the right professional for any location.
              </p>
            </div>
            
            <div className="glass p-6 rounded-xl">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-white mb-3">Specialized Services</h3>
              <p className="text-gray-300">
                Find experts for pre-vetting inspections, marine consultancy, TMSA preparation, 
                navigation audits, and comprehensive vessel assessments.
              </p>
            </div>
            
            <div className="glass p-6 rounded-xl">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-white mb-3">Compliance Focus</h3>
              <p className="text-gray-300">
                Ensure your vessels meet international maritime regulations with access to 
                certified auditors and compliance specialists.
              </p>
            </div>
            
            <div className="glass p-6 rounded-xl">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-white mb-3">Efficient Matching</h3>
              <p className="text-gray-300">
                Our intelligent platform matches vessel managers with superintendents based on 
                location, expertise, availability, and specific service requirements.
              </p>
            </div>
          </div>
        </section>

        {/* Industry Impact Section */}
        <section className="mb-16">
          <div className="glass p-8 rounded-xl">
            <h2 className="text-3xl font-bold text-white mb-6">Industry Impact</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">For Vessel Managers</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Access to certified marine superintendents worldwide</li>
                  <li>• Streamlined job posting and candidate selection</li>
                  <li>• Verified professional credentials and certifications</li>
                  <li>• Transparent pricing and service delivery options</li>
                  <li>• Direct communication with qualified candidates</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">For Marine Superintendents</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Global job opportunities and assignments</li>
                  <li>• Professional profile showcasing expertise</li>
                  <li>• Competitive pricing and service type options</li>
                  <li>• Direct connection with vessel managers</li>
                  <li>• Portfolio management and assignment tracking</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Safety First</h3>
              <p className="text-gray-300 text-sm">
                Maritime safety is our top priority in all professional connections and services.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Excellence</h3>
              <p className="text-gray-300 text-sm">
                We maintain the highest standards in professional maritime services and networking.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Trust</h3>
              <p className="text-gray-300 text-sm">
                Building trust through verified professionals and transparent processes.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌊</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Innovation</h3>
              <p className="text-gray-300 text-sm">
                Continuously improving our platform to serve the evolving maritime industry.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className="glass p-8 rounded-xl">
            <h2 className="text-3xl font-bold text-white mb-4">Join the ShipPort Community</h2>
            <p className="text-xl text-gray-300 mb-8">
              Whether you're a vessel manager seeking qualified superintendents or a marine professional 
              looking for opportunities, ShipPort is your gateway to maritime excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/register?type=manager"
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200"
              >
                Join as Vessel Manager
              </Link>
              <Link
                href="/auth/register?type=superintendent"
                className="bg-marine-600 hover:bg-marine-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200"
              >
                Join as Superintendent
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
