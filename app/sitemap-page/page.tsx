import { Metadata } from 'next'
import Link from 'next/link'
import { HeaderWrapper } from '@/components/layout/HeaderWrapper'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Sitemap - ShipinPort.com | All Pages & Navigation',
  description: 'Complete sitemap of ShipinPort.com showing all pages, services, and navigation links for easy access to marine superintendent services and vessel management solutions.',
  robots: {
    index: true,
    follow: true,
  },
}

export default function SitemapPage() {
  const pages = [
    {
      category: 'Main Pages',
      links: [
        { href: '/', title: 'Home', description: 'Marine Superintendent & Marine Consultancy Services' },
        { href: '/about', title: 'About Us', description: 'Learn about ShipinPort and our mission' },
        { href: '/services', title: 'Services', description: 'Professional marine superintendent services' },
        { href: '/marine-superintendent-marine-consultancy-superintendancy', title: 'Marine Superintendent', description: 'Comprehensive marine superintendent information' },
        { href: '/blog', title: 'Blog', description: 'Maritime industry news and insights' },
        { href: '/contact', title: 'Contact', description: 'Get in touch with our team' },
        { href: '/faq', title: 'FAQ', description: 'Frequently asked questions' },
      ]
    },
    {
      category: 'Authentication',
      links: [
        { href: '/auth/login', title: 'Sign In', description: 'Login to your account' },
        { href: '/auth/register', title: 'Register', description: 'Create a new account' },
        { href: '/auth/verify-email', title: 'Verify Email', description: 'Email verification page' },
      ]
    },
    {
      category: 'Legal & Compliance',
      links: [
        { href: '/terms', title: 'Terms of Service', description: 'Terms and conditions' },
        { href: '/privacy', title: 'Privacy Policy', description: 'Privacy and data protection' },
        { href: '/cookies', title: 'Cookie Policy', description: 'Cookie usage information' },
        { href: '/disclaimer', title: 'Legal Disclaimer', description: 'Legal disclaimers and limitations' },
        { href: '/gdpr', title: 'GDPR Compliance', description: 'GDPR compliance information' },
      ]
    },
    {
      category: 'Dashboard Pages (Requires Authentication)',
      links: [
        { href: '/dashboard/manager', title: 'Manager Dashboard', description: 'Vessel manager dashboard' },
        { href: '/dashboard/superintendent', title: 'Superintendent Dashboard', description: 'Marine superintendent dashboard' },
        { href: '/dashboard/manager/post-job', title: 'Post Job', description: 'Post a new job opportunity' },
        { href: '/dashboard/manager/my-posts', title: 'My Posts', description: 'Manage your job posts' },
        { href: '/dashboard/manager/applications', title: 'Applications', description: 'View job applications' },
        { href: '/dashboard/manager/search', title: 'Search Superintendents', description: 'Find marine superintendents' },
        { href: '/dashboard/superintendent/search', title: 'Search Jobs', description: 'Find job opportunities' },
        { href: '/dashboard/superintendent/applications', title: 'My Applications', description: 'Track your applications' },
        { href: '/dashboard/manager/profile', title: 'Manager Profile', description: 'Edit manager profile' },
        { href: '/dashboard/superintendent/profile', title: 'Superintendent Profile', description: 'Edit superintendent profile' },
        { href: '/dashboard/blog', title: 'Blog Management', description: 'Manage blog content' },
        { href: '/dashboard/blog/create', title: 'Create Blog Post', description: 'Create new blog post' },
        { href: '/dashboard/admin/superintendents', title: 'Admin - Superintendents', description: 'Admin panel for superintendents' },
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-dark-900">
      <HeaderWrapper />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Site Map
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Complete navigation guide to all pages on ShipinPort.com. 
            Find everything you need for marine superintendent services and vessel management.
          </p>
        </div>

        {/* Sitemap Content */}
        <div className="space-y-12">
          {pages.map((section, sectionIndex) => (
            <div key={sectionIndex} className="bg-gray-800/50 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-2">
                {section.category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {section.links.map((page, pageIndex) => (
                  <Link
                    key={pageIndex}
                    href={page.href}
                    className="block p-4 bg-gray-700/50 rounded-lg hover:bg-gray-600/50 transition-colors group"
                  >
                    <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors mb-2">
                      {page.title}
                    </h3>
                    <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                      {page.description}
                    </p>
                    <div className="text-xs text-blue-400 mt-2 group-hover:text-blue-300 transition-colors">
                      {page.href}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Information */}
        <div className="mt-16 bg-blue-900/20 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Need Help Finding Something?
          </h2>
          <p className="text-gray-300 mb-6">
            If you can't find what you're looking for, try our search function or contact our support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Contact Support
            </Link>
            <Link
              href="/faq"
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              View FAQ
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
