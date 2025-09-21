'use client'

import { useState, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useEmailVerification } from '@/hooks/useEmailVerification'

interface VerificationTipProps {
  userRole: 'manager' | 'superintendent'
  userEmail: string
}

export const VerificationTip = ({ userRole, userEmail }: VerificationTipProps) => {
  const { isVerified, checkVerificationStatus } = useEmailVerification()
  const [showTip, setShowTip] = useState(false)

  useEffect(() => {
    checkVerificationStatus()
  }, [checkVerificationStatus])

  useEffect(() => {
    // Show tip if user is not verified and hasn't dismissed it before
    const hasSeenTip = localStorage.getItem(`verification_tip_dismissed_${userEmail}`)
    if (!isVerified && !hasSeenTip) {
      setShowTip(true)
    }
  }, [isVerified, userEmail])

  const handleDismiss = () => {
    setShowTip(false)
    localStorage.setItem(`verification_tip_dismissed_${userEmail}`, 'true')
  }

  if (!showTip || isVerified) {
    return null
  }

  const tipMessage = userRole === 'manager' 
    ? 'Verify your email in order to be Trusted by Consultants/Superintendents'
    : 'Verify your Email in order to have more chances to be Employed'

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-xl border border-blue-500/50 p-4 relative">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-white/80 hover:text-white transition-colors"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
        
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">💡</span>
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="text-white font-semibold text-sm mb-1">
              Tip:
            </h3>
            <p className="text-white/90 text-sm leading-relaxed">
              {tipMessage}
            </p>
          </div>
        </div>
        
        <div className="mt-3 flex justify-end">
          <button
            onClick={handleDismiss}
            className="text-white/80 hover:text-white text-xs underline transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  )
}
