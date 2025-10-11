import { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  UserIcon, 
  BriefcaseIcon, 
  DocumentCheckIcon, 
  ShieldCheckIcon,
  ChartBarIcon,
  CogIcon,
  AcademicCapIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'

export const metadata: Metadata = {
  title: 'What is a Marine Superintendent? | Complete Career Guide & Definition | ShipinPort.com',
  description: 'Complete guide to marine superintendent roles, responsibilities, and career path. Learn what a marine superintendent does, required qualifications, salary expectations, and how to become one. Professional maritime industry insights.',
  keywords: [
    'marine superintendent',
    'what is marine superintendent',
    'marine superintendent definition',
    'marine superintendent job description',
    'marine superintendent responsibilities',
    'marine superintendent qualifications',
    'marine superintendent salary',
    'marine superintendent career',
    'vessel superintendent',
    'ship superintendent',
    'marine superintendent duties',
    'maritime superintendent',
    'marine superintendent training',
    'marine superintendent certification'
  ],
  alternates: {
    canonical: 'https://shipinport.com/what-is-marine-superintendent',
  },
  openGraph: {
    title: 'What is a Marine Superintendent? | Complete Career Guide',
    description: 'Complete guide to marine superintendent roles, responsibilities, and career path. Professional maritime industry insights.',
    type: 'website',
  },
}

export default function WhatIsMarineSuperintendentPage() {
  const responsibilities = [
    {
      icon: ShieldCheckIcon,
      title: 'Vessel Safety & Compliance',
      description: 'Ensure vessels meet international safety standards including ISM, ISPS, and MLC compliance requirements.'
    },
    {
      icon: DocumentCheckIcon,
      title: 'Inspection & Auditing',
      description: 'Conduct comprehensive vessel inspections, port state control preparations, and regulatory audits.'
    },
    {
      icon: ChartBarIcon,
      title: 'Performance Monitoring',
      description: 'Monitor vessel performance, fuel efficiency, maintenance schedules, and operational metrics.'
    },
    {
      icon: CogIcon,
      title: 'Technical Management',
      description: 'Oversee technical aspects of vessel operations, maintenance planning, and equipment reliability.'
    },
    {
      icon: BriefcaseIcon,
      title: 'Port Operations',
      description: 'Coordinate port activities, cargo operations, and liaise with port authorities and service providers.'
    },
    {
      icon: UserIcon,
      title: 'Crew Management',
      description: 'Supervise crew performance, training requirements, and personnel management aboard vessels.'
    }
  ]

  const qualifications = [
    'Marine engineering degree or equivalent maritime qualification',
    'Minimum 2-3 years sea-going experience as officer',
    'Strong knowledge of international maritime regulations',
    'Experience with vessel inspections and audits',
    'Excellent communication and leadership skills',
    'Problem-solving and analytical abilities'
  ]

  const careerPaths = [
    {
      title: 'Junior Marine Superintendent',
      experience: '2-5 years',
      description: 'Entry-level position focusing on basic vessel oversight and compliance monitoring.'
    },
    {
      title: 'Senior Marine Superintendent',
      experience: '5-10 years',
      description: 'Advanced role managing multiple vessels and complex technical operations.'
    },
    {
      title: 'Fleet Superintendent',
      experience: '10+ years',
      description: 'Senior position overseeing entire fleet operations and strategic planning.'
    },
    {
      title: 'Technical Director',
      experience: '15+ years',
      description: 'Executive level role managing technical strategy and fleet development.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            What is a Marine Superintendent?
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            A marine superintendent is a senior maritime professional responsible for overseeing vessel operations, 
            ensuring regulatory compliance, and managing technical aspects of ship operations. They serve as the 
            critical link between ship management companies and vessel crews.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/marine-superintendent-jobs">
              <Button size="lg" className="bg-primary-600 hover:bg-primary-700">
                Browse Marine Superintendent Jobs
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="outline" size="lg">
                Start Your Career
              </Button>
            </Link>
          </div>
        </div>

        {/* Definition Section */}
        <section className="mb-16">
          <Card className="bg-dark-800/50 backdrop-blur-sm border-dark-700">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-3">
                <AcademicCapIcon className="h-8 w-8 text-primary-400" />
                Marine Superintendent Definition
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-lg prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed">
                  A <strong className="text-white">marine superintendent</strong> is a specialized maritime professional who acts as the 
                  technical and operational supervisor for commercial vessels. They are responsible for ensuring that ships operate 
                  safely, efficiently, and in compliance with international maritime regulations.
                </p>
                <p className="text-gray-300 leading-relaxed mt-4">
                  Marine superintendents typically work for ship management companies, shipping lines, or marine consultancy firms. 
                  They serve as the primary point of contact between vessel crews and shore-based management, providing technical 
                  expertise and operational guidance to ensure optimal vessel performance.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Key Responsibilities */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Key Responsibilities of a Marine Superintendent
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {responsibilities.map((item, index) => (
              <Card key={index} className="bg-dark-800/50 backdrop-blur-sm border-dark-700 hover:border-primary-500/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <item.icon className="h-8 w-8 text-primary-400" />
                    <CardTitle className="text-lg text-white">{item.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300">
                    {item.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Qualifications & Requirements */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-dark-800/50 backdrop-blur-sm border-dark-700">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center gap-3">
                  <DocumentCheckIcon className="h-8 w-8 text-primary-400" />
                  Required Qualifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {qualifications.map((qual, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-300">
                      <div className="w-2 h-2 bg-primary-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>{qual}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-dark-800/50 backdrop-blur-sm border-dark-700">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center gap-3">
                  <CurrencyDollarIcon className="h-8 w-8 text-primary-400" />
                  Salary Expectations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-primary-500/10 rounded-lg border border-primary-500/20">
                    <h4 className="font-semibold text-primary-400 mb-1">Junior Level</h4>
                    <p className="text-white">$60,000 - $80,000 annually</p>
                  </div>
                  <div className="p-4 bg-primary-500/10 rounded-lg border border-primary-500/20">
                    <h4 className="font-semibold text-primary-400 mb-1">Senior Level</h4>
                    <p className="text-white">$80,000 - $120,000 annually</p>
                  </div>
                  <div className="p-4 bg-primary-500/10 rounded-lg border border-primary-500/20">
                    <h4 className="font-semibold text-primary-400 mb-1">Fleet Level</h4>
                    <p className="text-white">$120,000+ annually</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Career Progression */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Career Progression Path
          </h2>
          <div className="space-y-6">
            {careerPaths.map((path, index) => (
              <Card key={index} className="bg-dark-800/50 backdrop-blur-sm border-dark-700">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">{path.title}</h3>
                      <p className="text-gray-300 mb-2">{path.description}</p>
                      <span className="inline-block px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm">
                        {path.experience} experience
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Industry Insights */}
        <section className="mb-16">
          <Card className="bg-gradient-to-r from-blue-900/30 to-primary-900/30 border border-blue-800/30">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Industry Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-400 mb-2">15%</div>
                  <p className="text-gray-300">Expected job growth in marine superintendent positions over the next decade</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-400 mb-2">85%</div>
                  <p className="text-gray-300">Of marine superintendents work for ship management companies</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-400 mb-2">Global</div>
                  <p className="text-gray-300">Opportunities available worldwide in major shipping hubs</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <Card className="bg-gradient-to-r from-primary-900/30 to-blue-900/30 border border-primary-500/30">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                Ready to Start Your Marine Superintendent Career?
              </h2>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Join ShipinPort.com to connect with vessel managers, find marine superintendent jobs, 
                and access professional development resources in the maritime industry.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/register">
                  <Button size="lg" className="bg-primary-600 hover:bg-primary-700">
                    Create Your Profile
                  </Button>
                </Link>
                <Link href="/marine-superintendent-jobs">
                  <Button variant="outline" size="lg">
                    Browse Current Jobs
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  )
}
