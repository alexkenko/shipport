import { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Legal Disclaimer - ShipinPort.com Marine Platform',
  description: 'Legal disclaimer for ShipinPort.com marine superintendent platform. Important information about platform limitations and user responsibilities.',
  keywords: [
    'legal disclaimer',
    'platform disclaimer',
    'marine services disclaimer',
    'vessel management disclaimer',
    'maritime platform legal',
    'shipinport disclaimer'
  ],
}

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-dark-900">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="glass p-8 rounded-xl">
          <h1 className="text-4xl font-bold text-white mb-8">
            Legal Disclaimer
          </h1>
          
          <div className="text-gray-300 space-y-6">
            <p className="text-sm text-gray-400">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Platform Disclaimer</h2>
              <p>
                ShipinPort.com is a professional networking platform connecting vessel managers with marine superintendents. 
                We do not guarantee the quality, reliability, or performance of any services provided by platform users. 
                All agreements and transactions are between the parties directly involved.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Professional Standards</h2>
              <p>
                While we verify user credentials and maintain quality standards, we recommend conducting your own due diligence 
                before engaging any marine superintendent services. All users are responsible for ensuring compliance with 
                applicable maritime regulations and standards including:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-3">
                <li>International Maritime Organization (IMO) regulations</li>
                <li>Safety of Life at Sea (SOLAS) conventions</li>
                <li>Marine Pollution (MARPOL) regulations</li>
                <li>International Safety Management (ISM) Code</li>
                <li>International Ship and Port Facility Security (ISPS) Code</li>
                <li>Maritime Labour Convention (MLC) 2006</li>
                <li>National maritime regulations and flag state requirements</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Limitation of Liability</h2>
              <p>
                ShipinPort shall not be liable for any damages, losses, or claims arising from the use of our platform or 
                services provided by platform users. Users engage at their own risk. This includes but is not limited to:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-3">
                <li>Direct, indirect, incidental, or consequential damages</li>
                <li>Loss of profits, data, or business opportunities</li>
                <li>Damages resulting from professional services provided by platform users</li>
                <li>Technical issues, downtime, or platform unavailability</li>
                <li>Third-party actions or content</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">User Responsibilities</h2>
              <p>Users are responsible for:</p>
              <ul className="list-disc list-inside space-y-2 mt-3">
                <li>Verifying the credentials and qualifications of service providers</li>
                <li>Conducting proper due diligence before engaging services</li>
                <li>Ensuring compliance with all applicable maritime regulations</li>
                <li>Maintaining appropriate insurance coverage</li>
                <li>Establishing clear service agreements and contracts</li>
                <li>Reporting any safety concerns or non-compliance issues</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Professional Indemnity</h2>
              <p>
                Marine superintendents and service providers are advised to maintain appropriate professional indemnity 
                insurance coverage. ShipinPort does not provide insurance or liability coverage for services performed 
                by platform users.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Regulatory Compliance</h2>
              <p>
                All services performed through our platform must comply with applicable international maritime regulations 
                and standards. Users are solely responsible for ensuring compliance with:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-3">
                <li>Flag state requirements and regulations</li>
                <li>Port state control requirements</li>
                <li>Classification society standards</li>
                <li>Industry best practices and guidelines</li>
                <li>Local and national maritime laws</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Platform Availability</h2>
              <p>
                While we strive to maintain continuous platform availability, we do not guarantee uninterrupted access. 
                We reserve the right to modify, suspend, or discontinue any part of our services at any time without notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Third-Party Services</h2>
              <p>
                Our platform may contain links to third-party websites or services. We are not responsible for the content, 
                privacy policies, or practices of these third-party services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Governing Law</h2>
              <p>
                This disclaimer shall be governed by and construed in accordance with applicable maritime and international law. 
                Any disputes arising from the use of our platform shall be resolved through appropriate legal channels.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Contact Information</h2>
              <p>
                If you have any questions about this Legal Disclaimer, please contact us at:
              </p>
              <div className="mt-2 p-4 bg-dark-800 rounded-lg">
                <p><strong className="text-white">Email:</strong> legal@shipinport.com</p>
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
