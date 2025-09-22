import { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Terms of Service - ShipinPort.com Marine Platform',
  description: 'Terms of Service for ShipinPort.com marine superintendent platform. Read our terms and conditions for using our vessel management and maritime professional services.',
  keywords: [
    'terms of service',
    'terms and conditions',
    'marine platform terms',
    'vessel management terms',
    'maritime platform legal',
    'shipinport terms'
  ],
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-dark-900">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="glass p-8 rounded-xl">
          <h1 className="text-4xl font-bold text-white mb-8">
            Terms of Service
          </h1>
          
          <div className="text-gray-300 space-y-6">
            <p className="text-sm text-gray-400">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using <span className="text-blue-700">Ship</span><span className="text-red-500">in</span><span className="text-blue-700">Port.com</span> ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Description of Service</h2>
              <p>
                <span className="text-blue-700">Ship</span><span className="text-red-500">in</span><span className="text-blue-700">Port.com</span> is a professional networking platform that connects vessel managers with certified marine superintendents for maritime services including inspections, audits, consultancy, and vessel management solutions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. User Responsibilities</h2>
              <div className="space-y-3">
                <p><strong className="text-white">Account Security:</strong> You are responsible for maintaining the confidentiality of your account credentials.</p>
                <p><strong className="text-white">Accurate Information:</strong> You must provide accurate and up-to-date information in your profile.</p>
                <p><strong className="text-white">Professional Conduct:</strong> You agree to conduct yourself professionally and ethically in all interactions.</p>
                <p><strong className="text-white">Compliance:</strong> You must comply with all applicable maritime regulations and industry standards.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Service Limitations</h2>
              <p>
                <span className="text-blue-700">Ship</span><span className="text-red-500">in</span><span className="text-blue-700">Port.com</span> serves as a connection platform between vessel managers and marine superintendents. We do not guarantee the quality, reliability, or performance of services provided by platform users. All agreements and transactions are between the parties directly involved.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Prohibited Uses</h2>
              <p>You may not use our platform:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                <li>To submit false or misleading information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Intellectual Property</h2>
              <p>
                The platform and its original content, features, and functionality are and will remain the exclusive property of <span className="text-blue-700">Ship</span><span className="text-red-500">in</span><span className="text-blue-700">Port.com</span> and its licensors. The platform is protected by copyright, trademark, and other laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Limitation of Liability</h2>
              <p>
                In no event shall <span className="text-blue-700">Ship</span><span className="text-red-500">in</span><span className="text-blue-700">Port.com</span>, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Termination</h2>
              <p>
                We may terminate or suspend your account and bar access to the platform immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Governing Law</h2>
              <p>
                These Terms shall be interpreted and governed by the laws of the jurisdiction in which <span className="text-blue-700">Ship</span><span className="text-red-500">in</span><span className="text-blue-700">Port.com</span> operates, without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Changes to Terms</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">11. Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="mt-2 p-4 bg-dark-800 rounded-lg">
                <p><strong className="text-white">Email:</strong> support@shipinport.com</p>
                <p><strong className="text-white">Website:</strong> <a href="/contact" className="text-primary-400 hover:text-primary-300">Contact Page</a></p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
