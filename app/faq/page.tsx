import { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'FAQ - Frequently Asked Questions | ShipinPort.com Marine Platform',
  description: 'Find answers to frequently asked questions about ShipinPort.com marine superintendent platform, vessel management services, and maritime professional networking.',
  keywords: [
    'FAQ',
    'frequently asked questions',
    'marine platform help',
    'vessel manager questions',
    'superintendent questions',
    'maritime platform support',
    'shipinport help'
  ],
}

export default function FAQPage() {
  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "What is ShipinPort.com?",
          answer: "ShipinPort is a professional networking platform that connects vessel managers with certified marine superintendents worldwide. We facilitate maritime professional services including vessel inspections, audits, consultancy, and compliance management."
        },
        {
          question: "How do I create an account?",
          answer: "Click the 'Create Account' button on our homepage and select whether you're a Vessel Manager or Marine Superintendent. Fill in your basic information and you'll be able to access the platform immediately."
        },
        {
          question: "Is there a registration fee?",
          answer: "No, creating an account on ShipinPort is completely free. We only facilitate connections between professionals - all service agreements and payments are handled directly between users."
        },
        {
          question: "What types of users can join?",
          answer: "We welcome two main types of users: Vessel Managers (who need marine superintendent services) and Marine Superintendents (who provide professional maritime services)."
        }
      ]
    },
    {
      category: "For Vessel Managers",
      questions: [
        {
          question: "How do I post a job requirement?",
          answer: "After logging in, go to your dashboard and click 'Post a New Job'. Fill in details about the port location, type of attendance needed, vessel type, and date requirements. Your post will be visible to qualified superintendents."
        },
        {
          question: "How do I find qualified superintendents?",
          answer: "Use our 'Search Superintendent' feature with filters for port location, vessel type, certifications, and availability. You can view detailed profiles and contact superintendents directly."
        },
        {
          question: "What information should I include in my job post?",
          answer: "Include specific details about the port location, type of vessel, required attendance type (onboard/ashore), date range, and any specific certifications or experience requirements."
        },
        {
          question: "How do I know if a superintendent is qualified?",
          answer: "All superintendents can display their certifications (ISM, ISPS, MLC, etc.), experience, and port coverage. We recommend reviewing profiles thoroughly and conducting your own due diligence."
        }
      ]
    },
    {
      category: "For Marine Superintendents",
      questions: [
        {
          question: "How do I create my professional profile?",
          answer: "After registration, go to your profile page to add your certifications, vessel types you work with, ports you cover, services you offer, and pricing information. A complete profile helps managers find you."
        },
        {
          question: "What certifications should I list?",
          answer: "List all relevant maritime certifications including ISM, ISPS, MLC, BCAV, and any others. You can also add custom certifications that may be relevant to your services."
        },
        {
          question: "How do I apply for jobs?",
          answer: "Browse available jobs using our search filters. When you find a suitable opportunity, click the 'Express Interest' button to notify the manager of your availability and qualifications."
        },
        {
          question: "Can I set my own pricing?",
          answer: "Yes, you can set your price per workday and price per idle day. You can also specify whether your service is 'Door to Door' or 'Gangway to Gangway'."
        }
      ]
    },
    {
      category: "Services & Compliance",
      questions: [
        {
          question: "What services can superintendents provide?",
          answer: "Services include Pre-Vetting Inspections, ISM/ISPS/MLC Audits, Marine Consultancy, TMSA Preparation, Navigation Audits, Cargo Supervision, Flag State Inspections, Accident Investigation, VDR Analysis, and more."
        },
        {
          question: "Are all services compliant with maritime regulations?",
          answer: "We require all users to comply with applicable maritime regulations including IMO, SOLAS, MARPOL, and flag state requirements. However, we recommend conducting your own due diligence on any service provider."
        },
        {
          question: "What if I need a service not listed?",
          answer: "Post a custom job requirement describing the specific service needed. Our network of marine superintendents may have the expertise you're looking for."
        },
        {
          question: "How do I ensure quality of service?",
          answer: "Review superintendent profiles thoroughly, check certifications, and consider requesting references. All agreements and quality standards are established directly between users."
        }
      ]
    },
    {
      category: "Technical & Account",
      questions: [
        {
          question: "How do I update my profile information?",
          answer: "Log in to your account and click on 'Edit Profile' in the header or go directly to your profile page. You can update all information including contact details, certifications, and service offerings."
        },
        {
          question: "Can I change my user type after registration?",
          answer: "Currently, user types (Manager/Superintendent) cannot be changed after registration. If you need both types of access, you would need to create separate accounts."
        },
        {
          question: "How do I delete my account?",
          answer: "Contact our support team at support@shipinport.com to request account deletion. We'll process your request and ensure your data is removed in accordance with our privacy policy."
        },
        {
          question: "Is my personal information secure?",
          answer: "Yes, we implement industry-standard security measures including encryption, secure authentication, and regular security audits. See our Privacy Policy for detailed information."
        }
      ]
    },
    {
      category: "Billing & Payments",
      questions: [
        {
          question: "How are payments handled?",
          answer: "ShipinPort does not handle payments between users. All financial transactions are arranged directly between vessel managers and superintendents. We recommend using secure payment methods and clear contracts."
        },
        {
          question: "Are there any platform fees?",
          answer: "No, there are no platform fees for using ShipinPort. We provide the networking platform free of charge to facilitate professional connections."
        },
        {
          question: "How should I structure payment terms?",
          answer: "Establish clear payment terms in your service agreement, including rates, payment schedules, and any additional costs (travel, accommodation, etc.)."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-dark-900">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Frequently Asked <span className="text-primary-400">Questions</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Find answers to common questions about <span className="text-blue-700">Ship</span><span className="text-red-500">in</span><span className="text-blue-700">Port.com</span> and our marine professional networking platform.
          </p>
        </div>

        <div className="space-y-12">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="glass p-8 rounded-xl">
              <h2 className="text-2xl font-bold text-white mb-6 pb-4 border-b border-dark-600">
                {category.category}
              </h2>
              
              <div className="space-y-6">
                {category.questions.map((faq, faqIndex) => (
                  <div key={faqIndex} className="border-l-4 border-primary-600 pl-6">
                    <h3 className="text-lg font-semibold text-white mb-3" dangerouslySetInnerHTML={{
                      __html: faq.question.replace(/ShipinPort\.com?/g, (match) => {
                        if (match === 'ShipinPort') {
                          return '<span class="text-blue-700">Ship</span><span class="text-red-500">in</span><span class="text-blue-700">Port</span>';
                        } else {
                          return '<span class="text-blue-700">Ship</span><span class="text-red-500">in</span><span class="text-blue-700">Port.com</span>';
                        }
                      })
                    }} />
                    <p className="text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{
                      __html: faq.answer.replace(/ShipinPort\.com?/g, (match) => {
                        if (match === 'ShipinPort') {
                          return '<span class="text-blue-700">Ship</span><span class="text-red-500">in</span><span class="text-blue-700">Port</span>';
                        } else {
                          return '<span class="text-blue-700">Ship</span><span class="text-red-500">in</span><span class="text-blue-700">Port.com</span>';
                        }
                      })
                    }} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-16 text-center">
          <div className="glass p-8 rounded-xl">
            <h2 className="text-2xl font-bold text-white mb-4">Still Have Questions?</h2>
            <p className="text-gray-300 mb-6">
              Can't find the answer you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
              >
                Contact Support
              </a>
              <a
                href="mailto:support@shipinport.com"
                className="bg-dark-700 hover:bg-dark-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
              >
                Email Us
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
