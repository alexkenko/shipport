import { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Contact ShipinPort.com - Marine Superintendent Platform Support & Inquiries',
  description: 'Contact ShipinPort for support, inquiries, or partnership opportunities. Get help with marine superintendent services, vessel management solutions, and maritime industry networking.',
  keywords: [
    'contact shipport',
    'marine superintendent support',
    'vessel manager support',
    'maritime platform contact',
    'ship inspection support',
    'marine consultancy contact',
    'maritime professional support',
    'vessel management contact',
    'marine industry support',
    'shipping platform contact'
  ],
    openGraph: {
      title: 'Contact ShipinPort.com - Marine Professional Platform Support',
      description: 'Get in touch with ShipinPort for support, inquiries, or partnership opportunities.',
      type: 'website',
    },
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-dark-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Contact <span className="text-primary-400">
              <span className="text-blue-700">Ship</span>
              <span className="text-red-500">in</span>
              <span className="text-cyan-400">Port</span>
              <span className="text-gray-400">.com</span>
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Get in touch with us for support, inquiries, or partnership opportunities. 
            We're here to help you succeed in the maritime industry.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="glass p-8 rounded-xl">
            <h2 className="text-2xl font-bold text-white mb-6">Get in Touch</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">General Inquiries</h3>
                <p className="text-gray-300">
                  For general questions about our marine superintendent platform, vessel management solutions, 
                  or maritime industry networking services.
                </p>
                <p className="text-primary-400 mt-2">support@shipport.com</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Technical Support</h3>
                <p className="text-gray-300">
                  Need help with platform features, account management, or technical issues? 
                  Our support team is here to assist you.
                </p>
                <p className="text-primary-400 mt-2">tech@shipport.com</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Partnership Opportunities</h3>
                <p className="text-gray-300">
                  Interested in partnering with ShipPort? We welcome collaborations with 
                  maritime industry organizations, training institutions, and service providers.
                </p>
                <p className="text-primary-400 mt-2">partnerships@shipport.com</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Media & Press</h3>
                <p className="text-gray-300">
                  Media inquiries, press releases, and industry insights about marine 
                  superintendent services and vessel management solutions.
                </p>
                <p className="text-primary-400 mt-2">media@shipport.com</p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="glass p-8 rounded-xl">
            <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  How do I find a marine superintendent for my vessel?
                </h3>
                <p className="text-gray-300">
                  Register as a vessel manager and use our search filters to find certified marine 
                  superintendents by location, expertise, and availability.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  What certifications do your marine superintendents have?
                </h3>
                <p className="text-gray-300">
                  Our superintendents hold various certifications including ISM, ISPS, MLC, and other 
                  maritime industry qualifications. All credentials are verified.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  How does the pricing work for marine services?
                </h3>
                <p className="text-gray-300">
                  Marine superintendents set their own rates for workdays and idle days, with options 
                  for door-to-door or gangway-to-gangway service delivery.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Is ShipPort available worldwide?
                </h3>
                <p className="text-gray-300">
                  Yes, ShipPort connects marine professionals globally. Our platform includes 
                  comprehensive port databases and worldwide coverage.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  How do I become a verified marine superintendent?
                </h3>
                <p className="text-gray-300">
                  Register as a superintendent, complete your profile with certifications and 
                  experience, and our team will verify your credentials.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Support Categories */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">How We Can Help</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="glass p-6 rounded-xl text-center">
              <div className="text-3xl mb-4">🔧</div>
              <h3 className="text-lg font-semibold text-white mb-2">Platform Support</h3>
              <p className="text-gray-300 text-sm">
                Technical assistance with account setup, profile management, and platform features.
              </p>
            </div>
            
            <div className="glass p-6 rounded-xl text-center">
              <div className="text-3xl mb-4">📚</div>
              <h3 className="text-lg font-semibold text-white mb-2">Guidance & Training</h3>
              <p className="text-gray-300 text-sm">
                Help with best practices, industry standards, and effective use of our platform.
              </p>
            </div>
            
            <div className="glass p-6 rounded-xl text-center">
              <div className="text-3xl mb-4">🤝</div>
              <h3 className="text-lg font-semibold text-white mb-2">Partnership</h3>
              <p className="text-gray-300 text-sm">
                Collaboration opportunities with maritime organizations and service providers.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-16 text-center">
          <div className="glass p-8 rounded-xl">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join the ShipPort community and connect with maritime professionals worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/auth/register"
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200"
              >
                Join ShipPort Today
              </a>
              <a
                href="/about"
                className="border-2 border-primary-400 text-primary-400 hover:bg-primary-400 hover:text-dark-900 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200"
              >
                Learn More
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
