import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-dark-900 border-t border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold text-white mb-4">
              <span className="text-blue-700">Ship</span>
              <span className="text-red-500">in</span>
              <span className="text-cyan-400">Port</span>
              <span className="text-gray-400 text-sm">.com</span>
            </h3>
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
              <li className="text-gray-400">
                Marine Inspections
              </li>
              <li className="text-gray-400">
                ISM ISPS MLC Audits
              </li>
              <li className="text-gray-400">
                Marine Consultancy
              </li>
              <li className="text-gray-400">
                TMSA Preparation
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


        {/* Legal Links */}
        <div className="border-t border-dark-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-500 mb-4 md:mb-0">
              © 2024 ShipinPort. All rights reserved.
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
            <p className="mt-4">
              <strong>Platform Disclaimer:</strong> ShipinPort serves as a connection platform. We do not guarantee service quality. All agreements are between users directly.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
