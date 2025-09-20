import { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Marine Industry Blog - Maritime News, Insights & Professional Tips | ShipinPort.com',
  description: 'Stay updated with the latest marine industry news, maritime regulations, professional insights, and expert tips for vessel managers and marine superintendents.',
  keywords: [
    'marine industry blog',
    'maritime news',
    'marine superintendent tips',
    'vessel management insights',
    'maritime regulations',
    'marine safety news',
    'shipping industry updates',
    'marine professional advice',
    'vessel inspection tips',
    'maritime compliance news',
    'marine consultancy insights',
    'shipping industry blog'
  ],
    openGraph: {
      title: 'ShipinPort.com Marine Industry Blog - Maritime Professional Insights',
      description: 'Latest marine industry news, insights, and professional tips for maritime professionals.',
      type: 'website',
    },
}

const blogPosts = [
  {
    title: 'Understanding ISM Code Compliance: A Complete Guide for Vessel Managers',
    excerpt: 'Comprehensive guide to ISM Code compliance, including key requirements, implementation strategies, and common challenges faced by vessel managers.',
    date: '2024-01-15',
    category: 'Compliance',
    readTime: '8 min read',
    slug: 'ism-code-compliance-guide',
    keywords: 'ISM code, maritime compliance, safety management, vessel management'
  },
  {
    title: 'Marine Superintendent Services: What Every Vessel Manager Should Know',
    excerpt: 'Essential guide to marine superintendent services, including types of inspections, audits, and how to choose the right professional for your needs.',
    date: '2024-01-10',
    category: 'Services',
    readTime: '6 min read',
    slug: 'marine-superintendent-services-guide',
    keywords: 'marine superintendent, vessel inspection, marine services, maritime professional'
  },
  {
    title: 'Pre-Vetting Inspections: Preparing Your Vessel for Charter Requirements',
    excerpt: 'Step-by-step guide to preparing your vessel for pre-vetting inspections, including documentation, equipment checks, and common failure points.',
    date: '2024-01-05',
    category: 'Inspections',
    readTime: '7 min read',
    slug: 'pre-vetting-inspection-preparation',
    keywords: 'pre-vetting inspection, charter inspection, vessel preparation, maritime inspection'
  },
  {
    title: 'MLC 2006 Compliance: Ensuring Seafarer Rights and Welfare',
    excerpt: 'Complete overview of Maritime Labour Convention 2006 requirements, including seafarer rights, working conditions, and compliance strategies.',
    date: '2024-01-01',
    category: 'Compliance',
    readTime: '9 min read',
    slug: 'mlc-2006-compliance-guide',
    keywords: 'MLC 2006, maritime labour convention, seafarer rights, maritime compliance'
  },
  {
    title: 'TMSA Preparation: Best Practices for Tanker Management',
    excerpt: 'Expert tips for TMSA preparation, including gap analysis, management system development, and achieving higher TMSA scores.',
    date: '2023-12-28',
    category: 'Tanker Management',
    readTime: '10 min read',
    slug: 'tmsa-preparation-best-practices',
    keywords: 'TMSA, tanker management, self assessment, tanker safety, maritime management'
  },
  {
    title: 'Marine Accident Investigation: Lessons Learned and Prevention',
    excerpt: 'Insights into marine accident investigation processes, common causes, and preventive measures to enhance maritime safety.',
    date: '2023-12-25',
    category: 'Safety',
    readTime: '8 min read',
    slug: 'marine-accident-investigation-insights',
    keywords: 'marine accident, incident investigation, maritime safety, VDR analysis'
  }
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-dark-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Marine Industry <span className="text-primary-400">Insights</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Stay updated with the latest marine industry news, maritime regulations, professional insights, 
            and expert tips for vessel managers and marine superintendents.
          </p>
        </div>

        {/* Featured Articles */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">Latest Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <article key={index} className="glass p-6 rounded-xl hover:bg-dark-700/50 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {post.category}
                  </span>
                  <span className="text-gray-400 text-sm">{post.readTime}</span>
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-3 line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-gray-300 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <time className="text-gray-400 text-sm">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors"
                  >
                    Read More →
                  </Link>
                </div>
                
                <div className="mt-3 pt-3 border-t border-dark-600">
                  <div className="text-xs text-primary-300">
                    Keywords: {post.keywords}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Categories Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">Article Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass p-6 rounded-xl text-center">
              <div className="text-3xl mb-4">📋</div>
              <h3 className="text-lg font-semibold text-white mb-2">Compliance</h3>
              <p className="text-gray-300 text-sm">
                ISM, ISPS, MLC regulations and compliance strategies
              </p>
            </div>
            
            <div className="glass p-6 rounded-xl text-center">
              <div className="text-3xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-white mb-2">Inspections</h3>
              <p className="text-gray-300 text-sm">
                Vessel inspections, audits, and assessment guidance
              </p>
            </div>
            
            <div className="glass p-6 rounded-xl text-center">
              <div className="text-3xl mb-4">🛡️</div>
              <h3 className="text-lg font-semibold text-white mb-2">Safety</h3>
              <p className="text-gray-300 text-sm">
                Maritime safety, accident prevention, and risk management
              </p>
            </div>
            
            <div className="glass p-6 rounded-xl text-center">
              <div className="text-3xl mb-4">⚓</div>
              <h3 className="text-lg font-semibold text-white mb-2">Services</h3>
              <p className="text-gray-300 text-sm">
                Marine superintendent services and professional guidance
              </p>
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="mb-16">
          <div className="glass p-8 rounded-xl text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
            <p className="text-xl text-gray-300 mb-8">
              Subscribe to our newsletter for the latest marine industry insights, regulatory updates, 
              and professional tips delivered to your inbox.
            </p>
            <div className="max-w-md mx-auto flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
              />
              <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className="glass p-8 rounded-xl">
            <h2 className="text-3xl font-bold text-white mb-4">Join Our Professional Community</h2>
            <p className="text-xl text-gray-300 mb-8">
              Connect with maritime professionals worldwide and access expert marine superintendent services.
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
