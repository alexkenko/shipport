'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export function AnimatedHero() {
  const [currentText, setCurrentText] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  
  const typingTexts = [
    'Marine Superintendent',
    'Marine Consultancy',
    'Superintendancy Services',
    'Maritime Consulting'
  ]

  useEffect(() => {
    setIsVisible(true)
    
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % typingTexts.length)
    }, 3000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative overflow-hidden bg-dark-900 min-h-[70vh] flex items-center justify-center">
      {/* Simplified Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-marine-900/50 via-transparent to-primary-900/30"></div>

      {/* Main Hero Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        {/* Animated Headline */}
        <div 
          className={`transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight">
            <span className="block text-blue-400 transition-opacity duration-500">
              {typingTexts[currentText]}
            </span>
            <span className="block text-lg sm:text-2xl md:text-3xl font-normal text-gray-300 mt-4">
              <span className="text-blue-700">Ship</span>
              <span className="text-red-500">in</span>
              <span className="text-blue-700">Port.com</span>
            </span>
          </h1>
        </div>

        {/* Description */}
        <div 
          className={`transition-opacity duration-1000 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        >
          <p className="mt-6 max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-gray-300">
            #1 Professional <strong className="text-white">Marine Superintendent</strong> and <strong className="text-white">Marine Consultancy</strong> Platform. 
            Leading <strong className="text-white">Superintendancy</strong> services including vessel inspections, ISM audits, 
            <strong className="text-white"> marine consultancy</strong>, and maritime consulting worldwide.
          </p>
        </div>

        {/* Buttons */}
        <div 
          className={`mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center transition-opacity duration-1000 delay-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        >
          <Link
            href="/auth/register"
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 sm:px-8 rounded-lg text-base sm:text-lg font-semibold transition-all duration-200 w-full sm:w-auto min-h-[48px] flex items-center justify-center"
          >
            Create Account
          </Link>
          <Link
            href="/auth/login"
            className="border-2 border-primary-400 text-primary-400 hover:bg-primary-400 hover:text-dark-900 px-6 py-3 sm:px-8 rounded-lg text-base sm:text-lg font-semibold transition-all duration-200 w-full sm:w-auto min-h-[48px] flex items-center justify-center"
          >
            Sign In
          </Link>
        </div>
      </div>
    </section>
  )
}
