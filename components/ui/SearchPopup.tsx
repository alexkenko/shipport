'use client'

import { useEffect } from 'react'

interface SearchPopupProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchPopup({ isOpen, onClose }: SearchPopupProps) {
  useEffect(() => {
    if (isOpen) {
      // Auto-close after 3 seconds
      const timer = setTimeout(() => {
        onClose()
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-dark-800 to-dark-900 rounded-xl shadow-2xl border border-dark-600 max-w-md w-full mx-4 p-8 text-center animate-in fade-in-0 zoom-in-95 duration-300">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="space-y-6">
          {/* Logo/Icon */}
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-white">
            This search powered by
          </h2>

          {/* Company Name */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-4">
            <h3 className="text-xl font-semibold text-white">
              Pontus Maritime Services
            </h3>
          </div>

          {/* Description */}
          <p className="text-gray-300 text-sm">
            Professional maritime solutions for your vessel inspection and audit needs
          </p>

          {/* Loading indicator */}
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
