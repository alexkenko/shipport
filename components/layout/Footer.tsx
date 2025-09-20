import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-dark-900 border-t border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold text-white mb-4">ShipPort</h3>
            <p className="text-gray-400 mb-4">
              Professional Marine Superintendent Services & Vessel Management Solutions
            </p>
            <p className="text-sm text-gray-500">
              Connecting vessel managers with certified marine superintendents worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/auth/login" className="text-gray-400 hover:text-white transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="text-gray-400 hover:text-white transition-colors">
                  Register
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Services</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/services/inspections" className="text-gray-400 hover:text-white transition-colors">
                  Marine Inspections
                </Link>
              </li>
              <li>
                <Link href="/services/audits" className="text-gray-400 hover:text-white transition-colors">
                  ISM ISPS MLC Audits
                </Link>
              </li>
              <li>
                <Link href="/services/consultancy" className="text-gray-400 hover:text-white transition-colors">
                  Marine Consultancy
                </Link>
              </li>
              <li>
                <Link href="/services/tmsa" className="text-gray-400 hover:text-white transition-colors">
                  TMSA Preparation
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-gray-400 hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="border-t border-dark-700 pt-8 mb-8">
          <div className="bg-dark-800/50 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-white mb-4">Important Legal Disclaimer</h4>
            <div className="text-sm text-gray-400 space-y-3">
              <p>
                <strong className="text-white">Disclaimer:</strong> ShipPort is a professional networking platform connecting vessel managers with marine superintendents. 
                We do not guarantee the quality, reliability, or performance of any services provided by platform users. 
                All agreements and transactions are between the parties directly involved.
              </p>
              <p>
                <strong className="text-white">Professional Standards:</strong> While we verify user credentials, we recommend conducting your own due diligence 
                before engaging any marine superintendent services. All users are responsible for ensuring compliance with applicable maritime regulations and standards.
              </p>
              <p>
                <strong className="text-white">Limitation of Liability:</strong> ShipPort shall not be liable for any damages, losses, or claims arising from 
                the use of our platform or services provided by platform users. Users engage at their own risk.
              </p>
            </div>
          </div>
        </div>

        {/* Legal Links */}
        <div className="border-t border-dark-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-500 mb-4 md:mb-0">
              © 2024 ShipPort. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center md:justify-end gap-6 text-sm">
              <Link href="/terms" className="text-gray-500 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-gray-500 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/cookies" className="text-gray-500 hover:text-white transition-colors">
                Cookie Policy
              </Link>
              <Link href="/disclaimer" className="text-gray-500 hover:text-white transition-colors">
                Legal Disclaimer
              </Link>
              <Link href="/gdpr" className="text-gray-500 hover:text-white transition-colors">
                GDPR Compliance
              </Link>
            </div>
          </div>
        </div>

        {/* Additional Legal Information */}
        <div className="mt-8 pt-8 border-t border-dark-700">
          <div className="text-xs text-gray-600 text-center space-y-2">
            <p>
              <strong>Maritime Compliance:</strong> All services must comply with IMO, SOLAS, MARPOL, and other applicable international maritime regulations.
            </p>
            <p>
              <strong>Data Protection:</strong> We are committed to protecting your personal data in accordance with GDPR and other applicable data protection laws.
            </p>
            <p>
              <strong>Professional Indemnity:</strong> Marine superintendents are advised to maintain appropriate professional indemnity insurance coverage.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
