import { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Cookie Policy - ShipinPort.com Marine Platform',
  description: 'Cookie Policy for ShipinPort.com marine superintendent platform. Learn about how we use cookies and similar technologies.',
  keywords: [
    'cookie policy',
    'cookies',
    'tracking technologies',
    'marine platform cookies',
    'user preferences',
    'shipport cookies'
  ],
}

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-dark-900">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="glass p-8 rounded-xl">
          <h1 className="text-4xl font-bold text-white mb-8">
            Cookie Policy
          </h1>
          
          <div className="text-gray-300 space-y-6">
            <p className="text-sm text-gray-400">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">What Are Cookies?</h2>
              <p>
                Cookies are small text files that are stored on your device when you visit our website. They help us 
                provide you with a better experience by remembering your preferences and enabling various features of our platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">How We Use Cookies</h2>
              <p>We use cookies for the following purposes:</p>
              
              <div className="space-y-4 mt-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Essential Cookies</h3>
                  <p>These cookies are necessary for the platform to function properly:</p>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>Authentication and login status</li>
                    <li>Security features and fraud prevention</li>
                    <li>Platform functionality and navigation</li>
                    <li>User preferences and settings</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Performance Cookies</h3>
                  <p>These cookies help us understand how you use our platform:</p>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>Page views and navigation patterns</li>
                    <li>Feature usage and interactions</li>
                    <li>Platform performance and optimization</li>
                    <li>Error tracking and debugging</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Functional Cookies</h3>
                  <p>These cookies enhance your user experience:</p>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>Remember your login preferences</li>
                    <li>Store your dashboard settings</li>
                    <li>Maintain your search filters</li>
                    <li>Customize platform features</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Types of Cookies We Use</h2>
              
              <div className="space-y-4">
                <div className="bg-dark-800 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">Session Cookies</h3>
                  <p className="text-sm">Temporary cookies that expire when you close your browser. Used for login sessions and temporary preferences.</p>
                </div>

                <div className="bg-dark-800 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">Persistent Cookies</h3>
                  <p className="text-sm">Cookies that remain on your device for a set period. Used to remember your preferences across visits.</p>
                </div>

                <div className="bg-dark-800 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">First-Party Cookies</h3>
                  <p className="text-sm">Cookies set directly by ShipinPort.com to provide platform functionality and improve user experience.</p>
                </div>

                <div className="bg-dark-800 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">Third-Party Cookies</h3>
                  <p className="text-sm">Cookies set by trusted third-party services we use, such as analytics providers and security services.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Managing Your Cookie Preferences</h2>
              <p>You can control cookies through your browser settings:</p>
              
              <div className="space-y-3 mt-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Browser Settings</h3>
                  <p>Most browsers allow you to:</p>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>View and delete existing cookies</li>
                    <li>Block cookies from specific websites</li>
                    <li>Block all third-party cookies</li>
                    <li>Set notifications when cookies are placed</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Platform Settings</h3>
                  <p>You can manage some cookie preferences through your account settings on our platform.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Impact of Disabling Cookies</h2>
              <p>If you disable cookies, some features of our platform may not work properly:</p>
              <ul className="list-disc list-inside space-y-2 mt-3">
                <li>You may need to log in repeatedly</li>
                <li>Your preferences and settings may not be saved</li>
                <li>Some platform features may be unavailable</li>
                <li>Your user experience may be degraded</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Third-Party Services</h2>
              <p>We may use third-party services that set their own cookies:</p>
              <ul className="list-disc list-inside space-y-2 mt-3">
                <li>Analytics services to understand platform usage</li>
                <li>Security services to protect against fraud</li>
                <li>Performance monitoring to ensure platform reliability</li>
                <li>Customer support tools to provide assistance</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Updates to This Policy</h2>
              <p>
                We may update this Cookie Policy from time to time to reflect changes in our practices or for other 
                operational, legal, or regulatory reasons. We will notify you of any material changes by posting the 
                updated policy on this page.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
              <p>If you have any questions about our use of cookies, please contact us at:</p>
              <div className="mt-2 p-4 bg-dark-800 rounded-lg">
                <p><strong className="text-white">Email:</strong> privacy@shipport.com</p>
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
