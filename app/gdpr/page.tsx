import { Metadata } from 'next'
import { HeaderWrapper } from '@/components/layout/HeaderWrapper'

export const metadata: Metadata = {
  title: 'GDPR Compliance - ShipinPort.com Marine Platform',
  description: 'GDPR compliance information for ShipinPort.com marine superintendent platform. Your data protection rights and how we handle your personal information.',
  keywords: [
    'GDPR compliance',
    'data protection',
    'privacy rights',
    'marine platform GDPR',
    'data subject rights',
    'shipinport GDPR'
  ],
}

export default function GDPRPage() {
  return (
    <div className="min-h-screen bg-dark-900">
      <HeaderWrapper />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="glass p-8 rounded-xl">
          <h1 className="text-4xl font-bold text-white mb-8">
            GDPR Compliance
          </h1>
          
          <div className="text-gray-300 space-y-6">
            <p className="text-sm text-gray-400">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Our Commitment to GDPR</h2>
              <p>
                ShipinPort.com is committed to complying with the General Data Protection Regulation (GDPR) and protecting 
                your personal data. This page explains your rights under GDPR and how we handle your personal information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Your Data Protection Rights</h2>
              <p>Under GDPR, you have the following rights regarding your personal data:</p>
              
              <div className="space-y-4 mt-4">
                <div className="bg-dark-800 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">Right of Access (Article 15)</h3>
                  <p>You have the right to request a copy of the personal data we hold about you and information about how we process it.</p>
                </div>

                <div className="bg-dark-800 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">Right to Rectification (Article 16)</h3>
                  <p>You have the right to request correction of inaccurate or incomplete personal data we hold about you.</p>
                </div>

                <div className="bg-dark-800 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">Right to Erasure (Article 17)</h3>
                  <p>You have the right to request deletion of your personal data in certain circumstances, such as when it's no longer necessary for the purpose it was collected.</p>
                </div>

                <div className="bg-dark-800 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">Right to Restrict Processing (Article 18)</h3>
                  <p>You have the right to request that we limit how we use your personal data in certain circumstances.</p>
                </div>

                <div className="bg-dark-800 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">Right to Data Portability (Article 20)</h3>
                  <p>You have the right to receive your personal data in a structured, commonly used format and to transmit it to another controller.</p>
                </div>

                <div className="bg-dark-800 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">Right to Object (Article 21)</h3>
                  <p>You have the right to object to processing of your personal data for direct marketing or legitimate interests.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">How to Exercise Your Rights</h2>
              <p>To exercise any of your GDPR rights, you can:</p>
              <ul className="list-disc list-inside space-y-2 mt-3">
                <li>Contact us directly at support@shipinport.com</li>
                <li>Use our contact form on the website</li>
                <li>Update your information directly in your account settings</li>
              </ul>
              
              <div className="mt-4 p-4 bg-dark-800 rounded-lg">
                <p className="text-sm"><strong className="text-white">Response Time:</strong> We will respond to your request within 30 days of receipt.</p>
                <p className="text-sm mt-2"><strong className="text-white">Verification:</strong> We may need to verify your identity before processing your request.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Legal Basis for Processing</h2>
              <p>We process your personal data based on the following legal grounds:</p>
              
              <div className="space-y-3 mt-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Contract Performance</h3>
                  <p>Processing necessary to provide our marine professional networking services and fulfill our contractual obligations.</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Legitimate Interests</h3>
                  <p>Processing for our legitimate business interests, such as platform security, fraud prevention, and service improvement.</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Consent</h3>
                  <p>Processing based on your explicit consent, such as marketing communications or optional features.</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Legal Obligations</h3>
                  <p>Processing required to comply with legal obligations, such as maritime industry regulations and tax requirements.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Data Security Measures</h2>
              <p>We implement appropriate technical and organizational measures to protect your personal data:</p>
              <ul className="list-disc list-inside space-y-2 mt-3">
                <li>Encryption of data in transit and at rest</li>
                <li>Access controls and authentication systems</li>
                <li>Regular security audits and assessments</li>
                <li>Staff training on data protection</li>
                <li>Incident response procedures</li>
                <li>Data minimization and retention policies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Data Transfers</h2>
              <p>
                When we transfer your personal data outside the European Economic Area (EEA), we ensure appropriate safeguards 
                are in place, such as:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-3">
                <li>Adequacy decisions by the European Commission</li>
                <li>Standard Contractual Clauses (SCCs)</li>
                <li>Binding Corporate Rules</li>
                <li>Certification schemes and codes of conduct</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Data Retention</h2>
              <p>We retain your personal data only as long as necessary for the purposes outlined in our Privacy Policy:</p>
              <ul className="list-disc list-inside space-y-2 mt-3">
                <li>Account data: Until account closure plus applicable retention periods</li>
                <li>Transaction data: As required by maritime industry regulations</li>
                <li>Communication data: For customer service and legal purposes</li>
                <li>Marketing data: Until consent is withdrawn</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Supervisory Authority</h2>
              <p>
                If you are not satisfied with our response to your data protection concerns, you have the right to lodge 
                a complaint with your local supervisory authority. For EU residents, you can find your supervisory authority 
                at the European Data Protection Board website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Contact Information</h2>
              <p>For GDPR-related inquiries, please contact:</p>
              <div className="mt-2 p-4 bg-dark-800 rounded-lg">
                <p><strong className="text-white">Email:</strong> support@shipinport.com</p>
                <p><strong className="text-white">Website:</strong> <a href="/contact" className="text-primary-400 hover:text-primary-300">Contact Page</a></p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
