import { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  BriefcaseIcon,
  MapPinIcon,
  ClockIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

export const metadata: Metadata = {
  title: 'How to Find Marine Superintendent Jobs: Complete Guide 2025 | ShipinPort.com',
  description: 'Learn how to find marine superintendent jobs worldwide. Expert guide to marine superintendent job search, applications, and career advancement. Tips for vessel superintendent positions, maritime jobs, and shipping careers.',
  keywords: [
    'how to find marine superintendent jobs',
    'marine superintendent job search',
    'marine superintendent careers',
    'vessel superintendent jobs',
    'maritime job search',
    'marine superintendent applications',
    'shipping career guide',
    'marine superintendent tips',
    'maritime employment',
    'vessel management careers'
  ],
  openGraph: {
    title: 'How to Find Marine Superintendent Jobs: Complete Guide 2025 | ShipinPort.com',
    description: 'Expert guide to finding marine superintendent jobs worldwide. Learn job search strategies, application tips, and career advancement in maritime industry.',
    type: 'article',
  },
}

export default function HowToFindMarineSuperintendentJobsPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "How to Find Marine Superintendent Jobs: Complete Guide 2025",
    "description": "Expert guide to finding marine superintendent jobs worldwide. Learn job search strategies, application tips, and career advancement in maritime industry.",
    "author": {
      "@type": "Organization",
      "name": "ShipinPort.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "ShipinPort.com",
      "url": "https://shipinport.com"
    },
    "datePublished": "2025-01-02",
    "dateModified": "2025-01-02",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://shipinport.com/blog/how-to-find-marine-superintendent-jobs"
    }
  }

  const jobSearchTips = [
    {
      title: 'Build a Strong Professional Profile',
      description: 'Create a comprehensive profile highlighting your marine engineering experience, certifications, and vessel types you\'ve worked with.',
      icon: '📋'
    },
    {
      title: 'Network in Maritime Industry',
      description: 'Join marine superintendent associations, attend maritime conferences, and connect with vessel managers and shipping companies.',
      icon: '🤝'
    },
    {
      title: 'Get Certified and Stay Updated',
      description: 'Obtain relevant certifications like ISM, ISPS, MLC audits and keep up with latest maritime regulations and standards.',
      icon: '🎓'
    },
    {
      title: 'Use Specialized Job Platforms',
      description: 'Register on maritime-specific job platforms like ShipinPort.com where vessel managers post marine superintendent positions.',
      icon: '💻'
    },
    {
      title: 'Apply to Multiple Locations',
      description: 'Consider marine superintendent jobs in major maritime hubs like Singapore, Rotterdam, Hamburg, and Dubai.',
      icon: '🌍'
    },
    {
      title: 'Prepare for Technical Interviews',
      description: 'Be ready to discuss vessel systems, safety procedures, regulatory compliance, and your experience with different vessel types.',
      icon: '🎯'
    }
  ]

  const topJobLocations = [
    { location: 'Singapore', jobs: '85+ Positions', rate: '$400-800/day', flag: '🇸🇬' },
    { location: 'Rotterdam', jobs: '72+ Positions', rate: '$350-750/day', flag: '🇳🇱' },
    { location: 'Hamburg', jobs: '68+ Positions', rate: '$380-720/day', flag: '🇩🇪' },
    { location: 'Dubai', jobs: '55+ Positions', rate: '$320-680/day', flag: '🇦🇪' },
    { location: 'London', jobs: '48+ Positions', rate: '$400-750/day', flag: '🇬🇧' },
    { location: 'Houston', jobs: '42+ Positions', rate: '$350-700/day', flag: '🇺🇸' }
  ]

  const jobTypes = [
    {
      title: 'ISM/ISPS/MLC Audits',
      description: 'Conduct comprehensive ship audits and compliance assessments',
      requirements: ['Marine Engineering Degree', 'Audit Certification', '3+ Years Experience'],
      rate: '$400-650/day'
    },
    {
      title: 'Port State Inspections',
      description: 'Prepare vessels for port state control inspections',
      requirements: ['Port State Experience', 'SOLAS/MARPOL Knowledge', 'Inspection Certification'],
      rate: '$350-600/day'
    },
    {
      title: 'Pre-Vetting Inspections',
      description: 'Charter party compliance and vessel condition assessments',
      requirements: ['Charter Party Knowledge', 'Vetting Experience', 'Oil Major Standards'],
      rate: '$450-700/day'
    },
    {
      title: 'Vessel Management',
      description: 'Full vessel supervision and operational management',
      requirements: ['Chief Engineer License', 'Management Experience', 'IMO Regulations'],
      rate: '$500-800/day'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-marine-950 to-dark-900">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        {/* Article Header */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              How to Find <span className="text-blue-400">Marine Superintendent Jobs</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Complete guide to finding marine superintendent positions worldwide in 2025
            </p>
            <div className="flex items-center justify-center text-gray-400">
              <ClockIcon className="h-5 w-5 mr-2" />
              <span>Published: January 2, 2025</span>
              <span className="mx-4">•</span>
              <span>10 min read</span>
            </div>
          </div>

          {/* Introduction */}
          <div className="bg-dark-800/50 p-8 rounded-lg mb-12">
            <p className="text-lg text-gray-300 leading-relaxed">
              Finding marine superintendent jobs can be challenging in today's competitive maritime industry. 
              With over <strong className="text-white">1000+ marine superintendent positions</strong> available worldwide, 
              knowing where to look and how to apply can make all the difference in your career. This comprehensive 
              guide will help you navigate the marine superintendent job market and land your ideal position.
            </p>
          </div>
        </div>

        {/* Job Search Tips */}
        <section className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-white mb-12">
            Top 6 Tips for Finding Marine Superintendent Jobs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobSearchTips.map((tip, index) => (
              <Card key={index} className="hover:bg-dark-700/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-4">{tip.icon}</span>
                    <CardTitle className="text-xl text-white">{tip.title}</CardTitle>
                  </div>
                  <CardDescription className="text-gray-300">
                    {tip.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Job Types and Rates */}
        <section className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-white mb-12">
            Marine Superintendent Job Types & Rates
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobTypes.map((job, index) => (
              <Card key={index} className="hover:bg-dark-700/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <CardTitle className="text-xl text-white">{job.title}</CardTitle>
                    <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {job.rate}
                    </span>
                  </div>
                  <CardDescription className="text-gray-300">
                    {job.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-white text-sm">Requirements:</h4>
                    {job.requirements.map((req, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-300">
                        <CheckCircleIcon className="h-4 w-4 text-green-400 mr-2" />
                        {req}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Top Job Locations */}
        <section className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-white mb-12">
            Top Locations for Marine Superintendent Jobs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topJobLocations.map((location, index) => (
              <Card key={index} className="hover:bg-dark-700/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{location.flag}</span>
                      <CardTitle className="text-lg text-white">{location.location}</CardTitle>
                    </div>
                  </div>
                  <CardDescription className="text-gray-300">
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <BriefcaseIcon className="h-4 w-4 mr-2" />
                        {location.jobs}
                      </div>
                      <div className="flex items-center">
                        <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                        {location.rate}
                      </div>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={`/marine-superintendent-jobs/${location.location.toLowerCase()}`}>
                    <Button className="w-full">
                      View Jobs
                      <ArrowRightIcon className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Application Process */}
        <section className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-white mb-12">
            Marine Superintendent Job Application Process
          </h2>
          <div className="space-y-8">
            <div className="bg-dark-800/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-4">1. Prepare Your Application</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3" />
                  Update your marine engineering resume with recent experience
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3" />
                  Include all relevant certifications and licenses
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3" />
                  Prepare a compelling cover letter highlighting your expertise
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3" />
                  Gather references from previous vessel managers or shipping companies
                </li>
              </ul>
            </div>

            <div className="bg-dark-800/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-4">2. Submit Applications</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3" />
                  Apply through specialized maritime job platforms like ShipinPort.com
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3" />
                  Contact shipping companies directly through their career pages
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3" />
                  Use your professional network to get referrals
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3" />
                  Follow up on applications within 1-2 weeks
                </li>
              </ul>
            </div>

            <div className="bg-dark-800/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-4">3. Interview Preparation</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3" />
                  Prepare examples of successful vessel inspections and audits
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3" />
                  Study latest maritime regulations and industry developments
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3" />
                  Practice explaining complex technical procedures clearly
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3" />
                  Prepare questions about the company and specific assignments
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto text-center bg-gradient-to-r from-primary-600/20 to-blue-600/20 p-12 rounded-2xl">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Find Your Next Marine Superintendent Job?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of marine superintendents who have found their ideal positions through ShipinPort.com
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/marine-superintendent-jobs">
              <Button size="lg" className="bg-primary-600 hover:bg-primary-700">
                Browse Marine Superintendent Jobs
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="outline" size="lg">
                Create Your Profile
              </Button>
            </Link>
          </div>
        </section>

        {/* Related Articles */}
        <section className="max-w-4xl mx-auto mt-16">
          <h2 className="text-3xl font-bold text-white mb-8">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:bg-dark-700/50 transition-colors">
              <CardHeader>
                <CardTitle className="text-white">Marine Superintendent Salary Guide 2025</CardTitle>
                <CardDescription className="text-gray-300">
                  Complete breakdown of marine superintendent salaries by location and experience level.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/blog/marine-superintendent-salary-guide">
                  <Button variant="outline">Read More</Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="hover:bg-dark-700/50 transition-colors">
              <CardHeader>
                <CardTitle className="text-white">Marine Superintendent Certifications</CardTitle>
                <CardDescription className="text-gray-300">
                  Essential certifications every marine superintendent needs for career advancement.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/blog/marine-superintendent-certifications">
                  <Button variant="outline">Read More</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  )
}
