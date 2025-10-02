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
  UserGroupIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

export const metadata: Metadata = {
  title: 'Marine Superintendent Jobs Rotterdam - 72+ Marine Superintendent Positions | ShipinPort.com',
  description: 'Find marine superintendent jobs in Rotterdam. Browse 72+ marine superintendent positions in Rotterdam with top European shipping companies. Apply for marine superintendent jobs in Rotterdam port. $350-750/day rates.',
  keywords: [
    'marine superintendent jobs rotterdam',
    'marine superintendent rotterdam',
    'maritime jobs rotterdam',
    'vessel superintendent rotterdam',
    'marine superintendent positions rotterdam',
    'shipping jobs rotterdam',
    'maritime careers rotterdam',
    'marine superintendent rotterdam port',
    'rotterdam marine jobs',
    'vessel management rotterdam'
  ],
  openGraph: {
    title: 'Marine Superintendent Jobs Rotterdam - Find Your Next Marine Career | ShipinPort.com',
    description: 'Explore marine superintendent jobs in Rotterdam. Connect with vessel managers in Rotterdam seeking qualified marine superintendents.',
    type: 'website',
  },
}

export default function MarineSuperintendentJobsRotterdamPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "JobBoard",
    "name": "Marine Superintendent Jobs Rotterdam",
    "description": "Find marine superintendent positions in Rotterdam. Browse marine superintendent jobs with leading Rotterdam shipping companies and vessel managers.",
    "url": "https://shipinport.com/marine-superintendent-jobs/rotterdam",
    "jobLocation": {
      "@type": "Place",
      "name": "Rotterdam",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "NL"
      }
    }
  }

  const rotterdamJobs = [
    {
      title: 'Marine Superintendent - Port State Inspections Rotterdam',
      company: 'Port of Rotterdam Authority',
      location: 'Rotterdam Port',
      rate: '$400-650/day',
      type: 'Contract',
      description: 'Conduct port state control inspections and vessel assessments at Rotterdam Port facilities.',
      requirements: ['EU Maritime License', 'Port State Experience', '3+ Years Experience']
    },
    {
      title: 'Vessel Superintendent - Tanker Operations Rotterdam',
      company: 'Shell Shipping',
      location: 'Europoort',
      rate: '$450-700/day',
      type: 'Contract',
      description: 'Oversee tanker operations and ensure compliance with EU maritime regulations.',
      requirements: ['Tanker Experience', 'EU Certification', 'Safety Management']
    },
    {
      title: 'Marine Superintendent - Container Operations Rotterdam',
      company: 'Maersk Line',
      location: 'Rotterdam Port',
      rate: '$380-580/day',
      type: 'Contract',
      description: 'Manage container vessel operations and port state compliance in Rotterdam.',
      requirements: ['Container Experience', 'Port Operations', 'Maritime Law Knowledge']
    },
    {
      title: 'Vessel Superintendent - ISM Audits Rotterdam',
      company: 'NYK Line',
      location: 'Rotterdam Port',
      rate: '$420-620/day',
      type: 'Contract',
      description: 'Perform ISM, ISPS, and MLC audits for vessels calling at Rotterdam ports.',
      requirements: ['ISM Certification', 'Audit Experience', 'Marine Engineering Background']
    }
  ]

  const rotterdamCompanies = [
    { name: 'Port of Rotterdam Authority', jobs: '20+ Positions', logo: '🚢' },
    { name: 'Shell Shipping', jobs: '15+ Positions', logo: '🛢️' },
    { name: 'Maersk Line', jobs: '12+ Positions', logo: '📦' },
    { name: 'NYK Line', jobs: '10+ Positions', logo: '🌊' },
    { name: 'CMA CGM', jobs: '8+ Positions', logo: '🚛' },
    { name: 'MSC', jobs: '7+ Positions', logo: '⚓' }
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
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            <span className="text-blue-400">Marine Superintendent</span> Jobs Rotterdam 🇳🇱
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
            Find marine superintendent jobs in Rotterdam. Browse <strong className="text-white">72+ marine superintendent positions</strong> 
            in Rotterdam with leading European shipping companies and vessel managers.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/auth/register">
              <Button size="lg" className="bg-primary-600 hover:bg-primary-700">
                <BriefcaseIcon className="h-5 w-5 mr-2" />
                Find Rotterdam Marine Jobs
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="outline" size="lg">
                <UserGroupIcon className="h-5 w-5 mr-2" />
                Post Jobs in Rotterdam
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-dark-800/50 p-6 rounded-lg">
              <div className="text-3xl font-bold text-primary-400">72+</div>
              <div className="text-gray-300">Rotterdam Jobs</div>
            </div>
            <div className="bg-dark-800/50 p-6 rounded-lg">
              <div className="text-3xl font-bold text-green-400">20+</div>
              <div className="text-gray-300">Companies</div>
            </div>
            <div className="bg-dark-800/50 p-6 rounded-lg">
              <div className="text-3xl font-bold text-blue-400">$350-750</div>
              <div className="text-gray-300">Daily Rates</div>
            </div>
            <div className="bg-dark-800/50 p-6 rounded-lg">
              <div className="text-3xl font-bold text-purple-400">Europe</div>
              <div className="text-gray-300">Gateway</div>
            </div>
          </div>
        </div>

        {/* Featured Rotterdam Jobs */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Featured Marine Superintendent Jobs in Rotterdam
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rotterdamJobs.map((job, index) => (
              <Card key={index} className="hover:bg-dark-700/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {job.rate}
                    </span>
                    <span className="text-sm text-gray-400">{job.type}</span>
                  </div>
                  <CardTitle className="text-xl text-white">{job.title}</CardTitle>
                  <CardDescription className="text-gray-300">
                    <div className="flex items-center mb-2">
                      <MapPinIcon className="h-4 w-4 mr-2" />
                      {job.location}
                    </div>
                    <div className="flex items-center">
                      <BriefcaseIcon className="h-4 w-4 mr-2" />
                      {job.company}
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">{job.description}</p>
                  <div className="space-y-2 mb-4">
                    <h4 className="font-semibold text-white text-sm">Requirements:</h4>
                    {job.requirements.map((req, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-300">
                        <CheckCircleIcon className="h-4 w-4 text-green-400 mr-2" />
                        {req}
                      </div>
                    ))}
                  </div>
                  <Link href="/dashboard/superintendent/search?location=Rotterdam" className="block">
                    <Button className="w-full">
                      Apply Now
                      <ArrowRightIcon className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Rotterdam Companies */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Hiring Companies in Rotterdam
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rotterdamCompanies.map((company, index) => (
              <Card key={index} className="hover:bg-dark-700/50 transition-colors text-center">
                <CardHeader>
                  <div className="text-4xl mb-4">{company.logo}</div>
                  <CardTitle className="text-xl text-white">{company.name}</CardTitle>
                  <CardDescription className="text-gray-300">
                    {company.jobs}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={`/dashboard/superintendent/search?company=${company.name}`}>
                    <Button variant="outline" className="w-full">
                      View Jobs
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Rotterdam Maritime Facts */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Why Rotterdam for Marine Superintendent Jobs?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-dark-800/50 p-6 rounded-lg text-center">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold text-white mb-3">Europe's Largest Port</h3>
              <p className="text-gray-300">Rotterdam handles 15+ million TEUs annually</p>
            </div>
            <div className="bg-dark-800/50 p-6 rounded-lg text-center">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold text-white mb-3">European Gateway</h3>
              <p className="text-gray-300">Strategic location connecting Europe to global markets</p>
            </div>
            <div className="bg-dark-800/50 p-6 rounded-lg text-center">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-semibold text-white mb-3">Growing Industry</h3>
              <p className="text-gray-300">Maritime sector expanding with new terminals</p>
            </div>
            <div className="bg-dark-800/50 p-6 rounded-lg text-center">
              <div className="text-4xl mb-4">💼</div>
              <h3 className="text-xl font-semibold text-white mb-3">High Demand</h3>
              <p className="text-gray-300">72+ marine superintendent positions available</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-gradient-to-r from-primary-600/20 to-blue-600/20 p-12 rounded-2xl">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Work as a Marine Superintendent in Rotterdam?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join hundreds of marine superintendents working in Rotterdam's thriving maritime industry
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="bg-primary-600 hover:bg-primary-700">
                Apply for Rotterdam Marine Jobs
              </Button>
            </Link>
            <Link href="/marine-superintendent-jobs">
              <Button variant="outline" size="lg">
                View All Marine Jobs
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
