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
  title: 'Marine Superintendent Jobs Singapore - 85+ Marine Superintendent Positions | ShipinPort.com',
  description: 'Find marine superintendent jobs in Singapore. Browse 85+ marine superintendent positions in Singapore with top shipping companies. Apply for marine superintendent jobs in Singapore maritime hub. $400-800/day rates.',
  keywords: [
    'marine superintendent jobs singapore',
    'marine superintendent singapore',
    'maritime jobs singapore',
    'vessel superintendent singapore',
    'marine superintendent positions singapore',
    'shipping jobs singapore',
    'maritime careers singapore',
    'marine superintendent singapore port',
    'singapore marine jobs',
    'vessel management singapore'
  ],
  openGraph: {
    title: 'Marine Superintendent Jobs Singapore - Find Your Next Marine Career | ShipinPort.com',
    description: 'Explore marine superintendent jobs in Singapore. Connect with vessel managers in Singapore seeking qualified marine superintendents.',
    type: 'website',
  },
}

export default function MarineSuperintendentJobsSingaporePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "JobBoard",
    "name": "Marine Superintendent Jobs Singapore",
    "description": "Find marine superintendent positions in Singapore. Browse marine superintendent jobs with leading Singapore shipping companies and vessel managers.",
    "url": "https://shipinport.com/marine-superintendent-jobs/singapore",
    "jobLocation": {
      "@type": "Place",
      "name": "Singapore",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "SG"
      }
    }
  }

  const singaporeJobs = [
    {
      title: 'Marine Superintendent - Port State Inspections Singapore',
      company: 'PSA International',
      location: 'Singapore Port',
      rate: '$450-650/day',
      type: 'Contract',
      description: 'Conduct port state control inspections and vessel assessments at Singapore Port facilities.',
      requirements: ['Singapore MPA Certification', 'Port State Experience', '3+ Years Experience']
    },
    {
      title: 'Vessel Superintendent - ISM Audits Singapore',
      company: 'Keppel Corporation',
      location: 'Keppel Bay',
      rate: '$400-600/day',
      type: 'Contract',
      description: 'Perform ISM, ISPS, and MLC audits for vessels calling at Singapore ports.',
      requirements: ['ISM Certification', 'Audit Experience', 'Marine Engineering Background']
    },
    {
      title: 'Marine Superintendent - Tanker Operations Singapore',
      company: 'Sembcorp Marine',
      location: 'Tuas Port',
      rate: '$500-750/day',
      type: 'Contract',
      description: 'Oversee tanker operations and ensure compliance with Singapore maritime regulations.',
      requirements: ['Tanker Experience', 'Singapore License', 'Safety Management']
    },
    {
      title: 'Vessel Superintendent - Container Operations Singapore',
      company: 'COSCO Shipping',
      location: 'Singapore Port',
      rate: '$420-620/day',
      type: 'Contract',
      description: 'Manage container vessel operations and port state compliance in Singapore.',
      requirements: ['Container Experience', 'Port Operations', 'Maritime Law Knowledge']
    }
  ]

  const singaporeCompanies = [
    { name: 'PSA International', jobs: '25+ Positions', logo: '🚢' },
    { name: 'Keppel Corporation', jobs: '18+ Positions', logo: '⚓' },
    { name: 'Sembcorp Marine', jobs: '15+ Positions', logo: '🏗️' },
    { name: 'COSCO Shipping', jobs: '12+ Positions', logo: '📦' },
    { name: 'Wallenius Wilhelmsen', jobs: '8+ Positions', logo: '🚛' },
    { name: 'CMA CGM', jobs: '7+ Positions', logo: '🌊' }
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
            <span className="text-blue-400">Marine Superintendent</span> Jobs Singapore 🇸🇬
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
            Find marine superintendent jobs in Singapore. Browse <strong className="text-white">85+ marine superintendent positions</strong> 
            in Singapore with leading shipping companies and vessel managers.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/auth/register">
              <Button size="lg" className="bg-primary-600 hover:bg-primary-700">
                <BriefcaseIcon className="h-5 w-5 mr-2" />
                Find Singapore Marine Jobs
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="outline" size="lg">
                <UserGroupIcon className="h-5 w-5 mr-2" />
                Post Jobs in Singapore
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-dark-800/50 p-6 rounded-lg">
              <div className="text-3xl font-bold text-primary-400">85+</div>
              <div className="text-gray-300">Singapore Jobs</div>
            </div>
            <div className="bg-dark-800/50 p-6 rounded-lg">
              <div className="text-3xl font-bold text-green-400">25+</div>
              <div className="text-gray-300">Companies</div>
            </div>
            <div className="bg-dark-800/50 p-6 rounded-lg">
              <div className="text-3xl font-bold text-blue-400">$400-800</div>
              <div className="text-gray-300">Daily Rates</div>
            </div>
            <div className="bg-dark-800/50 p-6 rounded-lg">
              <div className="text-3xl font-bold text-purple-400">24/7</div>
              <div className="text-gray-300">Port Operations</div>
            </div>
          </div>
        </div>

        {/* Featured Singapore Jobs */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Featured Marine Superintendent Jobs in Singapore
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {singaporeJobs.map((job, index) => (
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
                  <Link href="/dashboard/superintendent/search?location=Singapore" className="block">
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

        {/* Singapore Companies */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Hiring Companies in Singapore
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {singaporeCompanies.map((company, index) => (
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

        {/* Singapore Maritime Facts */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Why Singapore for Marine Superintendent Jobs?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-dark-800/50 p-6 rounded-lg text-center">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold text-white mb-3">World's Busiest Port</h3>
              <p className="text-gray-300">Singapore Port handles 37+ million TEUs annually</p>
            </div>
            <div className="bg-dark-800/50 p-6 rounded-lg text-center">
              <div className="text-4xl mb-4">🌏</div>
              <h3 className="text-xl font-semibold text-white mb-3">Global Maritime Hub</h3>
              <p className="text-gray-300">Strategic location connecting Asia-Pacific markets</p>
            </div>
            <div className="bg-dark-800/50 p-6 rounded-lg text-center">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-semibold text-white mb-3">Growing Industry</h3>
              <p className="text-gray-300">Maritime sector growing 5% annually</p>
            </div>
            <div className="bg-dark-800/50 p-6 rounded-lg text-center">
              <div className="text-4xl mb-4">💼</div>
              <h3 className="text-xl font-semibold text-white mb-3">High Demand</h3>
              <p className="text-gray-300">85+ marine superintendent positions available</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-gradient-to-r from-primary-600/20 to-blue-600/20 p-12 rounded-2xl">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Work as a Marine Superintendent in Singapore?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join hundreds of marine superintendents working in Singapore's thriving maritime industry
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="bg-primary-600 hover:bg-primary-700">
                Apply for Singapore Marine Jobs
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
