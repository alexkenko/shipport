import { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CheckCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

export const metadata: Metadata = {
  title: 'Marine Superintendent FAQ - Common Questions About Marine Superintendent Jobs & Services',
  description: 'Get answers to frequently asked questions about marine superintendent jobs, qualifications, rates, and services. Learn about marine superintendent careers, ISM audits, port state inspections, and maritime consulting.',
  keywords: [
    'marine superintendent FAQ',
    'marine superintendent questions',
    'marine superintendent jobs FAQ',
    'marine superintendent qualifications',
    'marine superintendent rates',
    'marine superintendent services',
    'ISM audit questions',
    'port state inspection FAQ',
    'marine consultancy questions',
    'maritime jobs FAQ',
    'vessel inspection questions',
    'marine superintendent career',
    'marine superintendent salary',
    'marine superintendent requirements',
    'maritime employment FAQ'
  ],
  openGraph: {
    title: 'Marine Superintendent FAQ - Your Questions Answered | ShipinPort.com',
    description: 'Find answers to common questions about marine superintendent jobs, qualifications, rates, and services. Expert guidance on maritime careers.',
    type: 'website',
  },
}

export default function MarineSuperintendentFAQPage() {
  const faqs = [
    {
      question: "What is a marine superintendent?",
      answer: "A marine superintendent is a qualified maritime professional responsible for overseeing vessel operations, conducting inspections, ensuring regulatory compliance, and managing ship maintenance. Marine superintendents work with vessel managers, shipping companies, and port authorities to ensure ships meet international maritime standards including ISM, ISPS, and MLC regulations."
    },
    {
      question: "What qualifications do I need to become a marine superintendent?",
      answer: "To become a marine superintendent, you typically need a marine engineering degree or equivalent maritime qualification, minimum 3-5 years of maritime experience, valid STCW certificates, and specialized training in areas like ISM/ISPS/MLC audits. Additional certifications in port state inspections, oil major vetting, and marine consultancy are highly valued by employers."
    },
    {
      question: "What are the typical rates for marine superintendent jobs?",
      answer: "Marine superintendent rates vary based on experience, location, and assignment type. Typical daily rates range from $300-800 USD, with senior superintendents commanding $600-1000+ per day. Factors affecting rates include vessel type (tanker, bulk carrier, container), location (Singapore, Rotterdam, Hamburg), and specialization (ISM audits, port state inspections, SIRE 2.0 vetting)."
    },
    {
      question: "What types of marine superintendent jobs are available?",
      answer: "Marine superintendent jobs include ISM/ISPS/MLC audits, port state inspections, pre-vetting inspections, vessel management, marine consultancy, accident investigation, and technical superintendency. Jobs can be contract-based, full-time positions, or project-specific assignments with shipping companies, shipyards, classification societies, and maritime service providers."
    },
    {
      question: "How do I find marine superintendent jobs?",
      answer: "You can find marine superintendent jobs through maritime job boards, shipping company websites, maritime recruitment agencies, and platforms like ShipinPort.com. Networking with maritime professionals, attending industry conferences, and maintaining an updated LinkedIn profile with maritime keywords also helps. Many positions are filled through referrals and industry connections."
    },
    {
      question: "What is ISM audit in marine superintendent work?",
      answer: "ISM (International Safety Management) audit is a comprehensive assessment of a vessel's safety management system to ensure compliance with SOLAS regulations. Marine superintendents conduct ISM audits to verify that ships have proper safety procedures, emergency response plans, maintenance schedules, and crew training programs in place."
    },
    {
      question: "What is port state inspection and why is it important?",
      answer: "Port state inspection is an examination of foreign ships by port authorities to ensure compliance with international maritime regulations. Marine superintendents help prepare vessels for these inspections by conducting pre-inspection audits, ensuring documentation is complete, and addressing any deficiencies before the official inspection to avoid detentions and delays."
    },
    {
      question: "What is SIRE 2.0 vetting in marine superintendent services?",
      answer: "SIRE 2.0 (Ship Inspection Report Exchange) is an advanced vessel inspection system used by oil major companies to assess tanker safety and quality. Marine superintendents conduct SIRE 2.0 vetting inspections to evaluate vessel condition, crew competency, and operational procedures against stringent oil major standards."
    },
    {
      question: "How much experience do I need for marine superintendent jobs?",
      answer: "Most marine superintendent positions require 3-5 years of maritime experience, though senior roles may require 7-10+ years. Experience as a chief engineer, port captain, or maritime surveyor is highly valued. Fresh graduates can start with junior superintendent roles or assistant positions to gain experience under senior superintendents."
    },
    {
      question: "What are the career prospects for marine superintendents?",
      answer: "Marine superintendent careers offer excellent growth opportunities including senior superintendent roles, fleet management positions, maritime consultancy, and independent contracting. The maritime industry is growing, creating demand for qualified marine superintendents worldwide. Career advancement often leads to higher rates, more prestigious assignments, and leadership positions."
    },
    {
      question: "Do I need to travel for marine superintendent jobs?",
      answer: "Yes, marine superintendent jobs typically involve significant travel as assignments can be worldwide. You may work in major ports like Singapore, Rotterdam, Hamburg, Dubai, and Houston. Some positions offer rotational schedules (e.g., 4 weeks on, 4 weeks off), while others are project-based requiring travel to specific locations for vessel inspections and audits."
    },
    {
      question: "What is the difference between marine superintendent and marine engineer?",
      answer: "Marine superintendents focus on vessel operations management, inspections, audits, and regulatory compliance, while marine engineers primarily handle technical maintenance and repair of ship machinery and systems. Marine superintendents often have engineering backgrounds but work in supervisory and inspection roles rather than hands-on technical work."
    },
    {
      question: "How do I get certified as a marine superintendent?",
      answer: "Marine superintendent certification typically involves completing maritime education (marine engineering degree), gaining sea-going experience, obtaining STCW certificates, and completing specialized training in ISM/ISPS/MLC audits, port state inspections, and oil major vetting. Many classification societies and maritime training institutions offer marine superintendent certification programs."
    },
    {
      question: "What companies hire marine superintendents?",
      answer: "Marine superintendents are hired by shipping companies (Maersk, MSC, CMA CGM), oil majors (Shell, BP, ExxonMobil), shipyards (Keppel, Sembcorp Marine), classification societies (Lloyd's Register, DNV, ABS), port authorities, maritime consultancies, and independent vessel managers. The largest employers are typically major shipping companies and oil majors."
    },
    {
      question: "What is marine consultancy and how does it differ from superintendency?",
      answer: "Marine consultancy involves providing expert advisory services on maritime operations, regulatory compliance, risk management, and technical matters. Marine superintendency focuses on hands-on vessel management, inspections, and operational oversight. Many marine superintendents also offer consultancy services, leveraging their practical experience to advise clients on maritime best practices."
    }
  ]

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }

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
            Marine Superintendent <span className="text-primary-400">FAQ</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-8">
            Get answers to the most common questions about <strong className="text-white">marine superintendent jobs</strong>, 
            qualifications, rates, and services. Expert guidance on maritime careers and marine consultancy.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/marine-superintendent-jobs">
              <Button size="lg" className="bg-primary-600 hover:bg-primary-700">
                Find Marine Superintendent Jobs
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg">
                Ask a Question
              </Button>
            </Link>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="hover:bg-dark-700/50 transition-colors">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-start">
                    <span className="text-primary-400 mr-3 mt-1">Q{index + 1}:</span>
                    {faq.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Additional Resources */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Additional Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Link href="/marine-superintendent-jobs">
              <Card className="hover:bg-dark-700/50 transition-colors cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">💼</div>
                  <h3 className="text-lg font-semibold text-white mb-2">Marine Superintendent Jobs</h3>
                  <p className="text-gray-300 text-sm">Browse 1000+ marine superintendent positions worldwide</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/marine-superintendent-singapore">
              <Card className="hover:bg-dark-700/50 transition-colors cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">🇸🇬</div>
                  <h3 className="text-lg font-semibold text-white mb-2">Singapore Jobs</h3>
                  <p className="text-gray-300 text-sm">Find marine superintendent jobs in Singapore</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/services">
              <Card className="hover:bg-dark-700/50 transition-colors cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">🔧</div>
                  <h3 className="text-lg font-semibold text-white mb-2">Marine Services</h3>
                  <p className="text-gray-300 text-sm">ISM audits, port state inspections, and more</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-16 text-center bg-gradient-to-r from-primary-600/20 to-blue-600/20 p-12 rounded-2xl">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Marine Superintendent Career?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of marine superintendents who have found their ideal positions through ShipinPort.com
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="bg-primary-600 hover:bg-primary-700">
                Get Started Today
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg">
                Contact Our Experts
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
