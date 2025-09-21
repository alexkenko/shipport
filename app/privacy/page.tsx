import { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Privacy Policy - ShipinPort.com Marine Platform',
  description: 'Privacy Policy for ShipinPort.com marine superintendent platform. Learn how we collect, use, and protect your personal information.',
  keywords: [
    'privacy policy',
    'data protection',
    'marine platform privacy',
    'user data security',
    'GDPR compliance',
    'shipinport privacy'
  ],
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-dark-900">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="glass p-8 rounded-xl">
          <h1 className="text-4xl font-bold text-white mb-8">
            Privacy Policy
          </h1>
          
          <div className="text-gray-300 space-y-6">
            <p className="text-sm text-gray-400">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Information We Collect</h2>
              <div className="space-y-3">
                <p><strong className="text-white">Personal Information:</strong> Name, email address, phone number, company information, and professional credentials.</p>
                <p><strong className="text-white">Profile Information:</strong> Bio, vessel types, certifications, ports covered, and service preferences.</p>
                <p><strong className="text-white">Usage Data:</strong> Information about how you interact with our platform, including pages visited and features used.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>To provide and maintain our marine professional networking services</li>
                <li>To facilitate connections between vessel managers and marine superintendents</li>
                <li>To verify professional credentials and certifications</li>
                <li>To send important updates about your account and platform features</li>
                <li>To improve our services and develop new features</li>
                <li>To ensure compliance with maritime industry standards</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. Information Sharing</h2>
              <p>We do not sell, trade, or rent your personal information to third parties. We may share information only in the following circumstances:</p>
              <ul className="list-disc list-inside space-y-2 mt-3">
                <li>With other platform users when you choose to connect or engage in professional services</li>
                <li>With service providers who assist us in operating our platform (under strict confidentiality agreements)</li>
                <li>When required by law or to protect our rights and safety</li>
                <li>With your explicit consent for specific purposes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Data Security</h2>
              <p>We implement industry-standard security measures to protect your personal information:</p>
              <ul className="list-disc list-inside space-y-2 mt-3">
                <li>Encryption of data in transit and at rest</li>
                <li>Secure authentication and access controls</li>
                <li>Regular security audits and updates</li>
                <li>Limited access to personal information on a need-to-know basis</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Your Rights (GDPR Compliance)</h2>
              <p>Under applicable data protection laws, you have the following rights:</p>
              <ul className="list-disc list-inside space-y-2 mt-3">
                <li><strong className="text-white">Access:</strong> Request a copy of your personal data</li>
                <li><strong className="text-white">Rectification:</strong> Correct inaccurate or incomplete data</li>
                <li><strong className="text-white">Erasure:</strong> Request deletion of your personal data</li>
                <li><strong className="text-white">Portability:</strong> Receive your data in a structured format</li>
                <li><strong className="text-white">Objection:</strong> Object to processing of your data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Cookies and Tracking</h2>
              <p>We use cookies and similar technologies to:</p>
              <ul className="list-disc list-inside space-y-2 mt-3">
                <li>Remember your login status and preferences</li>
                <li>Analyze platform usage and performance</li>
                <li>Provide personalized content and features</li>
                <li>Ensure platform security and functionality</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Data Retention</h2>
              <p>We retain your personal information only as long as necessary to:</p>
              <ul className="list-disc list-inside space-y-2 mt-3">
                <li>Provide our services and maintain your account</li>
                <li>Comply with legal obligations</li>
                <li>Resolve disputes and enforce our agreements</li>
                <li>Improve our services (in anonymized form)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. International Transfers</h2>
              <p>Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data during such transfers.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Changes to This Policy</h2>
              <p>We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us at:</p>
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
