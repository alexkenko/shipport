import { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Marine Superintendent Services - ISM ISPS MLC Audits, Vessel Inspections & Maritime Consulting',
  description: 'Comprehensive marine superintendent services including ISM ISPS MLC audits, pre-vetting inspections, vessel assessments, navigation audits, and maritime consulting. Professional marine industry services worldwide.',
  keywords: [
    'marine superintendent services',
    'ISM audit services',
    'ISPS audit services',
    'MLC audit services',
    'pre-vetting inspection services',
    'vessel inspection services',
    'marine consultancy services',
    'TMSA preparation services',
    'navigation audit services',
    'cargo supervision services',
    'flag state inspection services',
    'VDR analysis services',
    'marine accident investigation',
    'bulk vessel inspection',
    'pre purchase inspection',
    'marine safety compliance',
    'maritime consulting services',
    'ship inspection services',
    'marine compliance audit',
    'vessel safety inspection'
  ],
  openGraph: {
    title: 'Marine Superintendent Services - Professional Maritime Solutions',
    description: 'Professional marine superintendent services including audits, inspections, and maritime consulting worldwide.',
    type: 'website',
  },
}

export default function ServicesPage() {
  const services = [
    {
      title: 'Pre-Vetting Inspections',
      description: 'Comprehensive vessel assessments for charter requirements and compliance verification. Our certified marine superintendents conduct thorough pre-vetting inspections to ensure your vessels meet the highest industry standards.',
      icon: '🔍',
      features: [
        'Charter party compliance verification',
        'Vessel condition assessment',
        'Safety equipment inspection',
        'Documentation review',
        'Operational readiness evaluation'
      ],
      keywords: 'pre-vetting inspection, charter inspection, vessel assessment, charter compliance'
    },
    {
      title: 'ISM, ISPS, MLC Audits',
      description: 'Certified audits ensuring compliance with international maritime safety standards. Our experienced auditors provide comprehensive ISM, ISPS, and MLC audits to maintain regulatory compliance.',
      icon: '📋',
      features: [
        'ISM Code compliance audits',
        'ISPS Code security audits',
        'MLC 2006 compliance audits',
        'Documentation verification',
        'Corrective action planning'
      ],
      keywords: 'ISM audit, ISPS audit, MLC audit, maritime compliance audit, safety management audit'
    },
    {
      title: 'Marine Consultancy',
      description: 'Expert advice on vessel operations, safety management, and regulatory compliance. Our marine consultants provide strategic guidance to optimize your maritime operations and ensure regulatory compliance.',
      icon: '⚓',
      features: [
        'Operational efficiency consulting',
        'Safety management systems',
        'Regulatory compliance guidance',
        'Risk assessment and mitigation',
        'Performance optimization'
      ],
      keywords: 'marine consultancy, maritime consulting, vessel operations consulting, marine safety consulting'
    },
    {
      title: 'TMSA Preparation',
      description: 'Preparation and implementation of Tanker Management and Self Assessment programs. Our specialists help you achieve and maintain TMSA compliance with comprehensive preparation services.',
      icon: '🛢️',
      features: [
        'TMSA gap analysis',
        'Management system development',
        'Documentation preparation',
        'Training and implementation',
        'Continuous improvement planning'
      ],
      keywords: 'TMSA preparation, tanker management, self assessment, TMSA compliance, tanker safety'
    },
    {
      title: 'Navigation Audits',
      description: 'Comprehensive navigation system assessments and safety evaluations. Our navigation experts conduct detailed audits to ensure your vessels navigation systems meet international standards.',
      icon: '🧭',
      features: [
        'Navigation equipment audit',
        'Bridge procedures review',
        'Safety equipment verification',
        'Training assessment',
        'Compliance documentation'
      ],
      keywords: 'navigation audit, bridge audit, navigation safety, maritime navigation, bridge procedures'
    },
    {
      title: 'Cargo Supervision',
      description: 'Professional oversight of cargo operations ensuring safety and compliance. Our cargo specialists provide comprehensive supervision services for all types of marine cargo operations.',
      icon: '📦',
      features: [
        'Cargo loading supervision',
        'Stowage planning oversight',
        'Safety compliance monitoring',
        'Documentation verification',
        'Risk assessment'
      ],
      keywords: 'cargo supervision, cargo handling, marine cargo, cargo safety, stowage supervision'
    },
    {
      title: 'Bulk Vessel Inspections',
      description: 'Specialized inspections for bulk carriers and cargo vessels. Our bulk vessel experts provide comprehensive inspections tailored to the unique requirements of bulk cargo operations.',
      icon: '🚢',
      features: [
        'Cargo hold inspection',
        'Loading equipment assessment',
        'Structural integrity evaluation',
        'Safety system verification',
        'Operational readiness check'
      ],
      keywords: 'bulk vessel inspection, bulk carrier inspection, cargo vessel inspection, bulk cargo inspection'
    },
    {
      title: 'Pre Purchase Inspections',
      description: 'Comprehensive vessel inspections before purchase decisions. Our marine surveyors provide detailed pre-purchase inspections to ensure you make informed investment decisions.',
      icon: '💰',
      features: [
        'Hull and machinery survey',
        'Condition assessment',
        'Market value evaluation',
        'Operational capability review',
        'Investment risk analysis'
      ],
      keywords: 'pre purchase inspection, vessel survey, marine survey, ship inspection, vessel appraisal'
    },
    {
      title: 'Flag State Inspections',
      description: 'Official flag state inspections and compliance verification. Our certified inspectors conduct flag state inspections to ensure compliance with national maritime regulations.',
      icon: '🏁',
      features: [
        'Flag state compliance audit',
        'Regulatory documentation review',
        'Safety equipment inspection',
        'Crew certification verification',
        'Corrective action coordination'
      ],
      keywords: 'flag state inspection, maritime regulation compliance, flag state audit, national maritime compliance'
    },
    {
      title: 'VDR Analysis',
      description: 'Voyage Data Recorder analysis and incident investigation. Our VDR specialists provide comprehensive analysis services for incident investigation and operational improvement.',
      icon: '📊',
      features: [
        'VDR data extraction',
        'Incident timeline reconstruction',
        'Performance analysis',
        'Root cause investigation',
        'Preventive measure recommendations'
      ],
      keywords: 'VDR analysis, voyage data recorder, incident investigation, marine incident analysis, VDR data analysis'
    },
    {
      title: 'Accident Investigation',
      description: 'Professional marine accident investigation and analysis services. Our investigators provide comprehensive accident analysis to determine causes and prevent future incidents.',
      icon: '🔍',
      features: [
        'Accident scene investigation',
        'Evidence collection and analysis',
        'Witness interviews',
        'Root cause determination',
        'Preventive recommendations'
      ],
      keywords: 'marine accident investigation, ship accident investigation, maritime incident analysis, marine safety investigation'
    },
    {
      title: 'Safety & Compliance Supervision',
      description: 'Comprehensive safety and compliance supervision services. Our safety specialists ensure your operations meet all international maritime safety and compliance standards.',
      icon: '🛡️',
      features: [
        'Safety system implementation',
        'Compliance monitoring',
        'Training program development',
        'Risk assessment and mitigation',
        'Continuous improvement planning'
      ],
      keywords: 'marine safety supervision, maritime compliance supervision, safety management, compliance monitoring'
    }
  ]

  return (
    <div className="min-h-screen bg-dark-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Professional <span className="text-primary-400">Marine Services</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Comprehensive marine superintendent services delivered by certified professionals worldwide. 
            From ISM ISPS MLC audits to vessel inspections and maritime consulting.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <div key={index} className="glass p-6 rounded-xl hover:bg-dark-700/50 transition-all duration-300">
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-3">{service.title}</h3>
              <p className="text-gray-300 mb-4">{service.description}</p>
              <ul className="space-y-2 mb-6">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="text-sm text-gray-400 flex items-start">
                    <span className="text-primary-400 mr-2">•</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="text-xs text-primary-300 font-medium">
                Keywords: {service.keywords}
              </div>
            </div>
          ))}
        </div>

        {/* Service Categories */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Service Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass p-6 rounded-xl text-center">
              <div className="text-3xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-white mb-2">Inspections</h3>
              <p className="text-gray-300 text-sm">
                Pre-vetting, bulk vessel, and pre-purchase inspections
              </p>
            </div>
            
            <div className="glass p-6 rounded-xl text-center">
              <div className="text-3xl mb-4">📋</div>
              <h3 className="text-lg font-semibold text-white mb-2">Audits</h3>
              <p className="text-gray-300 text-sm">
                ISM, ISPS, MLC, and compliance audits
              </p>
            </div>
            
            <div className="glass p-6 rounded-xl text-center">
              <div className="text-3xl mb-4">⚓</div>
              <h3 className="text-lg font-semibold text-white mb-2">Consultancy</h3>
              <p className="text-gray-300 text-sm">
                Marine consultancy and operational guidance
              </p>
            </div>
            
            <div className="glass p-6 rounded-xl text-center">
              <div className="text-3xl mb-4">🛡️</div>
              <h3 className="text-lg font-semibold text-white mb-2">Safety</h3>
              <p className="text-gray-300 text-sm">
                Safety supervision and compliance monitoring
              </p>
            </div>
          </div>
        </section>

        {/* Why Choose Our Services */}
        <section className="mb-16">
          <div className="glass p-8 rounded-xl">
            <h2 className="text-3xl font-bold text-white mb-6">Why Choose Our Marine Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Certified Professionals</h3>
                <p className="text-gray-300">
                  All our marine superintendents are certified professionals with proper ISM, ISPS, MLC, 
                  and other maritime certifications.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Global Coverage</h3>
                <p className="text-gray-300">
                  Access to marine professionals in ports worldwide, ensuring you can find the right 
                  expert for any location.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Competitive Pricing</h3>
                <p className="text-gray-300">
                  Transparent pricing with options for door-to-door or gangway-to-gangway service delivery.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Quality Assurance</h3>
                <p className="text-gray-300">
                  Rigorous quality standards and professional oversight ensure consistent, high-quality service delivery.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Fast Response</h3>
                <p className="text-gray-300">
                  Quick response times and efficient matching system to connect you with the right professional promptly.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Compliance Focus</h3>
                <p className="text-gray-300">
                  All services designed to ensure compliance with international maritime regulations and standards.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className="glass p-8 rounded-xl">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Access Professional Marine Services?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Connect with certified marine superintendents and vessel managers to access the professional 
              services your maritime operations need.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/register?type=manager"
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200"
              >
                Find Marine Services
              </Link>
              <Link
                href="/auth/register?type=superintendent"
                className="bg-marine-600 hover:bg-marine-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200"
              >
                Offer Your Services
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
