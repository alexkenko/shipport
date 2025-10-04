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
    <section className="relative overflow-hidden parallax-hero min-h-screen flex items-center">
      {/* Animated Background Layers */}
      <div className="absolute inset-0 maritime-bg">
        {/* Wave Animations */}
        <div className="absolute bottom-0 left-0 w-full h-32 parallax-bg">
          <svg className="absolute bottom-0 w-full h-full animate-wave opacity-20" viewBox="0 0 1200 200">
            <path fill="#1e40af" d="M0,100 C150,50 350,150 600,100 C850,50 1050,150 1200,100 L1200,200 L0,200 Z" />
          </svg>
          <svg className="absolute bottom-0 w-full h-full animate-wave-reverse opacity-15" viewBox="0 0 1200 200">
            <path fill="#0f766e" d="M0,120 C200,70 400,170 600,120 C800,70 1000,170 1200,120 L1200,200 L0,200 Z" />
          </svg>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 text-6xl animate-float opacity-30">🚢</div>
        <div className="absolute top-32 right-20 text-5xl animate-float-reverse opacity-25">⚓</div>
        <div className="absolute bottom-40 left-20 text-4xl animate-float-horizontal opacity-20">🏗️</div>
        <div className="absolute top-1/3 right-1/4 text-5xl animate-ship-bob opacity-30">🚢</div>
        <div className="absolute bottom-1/3 left-1/3 text-6xl animate-crane-swing opacity-25">🏗️</div>
        
        {/* Animated Particles */}
        <div className="absolute top-0 left-0 w-2 h-2 bg-blue-400 rounded-full animate-particles opacity-60" style={{animationDelay: '0s'}}></div>
        <div className="absolute top-0 left-1/4 w-1 h-1 bg-cyan-400 rounded-full animate-particles opacity-40" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-0 left-1/2 w-2 h-2 bg-green-400 rounded-full animate-particles opacity-50" style={{animationDelay: '4s'}}></div>
        <div className="absolute top-0 left-3/4 w-1 h-1 bg-blue-500 rounded-full animate-particles opacity-60" style={{animationDelay: '6s'}}></div>
        <div className="absolute top-0 right-0 w-2 h-2 bg-teal-400 rounded-full animate-particles opacity-40" style={{animationDelay: '8s'}}></div>
      </div>

      {/* Main Hero Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24 parallax-front">
        <div className="text-center">
          {/* Animated Headline */}
          <div className="mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold text-white">
              <div 
                className={`text-3xl sm:text-5xl md:text-7xl font-extrabold animate-typing ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                style={{animationDelay: '0.2s'}}
              >
                <span className="text-blue-400">{typingTexts[currentText]}</span>
              </div>
              <span 
                className={`block text-lg sm:text-2xl md:text-3xl font-normal text-gray-300 mt-2 sm:mt-4 animate-fade-scale ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                style={{animationDelay: '0.8s'}}
              >
                <span className="text-blue-700">Ship</span>
                <span className="text-red-500">in</span>
                <span className="text-blue-700">Port.com</span>
              </span>
            </h1>
          </div>

          {/* Animated Description */}
          <p 
            className={`text-sm sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-6 sm:mb-8 max-w-4xl mx-auto px-2 animate-slide-bottom ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            style={{animationDelay: '1s'}}
          >
            #1 Professional <strong className="text-white">Marine Superintendent</strong> and <strong className="text-white">Marine Consultancy</strong> Platform. 
            Leading <strong className="text-white">Superintendancy</strong> services including vessel inspections, ISM audits, 
            <strong className="text-white"> marine consultancy</strong>, and maritime consulting worldwide.
          </p>

          {/* Animated Buttons */}
          <div 
            className={`flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center animate-fade-scale ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            style={{animationDelay: '1.2s'}}
          >
            <Link
              href="/auth/register"
              className="group relative overflow-hidden bg-gradient-to-r from-primary-600 via-primary-500 to-marine-600 hover:from-primary-500 hover:via-primary-400 hover:to-marine-500 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-2xl text-lg sm:text-xl font-bold transition-all duration-300 w-full sm:w-auto text-center shadow-2xl hover:shadow-primary-500/30 transform hover:scale-105 active:scale-95 border border-primary-400/20"
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
              
              {/* Button content */}
              <span className="relative z-10 flex items-center justify-center">
                <span className="mr-2">🚀</span>
                Create Account
              </span>
              
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-600 to-marine-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl" />
            </Link>
            
            <Link
              href="/auth/login"
              className="group relative overflow-hidden bg-white/10 backdrop-blur-md border-2 border-primary-400/50 hover:border-primary-300 text-primary-300 hover:text-white px-8 sm:px-10 py-4 sm:py-5 rounded-2xl text-lg sm:text-xl font-bold transition-all duration-300 w-full sm:w-auto text-center shadow-xl hover:shadow-primary-400/20 transform hover:scale-105 active:scale-95 hover:bg-gradient-to-r hover:from-primary-500/20 hover:to-marine-500/20"
            >
              {/* Glassmorphism effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-marine-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              
              {/* Button content */}
              <span className="relative z-10 flex items-center justify-center">
                <span className="mr-2">✨</span>
                Sign In
              </span>
              
              {/* Subtle glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-400 to-marine-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300 blur-lg" />
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Action Elements */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
        <div className="animate-bounce">
          <svg className="w-6 h-6 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  )
}
