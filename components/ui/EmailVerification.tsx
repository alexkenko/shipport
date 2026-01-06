'use client'

import { useState, useEffect } from 'react'
import { useEmailVerification } from '@/hooks/useEmailVerification'
import { Button } from './Button'
import { VerificationBadge } from './VerificationBadge'

interface EmailVerificationProps {
  userEmail: string
  onVerificationComplete?: () => void
}

export const EmailVerification = ({ userEmail, onVerificationComplete }: EmailVerificationProps) => {
  const {
    isVerified,
    isVerifying,
    isSendingOTP,
    error,
    success,
    sendVerificationOTP,
    verifyOTP,
    checkVerificationStatus,
    clearMessages
  } = useEmailVerification()

  const [otpCode, setOtpCode] = useState('')
  const [showOTPInput, setShowOTPInput] = useState(false)

  useEffect(() => {
    checkVerificationStatus()
  }, [checkVerificationStatus])

  useEffect(() => {
    if (success && isVerified) {
      onVerificationComplete?.()
    }
  }, [success, isVerified, onVerificationComplete])

  const handleSendOTP = async () => {
    await sendVerificationOTP()
    setShowOTPInput(true)
  }

  const handleVerifyOTP = async () => {
    if (otpCode.length === 6) {
      await verifyOTP(otpCode, userEmail)
    }
  }

  const handleCancelOTP = () => {
    setShowOTPInput(false)
    setOtpCode('')
    clearMessages()
  }

  if (isVerified) {
    return (
      <div className="flex items-center gap-2">
        <VerificationBadge isVerified size="md" />
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <VerificationBadge isVerified={false} size="md" />
      {!showOTPInput && (
        <Button
          onClick={handleSendOTP}
          disabled={isSendingOTP}
          size="sm"
          variant="ghost"
          className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2 py-1"
        >
          {isSendingOTP ? 'Sending...' : 'Verify Email'}
        </Button>
      )}
      </div>

    {showOTPInput && (
      <div className="mt-2">
        <p className="text-xs text-blue-600">
          ✓ Email sent to {userEmail}. Check your inbox and spam folder.
        </p>
        <div className="flex gap-2 mt-1">
          <button
            onClick={handleSendOTP}
            disabled={isSendingOTP}
            className="text-xs text-blue-600 hover:text-blue-700 underline"
          >
            {isSendingOTP ? 'Sending...' : 'Resend'}
          </button>
          <span className="text-xs text-gray-400">•</span>
          <button
            onClick={handleCancelOTP}
            className="text-xs text-gray-500 hover:text-gray-600 underline"
          >
            Hide
          </button>
        </div>
      </div>
    )}

      {error && (
        <div className="p-4 bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 text-sm">⚠️</span>
            </div>
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-sm">✅</span>
            </div>
            <p className="text-sm text-green-700 font-medium">{success}</p>
          </div>
        </div>
      )}
    </div>
  )
}
