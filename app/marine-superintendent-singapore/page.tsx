import { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  MapPinIcon,
  BriefcaseIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline'

export const metadata: Metadata = {
  title: 'Marine Superintendent Singapore - Vessel Inspections & Maritime Jobs Singapore | ShipinPort.com',
  description: 'Find marine superintendent jobs in Singapore. Professional vessel inspections, ISM audits, port state inspections, and maritime consulting services in Singapore. Connect with Singapore shipping companies.',
  keywords: [
    'marine superintendent singapore',
    'marine superintendent jobs singapore',
    'vessel inspection singapore',
    'maritime jobs singapore',
    'ship inspection singapore',
    'port state inspection singapore',
    'marine consultancy singapore',
    'shipping jobs singapore',
    'maritime services singapore',
    'vessel management singapore',
    'ISM audit singapore',
    'marine superintendent singapore port',
    'maritime employment singapore',
    'vessel superintendent singapore',
    'marine engineer singapore'
  ],
  openGraph: {
    title: 'Marine Superintendent Singapore - Maritime Jobs & Services | ShipinPort.com',
    description: 'Professional marine superintendent services in Singapore. Find vessel inspection jobs, ISM audits, and maritime consulting opportunities in Singapore\'s shipping industry.',
    type: 'website',
  },
}

export default function MarineSuperintendentSingaporePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Marine Superintendent Services Singapore",
    "description": "Professional marine superintendent and vessel inspection services in Singapore",
    "url": "https://shipinport.com/marine-superintendent-singapore",
    "telephone": "+65-XXXX-XXXX",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "SG",
      "addressLocality": "Singapore"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "1.3521",
      "longitude": "103.8198"
    },
    "areaServed": {
      "@type": "Place",
      "name": "Singapore"
    },
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": "1.3521",
        "longitude": "103.8198"
      },
      "geoRadius": "50000"
    }
  }

  const services = [
    {
      title: 'Port State Inspections',
      description: 'Singapore MPA compliance and port state control preparation',
      icon: '🏗️',
      rate: '$400-600/day',
      demand: 'High'
    },
    {
      title: 'ISM/ISPS/MLC Audits',
      description: 'Comprehensive ship audits for Singapore-registered vessels',
      icon: '📋',
      rate: '$500-700/day',
      demand: 'Very High'
    },
    {
      title: 'Pre-Vetting Inspections',
      description: 'Charter party compliance for major oil companies',
      icon: '⚓',
      rate: '$450-650/day',
      demand: 'High'
    },
    {
      title: 'Vessel Management',
      description: 'Full vessel supervision in Singapore waters',
      icon: '🧭',
      rate: '$600-800/day',
      demand: 'Medium'
    },
    {
      title: 'Marine Consultancy',
      description: 'Expert maritime advisory services in Singapore',
      icon: '📊',
      rate: '$400-600/day',
      demand: 'Medium'
    },
    {
      title: 'Accident Investigation',
      description: 'Marine incident analysis and investigation',
      icon: '🔬',
      rate: '$700-1000/day',
      demand: 'Low'
    }
  ]

  const companies = [
    { name: 'Keppel Corporation', logo: '🏢', jobs: '25+ Positions' },
    { name: 'Sembcorp Marine', logo: '⚙️', jobs: '18+ Positions' },
    { name: 'PSA International', logo: '🚢', jobs: '22+ Positions' },
    { name: 'Yangzijiang Shipbuilding', logo: '🏭', jobs: '15+ Positions' },
    { name: 'BW Group', logo: '🌊', jobs: '12+ Positions' },
    { name: 'Pacific International Lines', logo: '📦', jobs: '8+ Positions' }
  ]

  const ports = [
    { name: 'Singapore Port', distance: '0 km', type: 'Container Terminal' },
    { name: 'Jurong Port', distance: '15 km', type: 'General Cargo' },
    { name: 'Keppel Harbour', distance: '8 km', type: 'Marina & Commercial' },
    { name: 'Tuas Port', distance: '25 km', type: 'Future Mega Port' },
    { name: 'Pulau Bukom', distance: '12 km', type: 'Oil Terminal' },
    { name: 'Sembawang Shipyard', distance: '20 km', type: 'Ship Repair' }
  ]

  const stats = [
    { label: 'Active Jobs', value: '85+', color: 'text-blue-400' },
    { label: 'Companies', value: '45+', color: 'text-green-400' },
    { label: 'Avg Daily Rate', value: '$550', color: 'text-purple-400' },
    { label: 'Port Calls/Year', value: '130,000+', color: 'text-orange-400' }
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
          <div className="flex items-center justify-center mb-6">
            <span className="text-6xl mr-4">🇸🇬</span>
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-white">
                Marine Superintendent <span className="text-blue-400">Singapore</span>
              </h1>
              <p className="text-xl text-gray-300">Asia's Premier Maritime Hub</p>
            </div>
          </div>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
            Find <strong className="text-white">marine superintendent jobs in Singapore</strong> with leading 
            shipping companies, shipyards, and maritime service providers in the world's busiest port.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/dashboard/superintendent/search?location=Singapore">
              <Button size="lg" className="bg-primary-600 hover:bg-primary-700">
                <BriefcaseIcon className="h-5 w-5 mr-2" />
                View Singapore Marine Jobs
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="outline" size="lg">
                <UserGroupIcon className="h-5 w-5 mr-2" />
                Join Singapore Network
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="bg-dark-800/50 p-6 rounded-lg">
                <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Why Singapore Section */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">
                Why Choose Singapore for Marine Superintendent Careers?
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircleIcon className="h-6 w-6 text-green-400 mr-3 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">World's Busiest Port</h3>
                    <p className="text-gray-300">130,000+ vessel calls annually with diverse maritime activities</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircleIcon className="h-6 w-6 text-green-400 mr-3 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">Strategic Location</h3>
                    <p className="text-gray-300">Gateway to Asia-Pacific with excellent connectivity</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircleIcon className="h-6 w-6 text-green-400 mr-3 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">High Standards</h3>
                    <p className="text-gray-300">MPA regulations ensure quality and professional standards</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircleIcon className="h-6 w-6 text-green-400 mr-3 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">Competitive Rates</h3>
                    <p className="text-gray-300">Premium rates for qualified marine superintendents</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-dark-800/50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-white mb-6">Singapore Maritime Facts</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-300">Port Ranking:</span>
                  <span className="text-white font-semibold">#1 Container Port</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Maritime GDP:</span>
                  <span className="text-white font-semibold">7% of Total GDP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Ship Registry:</span>
                  <span className="text-white font-semibold">4,000+ Vessels</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Maritime Workforce:</span>
                  <span className="text-white font-semibold">170,000+ People</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Bunkering Hub:</span>
                  <span className="text-white font-semibold">#1 Global</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services & Rates */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Marine Superintendent Services in Singapore
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="hover:bg-dark-700/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl">{service.icon}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      service.demand === 'Very High' ? 'bg-red-600 text-white' :
                      service.demand === 'High' ? 'bg-orange-600 text-white' :
                      service.demand === 'Medium' ? 'bg-yellow-600 text-white' :
                      'bg-gray-600 text-white'
                    }`}>
                      {service.demand} Demand
                    </span>
                  </div>
                  <CardTitle className="text-xl text-white">{service.title}</CardTitle>
                  <CardDescription className="text-gray-300">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-400">Daily Rate:</span>
                    <span className="text-lg font-semibold text-green-400">{service.rate}</span>
                  </div>
                  <Link href="/dashboard/superintendent/search?service=ism&location=Singapore">
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

        {/* Top Companies */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Leading Maritime Companies in Singapore
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company, index) => (
              <Link key={index} href={`/dashboard/superintendent/search?company=${company.name}`}>
                <Card className="hover:bg-dark-700/50 transition-colors cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">{company.logo}</div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{company.name}</h3>
                        <p className="text-sm text-gray-400">{company.jobs}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Singapore Ports */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Singapore Ports & Terminals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ports.map((port, index) => (
              <Card key={index} className="hover:bg-dark-700/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-white">{port.name}</h3>
                    <span className="text-sm text-gray-400">{port.distance}</span>
                  </div>
                  <p className="text-sm text-gray-300 mb-3">{port.type}</p>
                  <div className="flex items-center text-sm text-primary-400">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    Singapore
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Requirements */}
        <section className="mb-16">
          <div className="bg-dark-800/50 p-8 rounded-lg">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Requirements for Marine Superintendents in Singapore
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Essential Qualifications</h3>
                <ul className="space-y-2">
                  <li className="flex items-center text-gray-300">
                    <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3" />
                    Marine Engineering Degree or equivalent
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3" />
                    Minimum 3 years maritime experience
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3" />
                    Valid STCW certificates
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3" />
                    English proficiency (spoken & written)
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Preferred Certifications</h3>
                <ul className="space-y-2">
                  <li className="flex items-center text-gray-300">
                    <CheckCircleIcon className="h-5 w-5 text-blue-400 mr-3" />
                    ISM/ISPS/MLC audit qualifications
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckCircleIcon className="h-5 w-5 text-blue-400 mr-3" />
                    Port state inspection experience
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckCircleIcon className="h-5 w-5 text-blue-400 mr-3" />
                    Oil major vetting certifications
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckCircleIcon className="h-5 w-5 text-blue-400 mr-3" />
                    Singapore MPA recognized qualifications
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-gradient-to-r from-primary-600/20 to-blue-600/20 p-12 rounded-2xl">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Work as a Marine Superintendent in Singapore?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join the premier maritime hub and connect with leading shipping companies in Singapore
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="bg-primary-600 hover:bg-primary-700">
                Start Your Singapore Career
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg">
                Get More Information
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
