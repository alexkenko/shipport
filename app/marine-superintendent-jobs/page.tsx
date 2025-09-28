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
  title: 'Marine Superintendent Jobs - Find Marine Superintendent Positions Worldwide | ShipinPort.com',
  description: 'Discover marine superintendent jobs worldwide. Browse 1000+ marine superintendent positions, vessel management roles, and maritime superintendent careers. Apply for marine superintendent jobs with leading shipping companies.',
  keywords: [
    'marine superintendent jobs',
    'marine superintendent positions',
    'marine superintendent careers',
    'vessel superintendent jobs',
    'maritime superintendent employment',
    'ship superintendent jobs',
    'marine superintendent vacancies',
    'marine superintendent recruitment',
    'vessel management jobs',
    'maritime jobs',
    'shipping jobs',
    'marine careers',
    'superintendent positions',
    'marine engineer jobs',
    'vessel operations jobs'
  ],
  openGraph: {
    title: 'Marine Superintendent Jobs - Find Your Next Marine Career | ShipinPort.com',
    description: 'Explore marine superintendent jobs worldwide. Connect with vessel managers seeking qualified marine superintendents for inspections, audits, and vessel management.',
    type: 'website',
  },
}

export default function MarineSuperintendentJobsPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": "Marine Superintendent Jobs",
    "description": "Find marine superintendent positions worldwide. Browse opportunities for vessel inspections, ISM audits, port state inspections, and maritime consulting.",
    "employmentType": ["FULL_TIME", "PART_TIME", "CONTRACTOR"],
    "industry": "Maritime Transportation",
    "occupationalCategory": "Marine Superintendent",
    "workHours": "Varies by assignment",
    "jobBenefits": "Competitive rates, worldwide assignments, professional development",
    "hiringOrganization": {
      "@type": "Organization",
      "name": "ShipinPort.com",
      "url": "https://shipinport.com"
    },
    "jobLocation": {
      "@type": "Place",
      "name": "Worldwide"
    }
  }

  const jobCategories = [
    {
      title: 'ISM/ISPS/MLC Audits',
      description: 'Conduct comprehensive ship audits and compliance assessments',
      icon: '📋',
      count: '150+ Jobs',
      requirements: ['Marine Engineering Degree', 'Audit Certification', '3+ Years Experience']
    },
    {
      title: 'Port State Inspections',
      description: 'Prepare vessels for port state control inspections',
      icon: '🔍',
      count: '200+ Jobs',
      requirements: ['Port State Experience', 'SOLAS/MARPOL Knowledge', 'Inspection Certification']
    },
    {
      title: 'Pre-Vetting Inspections',
      description: 'Charter party compliance and vessel condition assessments',
      icon: '⚓',
      count: '180+ Jobs',
      requirements: ['Charter Party Knowledge', 'Vetting Experience', 'Oil Major Standards']
    },
    {
      title: 'Vessel Management',
      description: 'Full vessel supervision and operational management',
      icon: '🧭',
      count: '120+ Jobs',
      requirements: ['Chief Engineer License', 'Management Experience', 'IMO Regulations']
    },
    {
      title: 'Marine Consultancy',
      description: 'Expert maritime consulting and advisory services',
      icon: '📊',
      count: '90+ Jobs',
      requirements: ['Maritime Law Knowledge', 'Consulting Experience', 'Industry Expertise']
    },
    {
      title: 'Accident Investigation',
      description: 'Marine accident analysis and investigation services',
      icon: '🔬',
      count: '60+ Jobs',
      requirements: ['Investigation Training', 'Legal Knowledge', 'Technical Expertise']
    }
  ]

  const locations = [
    { name: 'Singapore', count: '85+ Jobs', flag: '🇸🇬' },
    { name: 'Rotterdam', count: '72+ Jobs', flag: '🇳🇱' },
    { name: 'Hamburg', count: '68+ Jobs', flag: '🇩🇪' },
    { name: 'Dubai', count: '55+ Jobs', flag: '🇦🇪' },
    { name: 'London', count: '48+ Jobs', flag: '🇬🇧' },
    { name: 'Houston', count: '42+ Jobs', flag: '🇺🇸' },
    { name: 'Shanghai', count: '38+ Jobs', flag: '🇨🇳' },
    { name: 'Oslo', count: '35+ Jobs', flag: '🇳🇴' }
  ]

  const benefits = [
    {
      icon: '💰',
      title: 'Competitive Rates',
      description: 'Earn $300-800 per day based on experience and assignment type'
    },
    {
      icon: '🌍',
      title: 'Global Opportunities',
      description: 'Work with vessels and ports worldwide in major maritime hubs'
    },
    {
      icon: '📈',
      title: 'Career Growth',
      description: 'Build your reputation and expand your professional network'
    },
    {
      icon: '⚡',
      title: 'Flexible Schedule',
      description: 'Choose assignments that fit your availability and preferences'
    },
    {
      icon: '🎓',
      title: 'Professional Development',
      description: 'Access to training programs and industry certifications'
    },
    {
      icon: '🤝',
      title: 'Direct Connections',
      description: 'Connect directly with vessel managers and shipping companies'
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
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            <span className="text-blue-400">Marine Superintendent</span> Jobs
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
            Find your next marine superintendent position. Browse <strong className="text-white">1000+ marine superintendent jobs</strong> 
            worldwide with leading shipping companies and vessel managers.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/auth/register">
              <Button size="lg" className="bg-primary-600 hover:bg-primary-700">
                <BriefcaseIcon className="h-5 w-5 mr-2" />
                Find Marine Superintendent Jobs
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="outline" size="lg">
                <UserGroupIcon className="h-5 w-5 mr-2" />
                Post Marine Superintendent Jobs
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-dark-800/50 p-6 rounded-lg">
              <div className="text-3xl font-bold text-primary-400">1000+</div>
              <div className="text-gray-300">Active Jobs</div>
            </div>
            <div className="bg-dark-800/50 p-6 rounded-lg">
              <div className="text-3xl font-bold text-green-400">150+</div>
              <div className="text-gray-300">Companies</div>
            </div>
            <div className="bg-dark-800/50 p-6 rounded-lg">
              <div className="text-3xl font-bold text-blue-400">50+</div>
              <div className="text-gray-300">Countries</div>
            </div>
            <div className="bg-dark-800/50 p-6 rounded-lg">
              <div className="text-3xl font-bold text-purple-400">$500</div>
              <div className="text-gray-300">Avg Daily Rate</div>
            </div>
          </div>
        </div>

        {/* Job Categories */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Marine Superintendent Job Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobCategories.map((category, index) => (
              <Card key={index} className="hover:bg-dark-700/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl">{category.icon}</span>
                    <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {category.count}
                    </span>
                  </div>
                  <CardTitle className="text-xl text-white">{category.title}</CardTitle>
                  <CardDescription className="text-gray-300">
                    {category.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-white text-sm">Requirements:</h4>
                    {category.requirements.map((req, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-300">
                        <CheckCircleIcon className="h-4 w-4 text-green-400 mr-2" />
                        {req}
                      </div>
                    ))}
                  </div>
                  <Link href="/dashboard/superintendent/search" className="block mt-4">
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

        {/* Top Locations */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Marine Superintendent Jobs by Location
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {locations.map((location, index) => (
              <Link key={index} href={`/dashboard/superintendent/search?location=${location.name}`}>
                <Card className="hover:bg-dark-700/50 transition-colors cursor-pointer text-center p-4">
                  <div className="text-2xl mb-2">{location.flag}</div>
                  <div className="font-semibold text-white text-sm">{location.name}</div>
                  <div className="text-xs text-gray-400">{location.count}</div>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Why Choose Marine Superintendent Jobs at ShipinPort?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-dark-800/50 p-6 rounded-lg text-center">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{benefit.title}</h3>
                <p className="text-gray-300">{benefit.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            How to Get Marine Superintendent Jobs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Create Your Profile</h3>
              <p className="text-gray-300">
                Register as a marine superintendent and complete your professional profile with certifications and experience.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Browse Jobs</h3>
              <p className="text-gray-300">
                Search through 1000+ marine superintendent jobs by location, vessel type, and assignment duration.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Apply & Connect</h3>
              <p className="text-gray-300">
                Apply directly to vessel managers and discuss assignment details through our secure platform.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-gradient-to-r from-primary-600/20 to-blue-600/20 p-12 rounded-2xl">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Find Your Next Marine Superintendent Job?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of marine superintendents who have found their ideal positions through ShipinPort.com
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="bg-primary-600 hover:bg-primary-700">
                Start Your Marine Superintendent Career
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg">
                Contact Us
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
